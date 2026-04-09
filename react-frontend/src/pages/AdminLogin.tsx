
import React, { useEffect } from 'react';
import '../styles.css';

const AdminLogin = () => {
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
    }, [])
    
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

                <button type="" className="admin-btn-login"> <a href="/admin-dashboard">Login to Dashboard</a></button>
            </form>
        </div>
    </div>
    </section>
        
        
        </>
    );
};

export default AdminLogin;
