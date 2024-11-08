import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Login successful");
                localStorage.setItem('isLoggedIn', 'true');
                navigate('/home');
            } else {
                alert(data.message || "Login failed");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className='border-container'>
            <div className="login-container">
                <div className='welcome-back-container'>
                    <h1> Welcome Back! </h1>
                </div>

                <div className='login-info-container'>
                    <div><h2>Login</h2></div>
                    <form onSubmit={handleLogin}>
                        <div className='more-login-text-css'>Welcome back! Please login to your account.</div>
                        <div className='username-text-css'>User Name</div>
                        <div><input className='input-box' type="text" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                        <div className='password-text-css'>Password</div>
                        <div><input className='input-box' type="password" value={password} onChange={(e) => setPassword(e.target.value)} /> </div>
                        <button className='login-button' type='submit'>Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
