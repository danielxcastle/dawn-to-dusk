"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, ContactRequest
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import check_password_hash ,generate_password_hash
from datetime import datetime,timedelta
import os
import requests
api = Blueprint('api', __name__)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/log-in', methods=["POST"])
def check_user_identity():
    body = request.json
    email = body.get("email")
    hashed_password = body.get("hashed_password")
    print("hello")
    if email is None or hashed_password is None:
        raise APIException("Incomplete login data in the request", 400)

    user = User.query.filter_by(email=email).first()
    if user is None:
        raise APIException("User not found", 404)

    is_password_correct = user.check_password(hashed_password)

    if not is_password_correct:
        raise APIException("Wrong password! STAY OUT", 401)

    access_token = create_access_token(identity=user.id)

    return jsonify(
        access_token=access_token,
        user=user.serialize()
    ), 200


@api.route('/sign-up', methods=["POST"])
def user_sign_up():
    new_user_data = request.json
    name = new_user_data.get("name")
    email = new_user_data.get("email")
    phone = new_user_data.get("phone")
    hashed_password = new_user_data.get("hashed_password")

    if not name or not email or not hashed_password:
        raise APIException("Incomplete user data in the request", 400)


    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        raise APIException("User with this email already exists", 400)

    new_user = User(name=name, email=email, hashed_password=hashed_password, phone=phone)
    db.session.add(new_user)
    db.session.commit()

    return jsonify(message="User registered successfully"), 201

@api.route("/transfers", methods=["GET"])
@jwt_required()
def protected():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user is None:
        raise APIException("No such user!, 404")
    return jsonify(logged_in_as=user.serialize()), 200



def send_email(email,subject,token):

    try:
        # Define the reset link
        reset_link = f"{os.environ.get('FRONT_END_URL')}request_reset?token={token}"
        response = requests.post(
            f"{os.environ.get('HIDDEN_URL')}",
            auth=("api", os.environ.get('MAILGUN_KEY')),
            data={
                "from": f"Your Name <{os.environ.get('HIDDEN')}@{os.environ.get('DOMAIN')}>",
                "to": [email],
                "subject": subject,
                "text": f"Click here to reset your password: {reset_link}",  # Plain text version
                "html": f"<html><body><a href={reset_link}>Reset Password Link</a></body></html>"
            }
        )
        return response
    except Exception as error:
        print(f">>> :persevere: {error}")
        return jsonify(error), 400
@api.route('/request_reset', methods=['POST'])
def request_reset():
    email = request.json.get('email')
    user = User.query.filter_by(email=email).first()
    if user:
        token = create_access_token(identity=email)
        send_email(user.email, 'Password Reset Request', token)
        return jsonify({'message': 'If your email is in our system, you will receive a password reset link.'}) #need to get rid of "reesturl:token need to work send email function"
    return jsonify({"message":"If your email is in our system, you will receive a password reset link."}), 400
@api.route('/reset-password', methods=['PUT'])
@jwt_required()
def reset_password():
    email=get_jwt_identity()
    print(email)
    print("test")
    user = User.query.filter_by(email=email).first_or_404()
    new_password = request.json.get('new_password')
    print(new_password)
    user.hashed_password = generate_password_hash(new_password+user.salt)
    db.session.commit()
    return jsonify({'message': 'Password has been reset successfully.'})

@api.route('/contact-requests', methods=['POST'])
def create_contact_request():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        phone = data.get('phone')
        datatype = data.get('datatype')
        text = data.get('text')

        # Check for missing required fields
        if not all([name, email, datatype, text]) or phone is None:
            return jsonify({'error': 'Missing required fields'}), 400

        new_contact_request = ContactRequest(name=name, email=email, phone=phone, datatype=datatype, text=text)
        print(f"New contact request: {new_contact_request.name}, {new_contact_request.email}, {new_contact_request.phone}, {new_contact_request.datatype}, {new_contact_request.text}")

        db.session.add(new_contact_request)
        db.session.commit()

        return jsonify({'message': 'Contact request added successfully'}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error creating contact request: {str(e)}")
        return jsonify({'error': str(e)}), 500