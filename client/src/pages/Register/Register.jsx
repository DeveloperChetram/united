import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'Executive',
  });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const { username, password, role } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/invoices');
    } catch (error) {
      console.error('Failed to register', error);
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
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
        <div className="form-group">
          <label>Role</label>
          <select name="role" value={role} onChange={onChange}>
            <option value="Executive">Executive</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;