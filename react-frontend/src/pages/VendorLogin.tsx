
import React, { useEffect } from 'react';
import '../styles.css';

const VendorLogin = () => {
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
            

    <section className="login-page">
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <i className="fas fa-shield-alt brand-icon"></i>
                    <h1>Vendor Portal</h1>
                    <p>Please sign in to your account</p>
                </div>

                <form id="loginForm">
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

                    <button type="" className="btn-login"> <a href="/vendor-dashboard">Login to Dashboard</a></button>
                </form>

                <div className="login-footer">
                    <p>Don't have an account? <a href="//apply">Apply as a Vendor</a></p>
                </div>
            </div>
        </div>
    </section>
    

        </>
    );
};

export default VendorLogin;
