import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const { username, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      navigate('/invoices');
    } catch (error) {
      console.error('Failed to log in', error);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;