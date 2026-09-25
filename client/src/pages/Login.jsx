import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import backgroundImageFile from "../assets/ig.jpg";
import { toast } from "react-toastify";

export default function Login({ setToken, onClose }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* =====================================================
     CLOSE LOGIN
     ===================================================== */
  const handleClose = () => {
    if (typeof onClose === "function") {
      onClose();
      return;
    }

    navigate(-1);
  };

  /* =====================================================
     LOGIN / REGISTER
     ===================================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    /* -------------------------
       VALIDATION
       ------------------------- */

    if (isRegistering && !fullname.trim()) {
      toast.error("Full name is required");
      return;
    }

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!password) {
      toast.error("Password is required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const endpoint = isRegistering ? "register" : "login";

    const payload = isRegistering
      ? {
          fullName: fullname.trim(),
          name: fullname.trim(),
          email: email.trim().toLowerCase(),
          password,
        }
      : {
          email: email.trim().toLowerCase(),
          password,
        };

   try {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/user/${endpoint}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      /* =================================================
         REGISTRATION SUCCESS
         ================================================= */

      if (isRegistering) {
        toast.success(
          data.message ||
            "Registration successful. Please check your email and verify your account."
        );

        setIsRegistering(false);
        setFullname("");
        setEmail("");
        setPassword("");

        return;
      }

      /* =================================================
         LOGIN SUCCESS
         ================================================= */

      if (!data.token) {
        throw new Error("Login token was not received");
      }

      const userData = data.user || {
        role: data.role || "user",
        email: email.trim().toLowerCase(),
      };

      /* -------------------------
         LOCAL STORAGE
         ------------------------- */

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      localStorage.setItem(
        "userRole",
        userData.role || "user"
      );

      localStorage.setItem(
        "role",
        userData.role || "user"
      );

      localStorage.setItem(
        "isAdmin",
        String(userData.role === "admin")
      );

      /* -------------------------
         UPDATE APP TOKEN
         ------------------------- */

      if (setToken) {
        setToken(data.token);
      }

      toast.success(data.message || "Login successful");

      /* -------------------------
         CLOSE POPUP
         ------------------------- */

      if (typeof onClose === "function") {
        onClose();
      }

      /* -------------------------
         ROLE REDIRECTION
         ------------------------- */

      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Authentication error:", err);

      toast.error(
        err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     SWITCH LOGIN / REGISTER
     ===================================================== */

  const switchMode = () => {
    setIsRegistering((prev) => !prev);

    setFullname("");
    setEmail("");
    setPassword("");
  };

  return (
    <>
      {/* =================================================
          RESPONSIVE STYLES
          ================================================= */}

      <style>
        {`
          * {
            box-sizing: border-box;
          }

          .avs-login-overlay {
            position: fixed;
            inset: 0;
            width: 100%;
            height: 100%;
            min-height: 100dvh;

            display: flex;
            align-items: center;
            justify-content: center;

            padding: 20px;

            background: rgba(0, 0, 0, 0.68);

            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);

            z-index: 99999;

            overflow-y: auto;
            overflow-x: hidden;

            -webkit-overflow-scrolling: touch;
          }

          /* =================================================
             POPUP
             ================================================= */

          .avs-login-popup {
            position: relative;

            width: min(850px, 100%);
            min-height: 500px;
            max-height: 90vh;

            display: flex;

            background: #ffffff;

            border-radius: 18px;

            overflow: hidden;

            box-shadow:
              0 25px 70px rgba(0, 0, 0, 0.4);

            animation:
              avsLoginPopupIn
              0.35s
              ease
              both;

            flex-shrink: 0;
          }

          /* =================================================
             POPUP ANIMATION
             ================================================= */

          @keyframes avsLoginPopupIn {
            0% {
              opacity: 0;
              transform:
                translateY(20px)
                scale(0.97);
            }

            100% {
              opacity: 1;
              transform:
                translateY(0)
                scale(1);
            }
          }

          /* =================================================
             CLOSE BUTTON
             ================================================= */

          .avs-login-close {
            position: absolute;

            top: 14px;
            right: 14px;

            width: 40px;
            height: 40px;

            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 50%;

            border: 1px solid rgba(0, 0, 0, 0.08);

            background: #ffffff;

            color: #222222;

            font-size: 27px;
            line-height: 1;

            cursor: pointer;

            z-index: 100;

            box-shadow:
              0 4px 14px rgba(0, 0, 0, 0.14);

            transition:
              transform 0.2s ease,
              background-color 0.2s ease,
              box-shadow 0.2s ease;
          }

          .avs-login-close:hover {
            transform: rotate(90deg) scale(1.05);

            background: #f4f7f3;

            box-shadow:
              0 6px 18px rgba(0, 0, 0, 0.18);
          }

          /* =================================================
             LEFT IMAGE SECTION
             ================================================= */

          .avs-login-image {
            width: 48%;

            min-width: 0;
            min-height: 500px;

            flex: 0 0 48%;

            display: flex;
            align-items: flex-end;

            background-image:
              linear-gradient(
                rgba(10, 45, 35, 0.15),
                rgba(10, 30, 20, 0.68)
              ),
              url("${backgroundImageFile}");

            background-size: cover;
            background-position: center;

            position: relative;

            overflow: hidden;
          }

          .avs-login-image-overlay {
            width: 100%;

            padding: 45px;

            color: #ffffff;

            animation:
              avsLoginTextIn
              0.6s
              ease
              0.1s
              both;
          }

          @keyframes avsLoginTextIn {
            from {
              opacity: 0;
              transform: translateY(18px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .avs-login-brand {
            font-size: 13px;
            font-weight: 700;

            letter-spacing: 3px;

            margin-bottom: 18px;
          }

          .avs-login-image h1 {
            margin: 0 0 14px;

            font-size: 36px;
            line-height: 1.15;

            font-weight: 700;
          }

          .avs-login-image p {
            margin: 0;

            max-width: 360px;

            font-size: 15px;
            line-height: 1.7;

            color: rgba(255, 255, 255, 0.92);
          }

          /* =================================================
             FORM SECTION
             ================================================= */

          .avs-login-form-section {
            width: 52%;

            min-width: 0;

            padding: 55px 45px;

            display: flex;
            align-items: center;

            overflow-y: auto;

            background: #ffffff;

            animation:
              avsLoginFormIn
              0.5s
              ease
              0.1s
              both;
          }

          @keyframes avsLoginFormIn {
            from {
              opacity: 0;
              transform: translateX(12px);
            }

            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .avs-login-form-section form {
            width: 100%;
            min-width: 0;
          }

          /* =================================================
             TITLE
             ================================================= */

          .avs-login-title {
            color: #26342a;

            margin: 0 0 8px;

            font-size: 30px;
            line-height: 1.2;

            font-weight: 700;
          }

          .avs-login-subtitle {
            color: #777d78;

            margin: 0 0 27px;

            font-size: 14px;

            line-height: 1.5;
          }

          /* =================================================
             FORM FIELD
             ================================================= */

          .avs-login-field {
            margin-bottom: 15px;
          }

          .avs-login-label {
            display: block;

            color: #4d554f;

            font-size: 13px;
            font-weight: 600;

            margin-bottom: 7px;
          }

          .avs-login-input {
            display: block;

            width: 100%;
            min-width: 0;

            height: 47px;

            padding: 12px 15px;

            border-radius: 7px;

            border: 1px solid #d7ddd7;

            color: #222222;

            background: #ffffff;

            outline: none;

            font-size: 15px;

            font-family: inherit;

            transition:
              border-color 0.2s ease,
              box-shadow 0.2s ease,
              transform 0.2s ease;
          }

          .avs-login-input::placeholder {
            color: #a1a6a2;
          }

          .avs-login-input:focus {
            border-color: #5d7d51;

            box-shadow:
              0 0 0 3px rgba(93, 125, 81, 0.12);
          }

          /* =================================================
             FORGOT PASSWORD
             ================================================= */

          .avs-login-forgot {
            text-align: right;

            margin-bottom: 15px;
          }

          .avs-login-forgot a {
            color: #5d7d51;

            text-decoration: none;

            font-size: 14px;
            font-weight: 600;

            transition: color 0.2s ease;
          }

          .avs-login-forgot a:hover {
            color: #405c38;
            text-decoration: underline;
          }

          /* =================================================
             MAIN BUTTON
             ================================================= */

          .avs-login-submit {
            width: 100%;

            min-height: 47px;

            padding: 13px;

            background: #5d7d51;

            color: #ffffff;

            border: none;

            border-radius: 7px;

            font-family: inherit;

            font-weight: 700;

            font-size: 16px;

            margin-bottom: 10px;

            transition:
              background-color 0.2s ease,
              transform 0.2s ease,
              box-shadow 0.2s ease,
              opacity 0.2s ease;

            -webkit-tap-highlight-color: transparent;
          }

          .avs-login-submit:not(:disabled) {
            cursor: pointer;
          }

          .avs-login-submit:hover:not(:disabled) {
            background: #4e6d45;

            transform: translateY(-1px);

            box-shadow:
              0 6px 16px rgba(93, 125, 81, 0.22);
          }

          .avs-login-submit:active:not(:disabled) {
            transform: translateY(0);
          }

          /* =================================================
             CANCEL
             ================================================= */

          .avs-login-cancel {
            width: 100%;

            min-height: 45px;

            padding: 12px;

            background: #ffffff;

            color: #555d56;

            border: 1px solid #d4d9d4;

            border-radius: 7px;

            font-family: inherit;

            font-weight: 600;

            font-size: 15px;

            cursor: pointer;

            transition:
              background-color 0.2s ease,
              border-color 0.2s ease,
              transform 0.2s ease;
          }

          .avs-login-cancel:hover:not(:disabled) {
            background: #f7f9f6;

            border-color: #bcc5bc;

            transform: translateY(-1px);
          }

          /* =================================================
             SWITCH LOGIN / REGISTER
             ================================================= */

          .avs-login-toggle {
            font-size: 14px;

            color: #777d78;

            margin: 20px 0 0;

            text-align: center;

            line-height: 1.5;
          }

          .avs-login-toggle button {
            width: auto;

            padding: 0;

            margin: 0;

            border: none;

            background: transparent;

            color: #5d7d51;

            cursor: pointer;

            font-family: inherit;

            font-weight: 700;

            font-size: 14px;

            transition: color 0.2s ease;
          }

          .avs-login-toggle button:hover {
            color: #405c38;

            text-decoration: underline;
          }

          /* =================================================
             HIDDEN AUTOFILL
             ================================================= */

          .avs-login-hidden {
            position: absolute;

            opacity: 0;

            pointer-events: none;

            height: 0;
            width: 0;

            padding: 0;
            margin: 0;

            border: 0;
          }

          /* =================================================
             TABLET
             ================================================= */

          @media screen and (max-width: 900px) {

            .avs-login-overlay {
              padding: 16px;
            }

            .avs-login-popup {
              width: 100%;

              max-width: 760px;

              min-height: 460px;

              max-height: 92vh;

              border-radius: 16px;
            }

            .avs-login-image {
              flex: 0 0 43%;

              width: 43%;

              min-height: 460px;
            }

            .avs-login-image-overlay {
              padding: 32px;
            }

            .avs-login-image h1 {
              font-size: 30px;
            }

            .avs-login-image p {
              font-size: 14px;
            }

            .avs-login-form-section {
              width: 57%;

              padding: 40px 30px;
            }

            .avs-login-title {
              font-size: 28px;
            }
          }

          /* =================================================
             MOBILE - IMPORTANT
             ================================================= */

          @media screen and (max-width: 700px) {

            .avs-login-overlay {
              align-items: flex-start;

              justify-content: center;

              padding: 12px;

              overflow-y: auto;
            }

            .avs-login-popup {
              width: 100%;

              max-width: 520px;

              height: auto;

              min-height: 0;

              max-height: calc(100dvh - 24px);

              display: flex;

              flex-direction: column;

              overflow-y: auto;
              overflow-x: hidden;

              border-radius: 16px;
            }

            /* ---------------------------------------------
               MOBILE IMAGE
               --------------------------------------------- */

            .avs-login-image {
              width: 100%;

              flex: 0 0 auto;

              min-height: 200px;

              height: 200px;

              display: flex;

              align-items: flex-end;

              background-position: center 45%;
            }

            .avs-login-image-overlay {
              padding: 28px 26px 24px;
            }

            .avs-login-brand {
              font-size: 11px;

              letter-spacing: 2.5px;

              margin-bottom: 9px;
            }

            .avs-login-image h1 {
              font-size: 28px;

              margin-bottom: 8px;
            }

            .avs-login-image p {
              font-size: 13px;

              line-height: 1.45;

              max-width: 100%;
            }

            /* ---------------------------------------------
               MOBILE FORM
               --------------------------------------------- */

            .avs-login-form-section {
              width: 100%;

              padding: 30px 25px 28px;

              display: block;

              overflow: visible;
            }

            .avs-login-title {
              font-size: 26px;

              margin-bottom: 7px;
            }

            .avs-login-subtitle {
              font-size: 13px;

              margin-bottom: 22px;
            }

            .avs-login-field {
              margin-bottom: 14px;
            }

            .avs-login-label {
              font-size: 12.5px;

              margin-bottom: 6px;
            }

            .avs-login-input {
              height: 46px;

              padding: 11px 13px;

              font-size: 14px;

              border-radius: 7px;
            }

            .avs-login-forgot {
              margin-bottom: 14px;
            }

            .avs-login-forgot a {
              font-size: 13px;
            }

            .avs-login-submit {
              min-height: 46px;

              padding: 12px;

              font-size: 15px;
            }

            .avs-login-cancel {
              min-height: 44px;

              padding: 11px;

              font-size: 14px;
            }

            .avs-login-toggle {
              font-size: 13px;

              margin-top: 17px;
            }

            .avs-login-toggle button {
              font-size: 13px;
            }

            /* ---------------------------------------------
               MOBILE CLOSE BUTTON
               --------------------------------------------- */

            .avs-login-close {
              width: 36px;
              height: 36px;

              top: 10px;
              right: 10px;

              font-size: 24px;
            }
          }

          /* =================================================
             SMALL MOBILE
             ================================================= */

          @media screen and (max-width: 480px) {

            .avs-login-overlay {
              padding: 8px;
            }

            .avs-login-popup {
              max-width: 100%;

              max-height: calc(100dvh - 16px);

              border-radius: 14px;
            }

            .avs-login-image {
              height: 175px;

              min-height: 175px;
            }

            .avs-login-image-overlay {
              padding: 24px 20px 20px;
            }

            .avs-login-brand {
              font-size: 10px;

              letter-spacing: 2px;

              margin-bottom: 7px;
            }

            .avs-login-image h1 {
              font-size: 24px;

              margin-bottom: 6px;
            }

            .avs-login-image p {
              font-size: 12px;

              line-height: 1.4;
            }

            .avs-login-form-section {
              padding: 25px 18px 22px;
            }

            .avs-login-title {
              font-size: 24px;
            }

            .avs-login-subtitle {
              font-size: 12.5px;

              margin-bottom: 19px;
            }

            .avs-login-input {
              height: 45px;

              font-size: 14px;
            }

            .avs-login-submit {
              min-height: 45px;

              font-size: 14px;
            }

            .avs-login-cancel {
              min-height: 43px;

              font-size: 14px;
            }
          }

          /* =================================================
             VERY SMALL PHONES
             ================================================= */

          @media screen and (max-width: 360px) {

            .avs-login-overlay {
              padding: 6px;
            }

            .avs-login-popup {
              max-height: calc(100dvh - 12px);

              border-radius: 12px;
            }

            .avs-login-image {
              height: 150px;

              min-height: 150px;
            }

            .avs-login-image-overlay {
              padding: 20px 16px 17px;
            }

            .avs-login-brand {
              font-size: 9px;

              letter-spacing: 1.8px;

              margin-bottom: 6px;
            }

            .avs-login-image h1 {
              font-size: 21px;

              margin-bottom: 5px;
            }

            .avs-login-image p {
              font-size: 10.5px;

              line-height: 1.35;
            }

            .avs-login-form-section {
              padding: 21px 15px 18px;
            }

            .avs-login-title {
              font-size: 22px;
            }

            .avs-login-subtitle {
              font-size: 11.5px;

              margin-bottom: 17px;
            }

            .avs-login-field {
              margin-bottom: 11px;
            }

            .avs-login-label {
              font-size: 11.5px;

              margin-bottom: 5px;
            }

            .avs-login-input {
              height: 43px;

              padding: 10px 11px;

              font-size: 13px;
            }

            .avs-login-forgot a {
              font-size: 12px;
            }

            .avs-login-submit {
              min-height: 43px;

              padding: 10px;

              font-size: 13px;
            }

            .avs-login-cancel {
              min-height: 42px;

              padding: 10px;

              font-size: 13px;
            }

            .avs-login-toggle {
              font-size: 11.5px;

              margin-top: 14px;
            }

            .avs-login-toggle button {
              font-size: 11.5px;
            }

            .avs-login-close {
              width: 33px;
              height: 33px;

              top: 8px;
              right: 8px;

              font-size: 22px;
            }
          }

          /* =================================================
             LANDSCAPE MOBILE
             ================================================= */

          @media screen and (max-width: 700px) and (orientation: landscape) {

            .avs-login-overlay {
              align-items: flex-start;

              padding: 8px;
            }

            .avs-login-popup {
              max-height: calc(100dvh - 16px);

              flex-direction: row;

              max-width: 760px;
            }

            .avs-login-image {
              width: 40%;

              flex: 0 0 40%;

              height: auto;

              min-height: 430px;
            }

            .avs-login-form-section {
              width: 60%;

              padding: 28px 24px;
            }
          }

          /* =================================================
             TOUCH DEVICES
             ================================================= */

          @media (hover: none) and (pointer: coarse) {

            .avs-login-close:hover {
              transform: none;

              background: #ffffff;
            }

            .avs-login-submit:hover:not(:disabled) {
              transform: none;

              box-shadow: none;

              background: #5d7d51;
            }

            .avs-login-cancel:hover:not(:disabled) {
              transform: none;

              background: #ffffff;

              border-color: #d4d9d4;
            }
          }

          /* =================================================
             SAFETY FOR SMALL VIEWPORTS
             ================================================= */

          @media screen and (max-width: 700px) {

            .avs-login-popup,
            .avs-login-form-section,
            .avs-login-form-section form {
              max-width: 100%;
            }

            .avs-login-input,
            .avs-login-submit,
            .avs-login-cancel {
              max-width: 100%;
            }
          }
        `}
      </style>

      {/* =================================================
          OVERLAY
          ================================================= */}

      <div
        className="avs-login-overlay"
        onMouseDown={(e) => {
          if (
            e.target === e.currentTarget &&
            typeof onClose === "function"
          ) {
            onClose();
          }
        }}
      >
        {/* =================================================
            POPUP
            ================================================= */}

        <div className="avs-login-popup">

          {/* =================================================
              CLOSE BUTTON
              ================================================= */}

          <button
            type="button"
            className="avs-login-close"
            onClick={handleClose}
            aria-label="Close login"
            title="Close"
          >
            ×
          </button>

          {/* =================================================
              IMAGE SECTION
              ================================================= */}

          <div className="avs-login-image">
            <div className="avs-login-image-overlay">

              <div className="avs-login-brand">
                AVS SOLAR
              </div>

              <h1>
                Power Your Future
              </h1>

              <p>
                Clean, reliable and sustainable
                solar energy solutions for a
                brighter tomorrow.
              </p>

            </div>
          </div>

          {/* =================================================
              FORM SECTION
              ================================================= */}

          <div className="avs-login-form-section">

            <form
              onSubmit={handleSubmit}
              autoComplete="off"
            >

              {/* Hidden autofill fields */}

              <input
                type="text"
                name="prevent-autofill-username"
                autoComplete="off"
                className="avs-login-hidden"
                tabIndex="-1"
              />

              <input
                type="password"
                name="prevent-autofill-password"
                autoComplete="new-password"
                className="avs-login-hidden"
                tabIndex="-1"
              />

              {/* =================================================
                  TITLE
                  ================================================= */}

              <h2 className="avs-login-title">
                {isRegistering
                  ? "Create Account"
                  : "Welcome Back"}
              </h2>

              <p className="avs-login-subtitle">
                {isRegistering
                  ? "Register to continue with AVS Solar"
                  : "Sign in to your AVS Solar account"}
              </p>

              {/* =================================================
                  FULL NAME
                  ================================================= */}

              {isRegistering && (
                <div className="avs-login-field">

                  <label className="avs-login-label">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={fullname}
                    onChange={(e) =>
                      setFullname(e.target.value)
                    }
                    autoComplete="name"
                    required
                    className="avs-login-input"
                  />

                </div>
              )}

              {/* =================================================
                  EMAIL
                  ================================================= */}

              <div className="avs-login-field">

                <label className="avs-login-label">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  autoComplete="email"
                  required
                  className="avs-login-input"
                />

              </div>

              {/* =================================================
                  PASSWORD
                  ================================================= */}

              <div className="avs-login-field">

                <label className="avs-login-label">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete={
                    isRegistering
                      ? "new-password"
                      : "current-password"
                  }
                  required
                  minLength={6}
                  className="avs-login-input"
                />

              </div>

              {/* =================================================
                  FORGOT PASSWORD
                  ================================================= */}

              {!isRegistering && (
                <div className="avs-login-forgot">

                  <Link
                    to="/forgot-password"
                    onClick={() => {
                      if (
                        typeof onClose === "function"
                      ) {
                        onClose();
                      }
                    }}
                  >
                    Forgot Password?
                  </Link>

                </div>
              )}

              {/* =================================================
                  LOGIN / REGISTER BUTTON
                  ================================================= */}

              <button
                type="submit"
                className="avs-login-submit"
                style={{
                  opacity: loading ? 0.7 : 1,
                  cursor: loading
                    ? "not-allowed"
                    : "pointer",
                }}
                disabled={loading}
              >
                {loading
                  ? isRegistering
                    ? "Creating Account..."
                    : "Logging In..."
                  : isRegistering
                  ? "Create Account"
                  : "Log In"}
              </button>

              {/* =================================================
                  CANCEL
                  ================================================= */}

              <button
                type="button"
                className="avs-login-cancel"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </button>

              {/* =================================================
                  SWITCH LOGIN / REGISTER
                  ================================================= */}

              <p className="avs-login-toggle">

                {isRegistering
                  ? "Already have an account?"
                  : "Don't have an account?"}

                {" "}

                <button
                  type="button"
                  onClick={switchMode}
                >
                  {isRegistering
                    ? "Log In"
                    : "Register Here"}
                </button>

              </p>

            </form>

          </div>

        </div>
      </div>
    </>
  );
}