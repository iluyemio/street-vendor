
import React, { useEffect, useState } from 'react';
import '../styles.css';

const VendorLogin = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const mobileMenu = document.getElementById('mobile-menu');
        const navLinks = document.getElementById('nav-links');
        const cleanup: Array<() => void> = [];

        if (mobileMenu && navLinks) {
            const toggleMenu = () => {
                navLinks.classList.toggle('active');
                mobileMenu.classList.toggle('active');
            };
            mobileMenu.addEventListener('click', toggleMenu);
            cleanup.push(() => mobileMenu.removeEventListener('click', toggleMenu));
        }

        return () => cleanup.forEach((fn) => fn());
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

                if (result.user?.user_type === 'user' || result.user?.user_type === 'vendor') {
                    window.location.href = '/vendor-dashboard';
                } else if (result.user?.user_type === 'admin') {
                    window.location.href = '/admin-dashboard';
                } else {
                    setMessage('You are not registered as a vendor yet. Please wait for approval.');
                }
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
            

    <section className="login-page">
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <i className="fas fa-shield-alt brand-icon"></i>
                    <h1>Vendor Portal</h1>
                    <p>Please sign in to your account</p>
                </div>

                <form id="loginForm" onSubmit={handleSubmit}>
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

                    <button type="submit" className="btn-login" disabled={isSubmitting}>
                        {isSubmitting ? 'Logging in...' : 'Login to Dashboard'}
                    </button>
                    
                    {message && <div className="status-message" style={{color: 'red', marginTop: '10px'}}>{message}</div>}
                </form>

                <div className="login-footer">
                    <p>Don't have an account? <a href="/apply">Apply as a Vendor</a></p>
                </div>
            </div>
        </div>
    </section>
    

        </>
    );
};

export default VendorLogin;
