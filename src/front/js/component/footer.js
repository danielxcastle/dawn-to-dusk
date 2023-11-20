import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { Context } from "../store/appContext";
;


export const Footer = () => {
	const { store } = useContext(Context);
	const navigate = useNavigate();
	const onSubmit = (event) => {
		navigate('/contactform');
	}
	return(
		<footer className="footer text-center">
		<button className="btn btn-button" onClick={onSubmit}>Contact</button>
		

		</footer>
	)

};
