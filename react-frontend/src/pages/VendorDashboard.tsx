
import React, { useEffect } from 'react';
import '../styles.css';

const VendorDashboard = () => {
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
            
    <div className='nav'>
        <div className='container nav-inner'>
            <a className='brand'>
                <div className='logo'>✓</div>
                <div>
                    <div className='brand-title'>Street Vendor Verified</div>
                    <div className='brand-sub page-title2'>Vendor Dashboard</div>
                </div>
            </a>

            <div className="nav-dashboard">
                <a href="/" className="btn">Home</a>
                
                <a href="/vendor-login" className="btn-signout">Logout</a>

                <div className="profile-container" id="profileTrigger">
                    <div className="profile-circle">
                        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" />
                    </div>

                    <div className="profile-dropdown">
                        <div className="dropdown-content">
                            <p className="vendor-name">James Bolaji</p>
                            <p className="vendor-email">james.b@tealbinternational.com</p>
                            <div className="status-badge verified">
                                <i className="fas fa-check-circle"></i> Verified Vendor
                            </div>
                            <hr />
                            <a href="/account-settings">Account Settings</a>
                            <a className="account-delete">Delete Account</a>
                        </div>
                    </div>
                </div>

                <a href="/account-settings" className="btn-account"><i className="fa-solid fa-user-gear"></i></a>
            </div>
        </div>
    </div>

    <section className='page-hero'>
        <div className='container reveal'>
            <h1 className='page-title'><span>Welcome, </span> James </h1>
            <hr />
            <p className='page-lead'>Utility-first vendor area focused on status, renewal, and QR visibility.</p>
        </div>
    </section>

    <section className='section' style={{"paddingTop":"10px"}}>
        <div className='container grid-3'>
            <div className='card metric-card reveal'>
                <div className='metric-label'>Status</div>
                <div className='metric-value-status'>Verified</div>
                <span className='badge green'>Active</span>
            </div>
            <div className='card metric-card reveal'>
                <div className='metric-label'>Vendor ID</div>
                <div className='metric-value'>SVV-10293</div>
            </div>
            <div className='card metric-card reveal'>
                <div className='metric-label'>Expires In</div>
                <div className='metric-value'>76 Days</div>
            </div>
        </div>
    </section>

    <section className="section">
        <div className="container grid-2">
            <div className="dashboard-widget">
                <div className="dashboard-wrapper">
                    <div className="badge-column">
                        <div className="verified-card">
                            <div className="verified-header">
                                <h1>VERIFIED</h1>
                            </div>

                            <div className="profile-details-card">
                                <div className="profile-header">
                                    <div className="photo-wrapper">
                                        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User Portrait"
                                            id="profile-photo" className="profile-photo" />
                                    </div>

                                    <div className="header-text">
                                        <h2>James K.</h2>
                                        <p>Steedless Vendor</p>
                                        <p className="sub-text">Stuart Sensor</p>
                                    </div>

                                    <div className="action-buttons">
                                        <button className="btn btn-primary renew-btn">Renew Now <i
                                                className="fas fa-chevron-right"></i></button>
                                    </div>
                                </div>

                                <div className='meta-grid' style={{"margin":"18px 0"}}>
                                    <div className='field'>
                                        <label>Vendor ID</label>SVV-10293
                                    </div>
                                    <div className='field'>
                                        <label>Valid Until</label>15 June 2026
                                    </div>
                                    <div className='field' style={{"gridColumn":"1/-1"}}>
                                        <label>Issued By</label>Street Vendor Standards Council
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-widget">
                <div className="top-section">
                    <ul className="stats-list">
                        <li>
                            <span className="label">Verification Status:</span>
                            <span className="value status-verify">
                                <i className="fas fa-check-circle"></i> VERIFIED
                            </span>
                        </li>

                        <li>
                            <span className="label">Sales This Week:</span>
                            <span className="value">$1,250</span>
                        </li>

                        <li>
                            <span className="label">Customer Ratings:</span>
                            <span className="value star-rating">
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star-half-alt"></i>
                                <span className="rating-num">(4.8)</span>
                            </span>
                        </li>

                        <li>
                            <span className="label">Compliance Tasks:</span>
                            <span className="value">2 Pending</span>
                        </li>
                    </ul>
                </div>

                <div className="footer-section">
                    <div className="footer-item">
                        <i className="fas fa-file-alt"></i>
                        <span>Tips & Resources</span>
                    </div>
                    <div className="footer-item">
                        <i className="fas fa-headset"></i>
                        <span>Support Center</span>
                    </div>
                    <div className="footer-item">
                        <i className="fas fa-exclamation-triangle"></i>
                        <span>Report an Issue</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <div className='container footer'>Street Vendor Verified · Issued by Street Vendor Standards Council</div>
    

        </>
    );
};

export default VendorDashboard;
