
import React, { useEffect, useState } from 'react';
import '../styles.css';

const AdminLogin = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const mobileMenu = document.getElementById('mobile-menu');
        const navLinks = document.getElementById('nav-links');
        
        if (mobileMenu && navLinks) {
            const toggleMenu = () => {
                navLinks.classList.toggle('active');
                mobileMenu.classList.toggle('active');
            };
            const handleClick = (e: MouseEvent) => e.preventDefault();
            mobileMenu.addEventListener('click', toggleMenu);
            return () => {
                mobileMenu.removeEventListener('click', toggleMenu);
            };
        }

        // Handle form submission
        const form = document.getElementById('adminLoginForm') as HTMLFormElement;
        if (form) {
            form.addEventListener('submit', handleSubmit);
            return () => form.removeEventListener('submit', handleSubmit);
        }
    }, []);

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        const form = e.target as HTMLFormElement;
        const email = (form.querySelector('#email') as HTMLInputElement).value;
        const password = (form.querySelector('#password') as HTMLInputElement).value;

        try {
            const response = await fetch('http://localhost:3000/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (result.access_token) {
                localStorage.setItem('token', result.access_token);
                localStorage.setItem('user', JSON.stringify(result.user));
                window.location.href = '/admin-dashboard';
            } else {
                setMessage('Invalid credentials');
            }
        } catch (error) {
            setMessage('Network error. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <>
            

    <section className="admin-login-page">
        <div className="admin-login-container">
        <div className="admin-login-card">
            <div className="admin-login-header">
                <i className="fa-solid fa-user"></i>
                <h1>Administrator Portal</h1>
                <p>Please sign in to your account</p>
            </div>

            <form id="adminLoginForm">
                <div className="input-group">
                    <label htmlFor="email">Email Address</label>
                    <div className="input-wrapper">
                        <i className="fas fa-envelope"></i>
                        <input type="email" id="email" placeholder="name@company.com" required />
                    </div>
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-wrapper">
                        <i className="fas fa-lock"></i>
                        <input type="password" id="password" placeholder="••••••••" required />
                    </div>
                </div>

                <div className="form-options">
                    <label className="remember-me">
                        <input type="checkbox" /> Remember me
                    </label>
                    <a href="#" className="forgot-password">Forgot password?</a>
                </div>

                <button type="submit" className="admin-btn-login" disabled={isSubmitting}>
                    {isSubmitting ? 'Logging in...' : 'Login to Dashboard'}
                </button>
                
                {message && <div className="status-message" style={{color: 'red', marginTop: '10px'}}>{message}</div>}
            </form>
        </div>
    </div>
    </section>
        
        
        </>
    );
};

export default AdminLogin;
