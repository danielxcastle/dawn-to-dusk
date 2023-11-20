from flask_sqlalchemy import SQLAlchemy
from api.utils import APIException
from base64 import b64encode
import os
from sqlalchemy.orm import relationship, backref
from werkzeug.security import generate_password_hash, check_password_hash
db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(25), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    hashed_password = db.Column(db.String(240), unique=False, nullable=False)
    salt = db.Column(db.String(120), nullable=False)

    
    
    
    
    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "phone":self.phone,
            "name": self.name
        }

    def __init__(self, name, hashed_password, email, phone):
        already_exists = User.query.filter_by(name=name).one_or_none()
        if already_exists is not None:
            raise APIException("User already exists", 400)
        self.salt = b64encode(os.urandom(32)).decode("utf-8")
        self.hashed_password = generate_password_hash(hashed_password + self.salt)
        self.name = name
        self.email = email
        self.phone = phone

        db.session.add(self)
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise APIException(str(e), 500)
        
    def check_password(self, password_to_check):
        return check_password_hash(self.hashed_password, f"{password_to_check}{self.salt}")
    
class ContactRequest(db.Model):
    __tablename__ = 'contact requests'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(75), unique=False, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100), unique=False, nullable=False)
    datatype = db.Column(db.String(25), nullable=False)
    text = db.Column(db.String(400), nullable=False)

    def __repr__(self):
        return f'<Contact {self.email}>'



def add_contact_request(name, email, datatype, text, phone):
    new_contact_request = ContactRequest(name=name, email=email, phone=phone, datatype=datatype, text=text)
    db.session.add(new_contact_request)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()

