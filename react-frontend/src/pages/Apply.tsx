
import React, { useEffect, useState } from 'react';
import { notifySuccess, notifyError } from '../lib/notifications';
import '../styles.css';
import { apiUrl } from '../lib/api';

const Apply = () => {
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
            mobileMenu.addEventListener('click', toggleMenu);
            return () => {
                mobileMenu.removeEventListener('click', toggleMenu);
            };
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        const form = e.currentTarget;
        const formData = new FormData(form);
        
        const data = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            organisationName: formData.get('organisationName')
        };

        try {
            const response = await fetch(apiUrl('/api/apply'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.success) {
                notifySuccess(result.message || 'Application submitted successfully!');
                setMessage(result.message || 'Application submitted successfully! Check your email for login credentials.');
                form.reset();
            } else {
                const errorMessage = result.message || 'Failed to submit application. Please try again.';
                notifyError(errorMessage);
                setMessage(errorMessage);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Network error. Please try again later.';
            notifyError(errorMessage);
            setMessage(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <>
            
    <nav className='nav'>
        <div className='container nav-inner'>
            <a href="/" className='brand'>
                <div className='logo'>✓</div>
                <div>
                    <div className='brand-title'>Street Vendor Verified</div>
                    <div className='brand-sub'>Issued by Street Vendor Standards Council</div>
                </div>
            </a>

            <div className="menu-toggle" id="mobile-menu">
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </div>

            <div className='nav-links' id="nav-links">
                <a href="/verify">Verify</a>
                <a href="/apply" className="active">Apply</a>
                <a href="/organisations">Organisations</a>
                <a href="/report">Report</a>
                <a href="/faq">FAQ</a>
                <a href="/contact">Contact</a>
                <a href="/vendor-login" className='renew-btn'>Vendor Login</a>
                <a href="/admin-login" className='admin-btn'>Admin Login</a>
            </div>
        </div>
    </nav>

    <section className='page-hero'>
        <div className='container reveal'>
            <h1 className='page-title'>Apply for Verification</h1>
            <p className='page-lead'>Join a recognised verification standard designed to build trust, accountability, and
                public confidence.</p>
        </div>
    </section>
    <section className='section' style={{"padding":"50px 0"}}>
        <div className='container grid-2'>
            <div className='card o-card reveal'>
                <h2>Why get verified</h2>
                <div className='stack' style={{"marginTop":"18px"}}>
                    <div className='field'>
                        <img src="customer.png" alt="Customer Icon" />
                        <label>Build trust with customers</label>
                    </div>
                    <div className='field'>
                        <img src="shield.png" alt="Shield Icon" />
                        <label>Protect yourself from disputes</label>
                    </div>
                    <div className='field'>
                        <img src="incentive.png" alt="Incentive Icon" />
                        <label>Sell with credibility</label>
                    </div>
                </div>
            </div>
            <div className='card feature-card reveal'>
                <h2>Application form</h2>
                <form id='applyForm' method='POST' action='#' style={{"marginTop":"18px"}} onSubmit={handleSubmit}>
                    <div className='grid-2' style={{"gap":"18px"}}>
                        <input className='input' type='text' name='firstName' placeholder='First Name' required />
                        <input className='input' type='text' name='lastName' placeholder='Last Name' required />
                    </div>
                    <div className='grid-2' style={{"marginTop":"18px","gap":"18px"}}>
                        <input className='input' type='email' name='email' placeholder='Email Address' style={{"gridColumn":"1/-1"}} required />
                        <input className='input' type='text' name='organisationName' placeholder='Organisation Name' style={{"gridColumn":"1/-1"}} required />
                    </div>
                    <div className='form-action'>
                        <button type='submit' className='btn-submit' disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Apply Now!'}
                        </button>
                    </div>
                    <div id='applyLoader' className={`preloader ${isSubmitting ? '' : 'hidden'}`}>
                        <div className='spinner'></div>
                        <span>Sending application...</span>
                    </div>
                    <div id='applyStatus' className='status-message' aria-live='polite'>
                        {message}
                    </div>
                </form>
            </div>
        </div>
    </section>

    <footer className="main-footer">
        <div className="container">
            <div className="footer-container">
                <div className="footer-column brand-info">
                    <h2 className="footer-logo">SVSC</h2>
                    <p>Empowering the street economy through official verification, trust, and standardized
                        infrastructure. Built for speed and authority.</p>
                    <div className="social-links">
                        <a href="#"><i className="fab fa-facebook-f"></i></a>
                        <a href="#"><i className="fab fa-twitter"></i></a>
                        <a href="#"><i className="fab fa-instagram"></i></a>
                        <a href="#"><i className="fab fa-linkedin-in"></i></a>
                    </div>
                </div>

                <div className="footer-column">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/verify">Verify Vendor</a></li>
                        <li><a href="/apply">Apply Now</a></li>
                        <li><a href="#">Resources</a></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h3>Support</h3>
                    <ul>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Contact Us</a></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h3>Contact Us</h3>
                    <p><i className="fas fa-map-marker-alt"></i> Standards Council HQ, Digital Way</p>
                    <p><i className="fas fa-envelope"></i> support@svsc.gov</p>
                    <p><i className="fas fa-phone"></i> +1 (555) 000-1234</p>
                </div>
            </div>
        </div>

        <div className="footer-bottom">
            <p>&copy; 2026 Street Vendor Verified · Issued by Street Vendor Standards Council. All rights reserved.</p>
        </div>
    </footer>
    

        </>
    );
};

export default Apply;
