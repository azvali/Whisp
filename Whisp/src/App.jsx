import "./App.css";
import { useState, useEffect } from "react";
import Dashboard from "./screens/Dashboard.jsx";
import PasswordReset from "./screens/PasswordReset.jsx";

const LoginView = ({
  handleLogin,
  username,
  setUsername,
  password,
  setPassword,
  setCurrentView,
}) => (
  <>
    <h1>Whisp</h1>
    <input
      type="text"
      placeholder="Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <button onClick={(e) => handleLogin(e)}>Login</button>
    <p>
      Don't have an account?
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setCurrentView("signup");
        }}
      >
        {" "}
        Sign up
      </a>
    </p>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        setCurrentView("forgotPassword");
      }}
    >
      Forgot Password?
    </a>
  </>
);

const SignUpView = ({
  handleSignUp,
  setCurrentView,
  signUpUsername,
  setSignUpUsername,
  email,
  setEmail,
  signUpPassword,
  setSignUpPassword,
  confirmPassword,
  setConfirmPassword,
}) => (
  <>
    <h1>Sign up</h1>

    <div className="signupInput">
      <input
        type="text"
        id="username"
        className="Username"
        placeholder="Username"
        value={signUpUsername}
        onChange={(e) => setSignUpUsername(e.target.value)}
      />
    </div>

    <div className="signupInput">
      <input
        type="text"
        id="email"
        className="Email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>

    <div className="signupInput">
      <input
        type="password"
        id="password"
        className="Password"
        placeholder="Password"
        value={signUpPassword}
        onChange={(e) => setSignUpPassword(e.target.value)}
      />
    </div>

    <div className="signupInput">
      <input
        type="password"
        id="confirmpassword"
        className="confirmPassword"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
    </div>

    <button onClick={(e) => handleSignUp(e)}>Sign Up</button>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        setCurrentView("login");
      }}
    >
      Go Back
    </a>
  </>
);

const NewPasswordView = ({
  newPassword,
  setNewPassword,
  confirmNewPassword,
  setConfirmNewPassword,
  setCurrentView,
  setIsPasswordReset,
}) => (
  <>
    <h1>Reset Your Password</h1>

    <input
      type="password"
      placeholder="New password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
    />

    <input
      type="password"
      placeholder="Confirm Password"
      value={confirmNewPassword}
      onChange={(e) => setConfirmNewPassword(e.target.value)}
    />

    <button
      onClick={(e) => {
        e.preventDefault();
        // handleResetPassword(e);
      }}
    >
      Reset Password
    </button>

    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        setIsPasswordReset(false);
        setCurrentView("login");
      }}
    >
      Back to Login
    </a>
  </>
);

const ForgotPasswordView = ({
  handleForgotPassword,
  setCurrentView,
  resetEmail,
  setResetEmail,
}) => (
  <>
    <h1>Reset Password</h1>
    <input
      type="text"
      placeholder="Email"
      className=""
      value={resetEmail}
      onChange={(e) => setResetEmail(e.target.value)}
    />
    <button
      onClick={(e) => {
        e.preventDefault();
        handleForgotPassword(e);
      }}
    >
      Send Link
    </button>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        setCurrentView("login");
      }}
    >
      Go Back
    </a>
  </>
);

function App() {
  //sets the default current view and will change screens
  const [currentView, setCurrentView] = useState("login");

  const [resetToken, setResetToken] = useState("");
  const [emailHeader, setEmailHeader] = useState("");
  const [isPasswordReset, setIsPasswordReset] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const tokenparam = urlParams.get("token");
    const emailparam = urlParams.get("email");

    if (tokenparam && emailparam) {
      setEmailHeader(emailparam);
      setResetToken(tokenparam);
      setIsPasswordReset(true);
      // setCurrentView("resetPassword");
      console.log("set new pass view");
    }
  }, []);

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  //input fields for the login page
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //input fields for the sign up page
  const [signupusername, setSignUpUsername] = useState("");
  const [email, setEmail] = useState("");
  const [signuppassword, setSignUpPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");

  //input field for the forgot password page
  const [resetemail, setResetEmail] = useState("");

  //stores user data when logged in and validates login session.
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    const storedUserData = localStorage.getItem("userData");

    if (storedAuth === "true" && storedUserData) {
      setIsAuthenticated(true);
      setUserData(JSON.parse(storedUserData));
    }

    setIsLoading(false);
  }, []);

  //handles api request when new user signs up
  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!signupusername || !signuppassword || !email) {
      alert("Please fill in the fields.");
      return;
    }

    if (signuppassword != confirmpassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: signupusername,
          email: email,
          password: signuppassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Signup successful!");
        setCurrentView("login");
        setSignUpUsername("");
        setEmail("");
        setSignUpPassword("");
        setConfirmPassword("");
      } else {
        alert(`Signup failed: ${data.error || "Unknown error"}`);
      }
    } catch (e) {
      console.log(e);
    }
  };

  //handles api request when user tries to login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Missing username or password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.Message == "Login Success") {
        setUserData(data);
        setIsAuthenticated(true);

        localStorage.setItem("isAuthenticated", "true");
      } else {
        alert(data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!resetemail) {
      alert("Invalid Email");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/forgotpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetemail,
        }),
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  //clears screen while fething if user is already logged in
  if (isloading) {
    return <></>;
  }

  return (
    <>
      {isAuthenticated ? (
        <Dashboard userData={userData} isAuthenticated={isAuthenticated} />
      ) : (
        <div className="Login-container">
          <div className="Login-box">
            {isPasswordReset ? (
              <NewPasswordView
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmNewPassword={confirmNewPassword}
                setConfirmNewPassword={setConfirmNewPassword}
                setCurrentView={setCurrentView}
                setIsPasswordReset={setIsPasswordReset}
              />
            ) : (
              <>
                {currentView === "login" && (
                  <LoginView
                    username={username}
                    setUsername={setUsername}
                    password={password}
                    setPassword={setPassword}
                    setCurrentView={setCurrentView}
                    handleLogin={handleLogin}
                  />
                )}
                {currentView === "signup" && (
                  <SignUpView
                    setCurrentView={setCurrentView}
                    signUpUsername={signupusername}
                    setSignUpUsername={setSignUpUsername}
                    email={email}
                    setEmail={setEmail}
                    signUpPassword={signuppassword}
                    setSignUpPassword={setSignUpPassword}
                    confirmPassword={confirmpassword}
                    setConfirmPassword={setConfirmPassword}
                    handleSignUp={handleSignUp}
                  />
                )}
                {currentView === "forgotPassword" && (
                  <ForgotPasswordView
                    setCurrentView={setCurrentView}
                    resetEmail={resetemail}
                    setResetEmail={setResetEmail}
                    handleForgotPassword={handleForgotPassword}
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
