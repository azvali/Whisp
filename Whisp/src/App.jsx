import './App.css'

function App() {

  return (
    <>
      <div className="Login-container">
        <div className="Login-box">
          <h1>Whisp</h1>
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <button> Login</button>
          <p>Don't have an account? <a href="#">Sign up</a></p>
        </div>
      </div>
    </>
  )
}

export default App
