
import { useEffect } from 'react';
import '../styles.css';

const Report = () => {
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
                <a href="/report" className="active">Report</a>
                <a href="/faq">FAQ</a>
                <a href="/contact">Contact</a>
                <a href="/vendor-login" className='renew-btn'>Vendor Login</a>
                <a href="/admin-login" className='admin-btn'>Admin Login</a>
            </div>
        </div>
    </nav>

    <section className='page-hero'>
        <div className='container reveal'>
            <h1 className='page-title'>Report a Concern</h1>
            <p className='page-lead'>Help protect the public and legitimate vendors by reporting suspicious behaviour or
                invalid verification.</p>
        </div>
    </section>
    <section className='section' style={{"padding":"50px 0"}}>
        <div className='container'>
            <div className='card feature-card reveal'>
                <div className='grid-2'><input className='input' style={{"gridColumn":"1/-1"}} placeholder='Vendor ID' /><input
                        className='input' placeholder='Reason' /><input className='input' placeholder='Location' /><textarea
                        className='textarea' style={{"gridColumn":"1/-1","minHeight":"180px"}}
                        placeholder='Describe what happened'></textarea></div>
                <div className='hero-actions'><a className='btn btn-primary' href='#'>Submit Report</a></div>
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

export default Report;
