
import { useEffect, useState } from 'react';
import '../styles.css';
import { apiUrl } from '../lib/api';

const VendorLogin = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [showVerification, setShowVerification] = useState(false);
    const [verificationEmail, setVerificationEmail] = useState('');
    const [emailCode, setEmailCode] = useState('');

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
            const response = await fetch(apiUrl('/api/user/login'), {
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
                const backendMessage = result?.message || result?.error || 'Invalid credentials';
                setMessage(backendMessage);
                if (backendMessage.toLowerCase().includes('complete email verification')) {
                    setVerificationEmail(email);
                    setShowVerification(true);
                } else {
                    setShowVerification(false);
                }
            }
        } catch (error) {
            setMessage('Network error. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const requestCodes = async () => {
        if (!verificationEmail) return;
        const emailRes = await fetch(apiUrl('/api/user/request-email-verification'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: verificationEmail }),
        });
        const emailData = await emailRes.json();
        if (emailRes.ok) {
            setMessage(`Email verification code generated: ${emailData?.code ?? 'N/A'}`);
            return;
        }
        setMessage(emailData?.message || 'Verification code request failed.');
    };

    const verifyCodes = async () => {
        if (!verificationEmail || !emailCode) {
            setMessage('Enter your email verification code.');
            return;
        }
        const emailVerifyRes = await fetch(apiUrl('/api/user/verify-email'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: verificationEmail, code: emailCode }),
        });
        const emailData = await emailVerifyRes.json();
        if (emailVerifyRes.ok) {
            setMessage('Verification completed. You can now log in.');
            setShowVerification(false);
            setEmailCode('');
            return;
        }
        setMessage(emailData?.message || 'Verification failed.');
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

                {showVerification && (
                    <div style={{ marginTop: '14px', borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
                        <h3 style={{ marginBottom: '8px' }}>Complete Verification</h3>
                        <input
                            type="email"
                            className="input"
                            value={verificationEmail}
                            onChange={(e) => setVerificationEmail(e.target.value)}
                            placeholder="Email used for signup"
                            style={{ marginBottom: '8px' }}
                        />
                        <div className="hero-actions">
                            <button type="button" className="btn btn-secondary" onClick={requestCodes}>Request Codes</button>
                        </div>
                        <input
                            type="text"
                            className="input"
                            value={emailCode}
                            onChange={(e) => setEmailCode(e.target.value)}
                            placeholder="Email verification code"
                            style={{ marginBottom: '8px' }}
                        />
                        <div className="hero-actions">
                            <button type="button" className="btn btn-green" onClick={verifyCodes}>Verify Now</button>
                        </div>
                    </div>
                )}

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
