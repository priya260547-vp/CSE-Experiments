import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/login", {
        email,
        password
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Login failed"
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>🎓 Student Portal</h1>

        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            Login
          </button>
        </form>

        {error && (
          <p className="error">{error}</p>
        )}

        <div className="demo-login">
          <p><b>Admin:</b></p>
          <p>admin@gmail.com</p>
          <p>admin123</p>

          <p><b>Student:</b></p>
          <p>student@gmail.com</p>
          <p>student123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;