
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const Index = () => {
    const navigate = useNavigate();
    const [searchCode, setSearchCode] = useState('');

    const handleSearch = () => {
        if (!searchCode.trim()) {
            navigate('/verify');
            return;
        }
        navigate(`/vendor-profile/${encodeURIComponent(searchCode.trim())}`);
    };

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
    }, [])
    
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
                <a href="/apply">Apply</a>
                <a href="/organisations">Organisations</a>
                <a href="/report">Report</a>
                <a href="/faq">FAQ</a>
                <a href="/contact">Contact</a>
                <a href="/vendor-login" className='renew-btn'>Vendor Login</a>
                <a href="/admin-login" className='admin-btn'>Admin Login</a>
            </div>
        </div>
    </nav>

    <section className='hero'>
        <div className='container hero-grid'>
            <div className='reveal'>
                <div className='kicker'>Public trust infrastructure</div>
                <h1 style={{"marginTop":"16px"}}>Verify Street Vendors. Instantly.</h1>
                <p className='lead'>Check whether a vendor is officially verified in seconds using their ID or QR code.
                    Built for speed, authority, and mobile-first trust in the street economy.</p>
                <div className='hero-actions'>
                    <a className='btn btn-primary' href="/verify">Verify a Vendor</a>
                    <a className='btn btn-secondary' href="/apply">Apply for Verification</a>
                </div>

                <div className='panel search-strip'>
                    <input
                        className='input'
                        placeholder='Enter Vendor ID or Scan QR'
                        value={searchCode}
                        onChange={(e) => setSearchCode(e.target.value)}
                    />
                    <button className='btn btn-green' type='button' onClick={handleSearch}>
                        Verify
                    </button>
                </div>
                <div className='pill-nav' style={{"marginTop":"14px"}}>
                    <span className='kbd'>Fast public checks</span>
                    <span className='kbd'>QR-linked status</span>
                    <span className='kbd'>Council-ready trust layer</span>
                </div>
            </div>

            <div className="hero-image-block">
                <img src="hero-img.png" alt="Street Vendor Standards Council Checked Stall" className="hero-main-img" />
            </div>
        </div>
    </section>

    <section className='section'>
        <div className='container'>
            <div className='section-head reveal'>
                <div className="sub-hero">
                    <hr />
                    <h2>How it works</h2>
                    <p className='muted' style={{"marginTop":"8px"}}>A simple system built around instant public clarity.</p>
                </div>
            </div>
            <div className='grid-4'>
                <div className='card feature-card'>
                    <div className='icon'><i className="fa-solid fa-arrow-pointer"></i></div>
                    <h3>Apply</h3>
                    <p style={{"marginTop":"8px"}}>Vendor or organisation submits verification details for review.</p>
                </div>

                <div className='card feature-card reveal'>
                    <div className='icon'><i className="fa-solid fa-code-compare"></i></div>
                    <h3>Review</h3>
                    <p style={{"marginTop":"8px"}}>Identity and organisation are checked against approval criteria.</p>
                </div>
                <div className='card feature-card reveal'>
                    <div className='icon'><i className="fa-solid fa-check-to-slot"></i></div>
                    <h3>Get verified</h3>
                    <p style={{"marginTop":"8px"}}>Approved vendors receive an ID and QR-linked profile.</p>
                </div>
                <div className='card feature-card reveal'>
                    <div className='icon'><i className="fa-solid fa-hourglass-half"></i></div>
                    <h3>Scan to confirm</h3>
                    <p style={{"marginTop":"8px"}}>The public sees a clear verified, suspended, or not-found result.</p>
                </div>
            </div>
        </div>
    </section>

    <section className='section'>
        <div className='container'>
            <div className='section-head reveal'>
                <div className="sub-hero">
                    <hr />
                    <h2>Get Street Vendor Verified</h2>
                    <p className='muted' style={{"marginTop":"8px"}}>Join the Street Vendor Verified Program!</p>
                </div>
            </div>

            <div className='grid-5 verified'>
                <div className='vendor-card'>
                    <img src="verify-icon.png" alt="Verify Icon" />
                    <h4>Get Official Verification</h4>
                </div>

                <div className='vendor-card'>
                    <img src="customer.png" alt="Customer Icon" />
                    <h4>Build Customer Trust</h4>
                </div>

                <div className='vendor-card'>
                    <img src="sales.png" alt="Customer Icon" />
                    <h4>Increase Your Sales</h4>
                </div>

                <div className='vendor-card'>
                    <img src="store.png" alt="Customer Icon" />
                    <h4>Intence Resources</h4>
                </div>

                <div className='vendor-card'>
                    <img src="resource.png" alt="Customer Icon" />
                    <h4>Access Resources & Support</h4>
                </div>
            </div>

            <div className="apply-container">
                <div className="apply-card">

                    <div className="form-header">
                        <hr className="rule" />
                        <h1>Apply Now!</h1>
                        <hr className="rule" />
                    </div>

                    <form id="applyForm">
                        <div className="form-row grid-2">
                            <input type="text" id="firstName" placeholder="First Name" required />
                            <input type="text" id="lastName" placeholder="Last Name" required />
                        </div>

                        <div className="form-row grid-2">
                            <input type="email" id="emailAddress" placeholder="Email Address" required />
                            <input type="text" id="organisationName" placeholder="Organisation Name" required />
                        </div>

                        <div className="form-action">
                            <button type="submit" className="btn-submit">Apply Now!</button>
                        </div>
                    </form>

                </div>
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

export default Index;
