import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const ContactForm = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [datatype, setDatatype] = useState("");
    const [text, setText] = useState("");
    const { actions, store } = useContext(Context);

    useEffect(() => {
        // Check if the user is logged in, and if so, prefill the name and email
        if (store.user) {
            setName(store.user.name);
            setEmail(store.user.email);
            setPhone(store.user.phone);
        }
    }, [store.user]);

    const onSubmit = async (event) => {
        event.preventDefault();
    
        console.log("Submitting form with values:", {
            name,
            email,
            phone,
            datatype,
            text
        });
    
        const success = await actions.contact({
            name: name,
            email: email,
            phone: phone,
            datatype: datatype,
            text: text
        });
    
        if (success) {
            navigate('/home');
        }
    };
    return (
        <div className="container">
            <form onSubmit={onSubmit}>
                <div className="row">
                    <h1>Contact</h1>
                </div>
                {store.user ? (
                    <>
                        <div className="row">
                            <p>You are logged in as {store.user.name} ({store.user.email}) {store.user.phone}.</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="row">
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="row">
                            <input
                                type="text"
                                id="email"
                                className="form-control"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="row">
                            <input
                                type="text"
                                id="phone"
                                className="form-control"
                                placeholder="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    </>
                )}
                <div className="row">
                    <h6>Is this about a new recipe or an error on our site?</h6>
                    <div className="form-check">
                        <input
                            type="radio"
                            id="website"
                            checked={datatype === 'website'}
                            onChange={() => setDatatype('website')}
                        />
                        <label htmlFor="website">
                            I want a website made
                        </label>
                    </div>
                    <div className="form-check">
                        <input
                            type="radio"
                            id="pricing"
                            checked={datatype === 'pricing'}
                            onChange={() => setDatatype('pricing')}
                        />
                        <label htmlFor="pricing">
                            I would like pricing
                        </label>
                    </div>
                </div>
                <div className="row">
                    <h6>Write us below!</h6>
                    <textarea
                        type="text"
                        id="text"
                        rows={8}
                        className="form-control"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>
                <div className="row">
                    <button className="btn btn-button" type="submit">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};
