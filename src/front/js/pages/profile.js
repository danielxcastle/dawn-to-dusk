import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { ContactForm } from "./contactform";

export const Profile = (props) => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    
    // Use ternary operator for conditional rendering
    return (
        <div className="container">
            {store.accessToken ? (
                <div>
                    <h1>{"Welcome " + store?.user?.name + "!"}</h1>
                    <br />
                    <ContactForm />
                </div>
            ) : (
                // If accessToken is undefined, navigate to "/"
                navigate("/")
            )}
        </div>
    );
};