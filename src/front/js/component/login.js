import React, { useContext, useState, useEffect, useRef } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Login = (props) => {
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = async (event) => {
        const success = await actions.logIn({ email: email, hashed_password: password });
        if (success) {
            navigate("/home", { state: (Math.random()) });
        }
    };

    const onSignup = () => {
        navigate("/sign-up");
    };
    const onForgot = () => {
        navigate("/sendtoken")
    }

    return (
        <div className="text-center mt-2">
            <h1>Log in</h1>
            <input
                className="form-control mt-3"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            ></input>
            <input
                className="form-control mt-3"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            ></input>
            <button className="btn btn-button m-2" onClick={onSubmit}>
                Log in
            </button>
            <button className="btn btn-button m-2" onClick={onSignup}>
                Sign Up!
            </button>
            <br></br>
            <button onClick={onForgot} className="btn btn-button">Forgot Password?</button>
        </div>
    );
};
