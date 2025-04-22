import './App.css'
import { useState } from 'react'


const LoginView = ({ username, setUsername, password, setPassword, setCurrentView }) => (
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
    <button>Login</button>
    <p>
      Don't have an account? 
      <a href="#" onClick={(e) => {e.preventDefault(); setCurrentView('signup');}}> Sign up</a>
    </p>
    <a href='#' onClick={(e) => {e.preventDefault(); setCurrentView('forgotPassword');}}>Forgot Password?</a>
  </>
)


const SignUpView = ({ handleSignUp, setCurrentView, signUpUsername, setSignUpUsername, email, setEmail, signUpPassword, setSignUpPassword, confirmPassword, setConfirmPassword }) => (
  <>
    <h1>Sign up</h1>

    <div className='signupInput'>
      <input 
        type='text' 
        id='username' 
        className='Username' 
        placeholder='Username'
        value={signUpUsername} 
        onChange={(e) => setSignUpUsername(e.target.value)}/>
    </div>

    <div className='signupInput'>
      <input 
        type='text' 
        id='email' 
        className='Email' 
        placeholder='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
    </div>

    <div className='signupInput'>
      <input 
        type='password' 
        id='password' 
        className='Password'
        placeholder='Password'
        value={signUpPassword}
        onChange={(e) => setSignUpPassword(e.target.value)}
      />
    </div>

    <div className='signupInput'>
      <input 
        type='password' 
        id='confirmpassword' 
        className='confirmPassword'
        placeholder='Confirm Password'
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
    </div>
    
    <button onClick={(e) => handleSignUp(e)}>Sign Up</button>
    <a href='#' onClick={(e) => {e.preventDefault(); setCurrentView('login');}}>Go Back</a>
  </>
)



const ForgotPasswordView = ({ setCurrentView, resetEmail, setResetEmail }) => (
  <>
    <h1>Reset Password</h1>
    <input 
      type='text' 
      placeholder='Email'
      className=''
      value={resetEmail}
      onChange={(e) => setResetEmail(e.target.value)}
    />
    <button>Send Link</button>
    <a href='#' onClick={(e) => {e.preventDefault(); setCurrentView('login');}}>Go Back</a>
  </>
)

function App() {
  const [currentView, setCurrentView] = useState('login')

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [signupusername, setSignUpUsername] = useState('')
  const [email, setEmail] = useState('')
  const [signuppassword, setSignUpPassword] = useState('')
  const [confirmpassword, setConfirmPassword] = useState('')

  const [resetemail, setResetEmail] = useState('')

  const handleSignUp = async (e) => {
    e.preventDefault()

    if(!signupusername || !signuppassword || !email){
      alert('Please fill in the fields.');
      return;
    }
  
    if(signuppassword != confirmpassword){
      alert('Passwords do not match');
      return;
    }
  
    try{

      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: signupusername,
          email: email,
          password: signuppassword
        }),
      });

      const data = await response.json();

      if(response.ok){
        alert('Signup successful!');
        setCurrentView('login');
        setSignUpUsername('');
        setEmail('');
        setSignUpPassword('');
        setConfirmPassword('');
      }
      else {
        alert(`Signup failed: ${data.error || 'Unknown error'}`);
      }
    }catch(e){
      console.log(e);
    }
  
  }

  return (
    <>
      <div className="Login-container">
        <div className="Login-box">
          {currentView === 'login' && 
            <LoginView 
              username={username} 
              setUsername={setUsername} 
              password={password} 
              setPassword={setPassword} 
              setCurrentView={setCurrentView} 
            />
          }
          {currentView === 'signup' && 
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
          }
          {currentView === 'forgotPassword' && 
            <ForgotPasswordView 
              setCurrentView={setCurrentView} 
              resetEmail={resetemail}
              setResetEmail={setResetEmail}
            />
          }
        </div>
      </div>
    </>
  )
}

export default App
