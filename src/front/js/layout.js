import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Home } from "./pages/home";
import { Sendtoken } from "./pages/requestingreset";
import injectContext from "./store/appContext";
import { ResetPassword } from "./pages/resetpassword";
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import { SignUp } from "./pages/signup";
import { Profile } from "./pages/profile";
import { ContactForm } from "./pages/contactform";

const Layout = () => {
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Home />} path="/home" />
                        <Route element={<SignUp />} path="/sign-up" />
                        <Route element={<ResetPassword />} path="/request_reset" />
                        <Route element={<Profile />} path="/profile" />
                        <Route element={<ContactForm />} path="/contactform" />
                        <Route element={<Sendtoken />} path="/sendtoken" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
