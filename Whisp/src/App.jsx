import "./App.css";
import { useState, useEffect } from "react";
import Dashboard from "./screens/Dashboard.jsx";
import PasswordReset from "./screens/PasswordReset.jsx";
import { API_URL } from "./config.js";


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
  signupusername,
  setSignUpUsername,
  email,
  setEmail,
  signuppassword,
  setSignUpPassword,
  confirmpassword,
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
        value={signupusername}
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
        value={signuppassword}
        onChange={(e) => setSignUpPassword(e.target.value)}
      />
    </div>

    <div className="signupInput">
      <input
        type="password"
        id="confirmpassword"
        className="confirmPassword"
        placeholder="Confirm Password"
        value={confirmpassword}
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
  handlePasswordReset,
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
        handlePasswordReset(e);
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
  const [isPasswordReset, setIsPasswordReset] = useState(false);



  //search for jwt for password reset in url
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const tokenparam = urlParams.get("token");

    if (tokenparam) {
      setResetToken(tokenparam);
      setIsPasswordReset(true);
      setCurrentView("resetPassword");
    }

    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
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



  //
  useEffect(() => {
    const cookie = document.cookie.split(';').find(c => c.trim().startsWith('isAuthenticated='));
    const storedAuth = cookie ? cookie.split('=')[1].trim() : null;

    if (storedAuth === "true") {
      setIsAuthenticated(true);
      
      // Try to recover userData from localStorage
      try {
        const savedUserData = localStorage.getItem('userData');
        if (savedUserData) {
          const parsedUserData = JSON.parse(savedUserData);
          console.log("Recovered user data from localStorage:", parsedUserData);
          setUserData(parsedUserData);
        } else {
          console.warn("User is authenticated but no userData found in localStorage");
        }
      } catch (error) {
        console.error("Error recovering userData from localStorage:", error);
      }
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
      console.log(API_URL)
      const response = await fetch(`${API_URL}/api/signup/`, {
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
      console.log('Attempting to login with URL:', `${API_URL}/api/login/`);
      const response = await fetch(`${API_URL}/api/login/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        credentials: 'omit',
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();
    

      if (response.ok && data.Message === "Login Success") {
        setUserData(data);
        localStorage.setItem('userData', JSON.stringify(data));
        setIsAuthenticated(true);
        document.cookie = "isAuthenticated=true; max-age=86400; path=/";
        setUsername('')
        setPassword('')
      } else {
        alert(data.Message || 'Unknown error');
      }
    } catch (e) {
      console.error('Login error:', e);
      alert('Failed to connect to server. Please check the console for details.');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!resetemail) {
      alert("Invalid Email");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/forgotpassword/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetemail,
        }),
      });

      const data = await response.json();
      alert(data.Message);
      setResetEmail("");
      setCurrentView("login");
    } catch (error) {
      console.log(error);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmNewPassword) {
      alert("Password missing.");
      return;
    }

    if (newPassword != confirmNewPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!resetToken) {
      alert("Invalid token.");
      return;
    }

    
    try {
      const response = await fetch(`${API_URL}/api/handlereset/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: newPassword,
          confirmPassword: confirmNewPassword,
          token: resetToken,
        }),
      });

      const data = await response.json();

      alert(data.Message);
      setCurrentView("login");
      setIsPasswordReset(false);
      setNewPassword("");
      setConfirmNewPassword("");
      setResetToken("");
    } catch (e) {
      console.log(e);
    }
  };


    
  //clears screen while fething if user is already logged in
  if (isloading) {
    return <></>;
  }

  return (
    <>
      {isAuthenticated ? (
        <Dashboard 
          userData={userData} 
          isAuthenticated={isAuthenticated} 
          setIsAuthenticated={setIsAuthenticated} 
          setUserData={setUserData}
          setCurrentView={setCurrentView} 
        />
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
                handlePasswordReset={handlePasswordReset}
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
