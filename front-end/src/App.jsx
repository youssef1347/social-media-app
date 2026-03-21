import React, { useContext, useEffect } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Register } from "./pages/Register/Register";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";
import { Login } from "./pages/Login/Login";
import { VerifyEmail } from "./pages/VerifyEmail/VerifyEmail";
import { ForgotPassword } from "./pages/ForgotPassword/ForgotPassword";
import "bootstrap/dist/css/bootstrap.min.css";
import { Home } from "./pages/Home/Home";
import { CreatePost } from "./pages/CreatePost/CreatePost";
import { ResetPassword } from "./pages/ResetPassword/ResetPassword";
import { Profile } from "./pages/Profile/Profile";
import { EditProfile } from "./pages/EditProfile/EditProfile";
import { AccountPrivacy } from "./pages/AccountPrivacy/AccountPrivacy";
import { ThemeContext } from "./context/ThemeContext.jsx";
import "./index.css";
import { CloseFriends } from "./pages/CloseFriends/CloseFriends.jsx";

export const App = () => {
  const { darkTheme } = useContext(ThemeContext);

  useEffect(() => {
    document.body.classList.toggle("dark", localStorage.getItem("darkTheme") === "true");
  }, [darkTheme]);

  return (
    <>
      <ToastContainer position="top-left" />
      <Toaster />

      {/* auth pages routes */}

      <Routes>
        {/* if user isn't logged in show auth pages */}
        <Route path="/register" Component={Register} />
        <Route path="/login" Component={Login} />
        <Route path="/verify-email" Component={VerifyEmail} />
        <Route path="/forgot-password" Component={ForgotPassword} />
        <Route path="/reset-password" Component={ResetPassword} />

        <Route path="/" Component={Home} />
        <Route path="/create-post" Component={CreatePost} />
        <Route path="/:id" Component={Profile} />
        <Route path="/settings/edit-profile" Component={EditProfile} />
        <Route path="/settings/account-privacy" Component={AccountPrivacy} />
        <Route path="/settings/close-friends" Component={CloseFriends} />
      </Routes>
    </>
  );
};

export default App;
