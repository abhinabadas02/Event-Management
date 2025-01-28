import React, { useState } from 'react';
import api from './api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem('token', response.data.token);
      window.location.href = '/events';
    } catch (err) {
      console.error('Login failed:', err.response?.data?.error || err.message);
    }
  };

 

  return (
    <div style={{paddingTop:"15vh"}}>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      
    </div>
  );
};

export default Login;