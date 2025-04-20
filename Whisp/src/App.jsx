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
      <a href="#" onClick={(e) => {e.preventDefault(); setCurrentView('signup')}}> Sign up</a>
    </p>
    <a href='#' onClick={(e) => {e.preventDefault(); setCurrentView('forgotPassword')}}>Forgot Password?</a>
  </>
)

const SignUpView = ({ setCurrentView, signUpUsername, setSignUpUsername, email, setEmail, signUpPassword, setSignUpPassword, confirmPassword, setConfirmPassword }) => (
  <>
    <h1>Sign up</h1>

    <div className='signupInput'>
      <p htmlFor='username'>Username</p>
      <input 
        type='text' 
        id='username' 
        className='Username' 
        value={signUpUsername} 
        onChange={(e) => setSignUpUsername(e.target.value)}/>
    </div>

    <div className='signupInput'>
      <p htmlFor='email'>Email</p>
      <input 
        type='text' 
        id='email' 
        className='Email' 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
    </div>

    <div className='signupInput'>
      <p htmlFor='password'>Password</p>
      <input 
        type='password' 
        id='password' 
        className='Password'
        value={signUpPassword}
        onChange={(e) => setSignUpPassword(e.target.value)}
      />
    </div>

    <div className='signupInput'>
      <p htmlFor='confirmpassword'>Confirm Password</p>
      <input 
        type='password' 
        id='confirmpassword' 
        className='confirmPassword'
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
    </div>
    
    <button>Sign Up</button>
    <a href='#' onClick={(e) => {e.preventDefault(); setCurrentView('login')}}>Go Back</a>
  </>
)

const ForgotPasswordView = ({ setCurrentView, resetEmail, setResetEmail }) => (
  <>
    <h1>Reset Password</h1>
    <p>Enter Email</p>
    <input 
      type='text' 
      className=''
      value={resetEmail}
      onChange={(e) => setResetEmail(e.target.value)}
    />
    <button>Send Link</button>
    <a href='#' onClick={(e) => {e.preventDefault(); setCurrentView('login')}}>Go Back</a>
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
