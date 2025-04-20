import './App.css'
import { useState } from 'react'
function App() {

  const [currentView, setCurrentView] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const LoginView = () => (
        <>
          <h1>Whisp</h1>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <button > Login</button>
          <p>Don't have an account? <a href="#" onClick={(e) => {e.preventDefault; setCurrentView('signup')}}>Sign up</a></p>
          <a href='#' onClick={(e) => {e.preventDefault; setCurrentView('forgotPassword')}}>Forgot Password?</a>
        </>
  )


  // const handleLogin = () => (
    
  // )


  const SignUpView = () => (
  <>
    <h1>Sign up</h1>

    <div className='signupInput'>
      <p htmlFor='username'>Username</p>
      <input type='text' id='username' className='Username'></input>
    </div>

    <div className='signupInput'>
      <p htmlFor='email'>Email</p>
      <input type='text' id='email' className='Email'></input>
    </div>

    <div className='signupInput'>
      <p htmlFor='password'>Password</p>
      <input type='password' id='password' className='Password'></input>
    </div>

    <div className='signupInput'>
      <p htmlFor='confirmpassword'>Confirm Password</p>
      <input type='password' id='confirmpassword' className='confirmPassword'></input>
    </div>
    
    <button>Sign Up</button>
    <a href='#' onClick={(e) => {e.preventDefault(); setCurrentView('login')}}>Go Back</a>
  </>
  )

  const ForgotPasswordView = () => (
    <>
      <h1>Reset Password</h1>
      <p>Enter Email</p>
      <input type='text' className=''></input>
      <button>Send Link</button>
      <a href='#' onClick={(e) => {e.preventDefault(); setCurrentView('login')}}>Go Back</a>
    </>
  )

  return (
    <>
      <div className="Login-container">
        <div className="Login-box">
          {currentView === 'login' && <LoginView/>}
          {currentView === 'signup' && <SignUpView/>}
          {currentView === 'forgotPassword' && <ForgotPasswordView/>}
        </div>
      </div>
    </>
  )
}

export default App
