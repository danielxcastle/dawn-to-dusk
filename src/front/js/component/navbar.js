import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Login } from "./login";
import { LoggedIn } from "./loggedin";
import { Context } from "../store/appContext";
import NavImg from "../../img/nav-img.png";

export const Navbar = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
  
    const [dropdownOpen, setDropdownOpen] = useState(false);
  
    const handleLogoClick = () => {
      navigate("/home");
    };
  
    const toggleDropdown = () => {
      setDropdownOpen(!dropdownOpen);
    };
  
    return (
      <nav className="navbar">
        <div className="col-3">
          <img
            src={NavImg}
            className="navbar-logo"
            onClick={handleLogoClick}
          />
        </div>
        <div className="col-6"></div>
        <div className="col-3">
          <div className="dropdown-container">
            <button onClick={toggleDropdown} className="btn btn-button">
              Menu
            </button>
            {dropdownOpen && (
              <div className="top-right-nav">
                {store.accessToken !== undefined ? (
                  <LoggedIn toggleDropdown={toggleDropdown} />
                ) : (
                  <Login />
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    );
  };
  
  export default Navbar;
