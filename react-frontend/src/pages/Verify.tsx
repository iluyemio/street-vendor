
import { useEffect, useState } from 'react';
import '../styles.css';

const Verify = () => {
    const [vendorCode, setVendorCode] = useState('SVV-10293');
    const [vendor, setVendor] = useState<any>(null);
    const [statusMessage, setStatusMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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

    const runVerify = async () => {
        if (!vendorCode.trim()) {
            setVendor(null);
            setStatusMessage('Please enter a vendor ID to verify.');
            return;
        }

        setIsLoading(true);
        setVendor(null);
        setStatusMessage('');

        try {
            const response = await fetch(`http://localhost:3000/api/vendor/${encodeURIComponent(vendorCode.trim())}`);
            if (!response.ok) {
                const errorData = await response.json();
                setStatusMessage(errorData.message || 'Vendor not found');
                return;
            }

            const data = await response.json();
            setVendor(data);
            setStatusMessage('');
        } catch (error) {
            console.error('Verification failed:', error);
            setStatusMessage('Unable to verify vendor right now. Please try again.');
        } finally {
            setIsLoading(false);
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
                <a href="/verify" className="active">Verify</a>
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
        
        <section className='page-hero'>
            <div className='container reveal'>
                <h1 className='page-title'>Verify a Vendor</h1>
                <p className='page-lead'>Enter a vendor ID, scan a QR code, or search for an approved profile.</p>
                <div className='panel search-strip'>
                    <input
                        id='vendor-code'
                        className='input'
                        value={vendorCode}
                        onChange={(e) => setVendorCode(e.target.value)}
                        placeholder='Enter Vendor ID or Scan QR'
                    />
                    <button className='btn btn-green' type='button' onClick={runVerify} disabled={isLoading}>
                        {isLoading ? 'Checking...' : 'Check Status'}
                    </button>
                </div>
                
                <div className='pill-nav' style={{"marginTop":"14px"}}>
                    <span className='kbd'>SVV-10293 = verified</span>
                    <span className='kbd'>SVV-44444 = suspended</span>
                    <span className='kbd'>Any other ID = not found</span>
                </div>
            </div>
        </section>
        
        <section className='section' style={{"padding":"50px 0"}}>
            <div className='container'>
                <div className='card result-card reveal'>
                    {statusMessage && <p className='muted' style={{ marginBottom: '16px' }}>{statusMessage}</p>}
                    {vendor ? (
                        <div>
                            <div className='card-row' style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h2 style={{ fontSize: '34px' }}>{vendor.firstName} {vendor.lastName}</h2>
                                    <span className={`badge ${vendor.status?.toLowerCase() === 'verified' ? 'green' : vendor.status?.toLowerCase() === 'suspended' ? 'red' : 'amber'}`}>
                                        {vendor.status || 'PENDING'}
                                    </span>
                                </div>
                            </div>
                            <p className='muted' style={{ marginTop: '6px' }}>{vendor.organization_name || 'Vendor'}</p>
                            <div className='meta-grid' style={{ marginTop: '18px' }}>
                                <div className='field'>
                                    <label>Vendor ID</label>{vendor.vendor_id || 'N/A'}
                                </div>
                                <div className='field'>
                                    <label>Valid Until</label>{vendor.expires_at ? new Date(vendor.expires_at).toLocaleDateString() : 'N/A'}
                                </div>
                                <div className='field full-width'>
                                    <label>Issued By</label>Street Vendor Standards Council
                                </div>
                            </div>
                            <p style={{ fontWeight: '800', marginTop: '18px' }}>
                                {vendor.status === 'VERIFIED'
                                    ? 'This vendor is currently verified and authorised within the system.'
                                    : vendor.status === 'SUSPENDED'
                                        ? 'This vendor is currently suspended and not authorised.'
                                        : 'This vendor is not currently verified.'}
                            </p>
                            <div className='hero-actions'>
                                <a className='btn btn-secondary' href='/report'>Report this vendor</a>
                            </div>
                        </div>
                    ) : (
                        !statusMessage && <p className='muted'>Enter a vendor ID and click Check Status to verify a registered vendor.</p>
                    )}
                </div>
            </div>
        </section>
        
        <footer className="main-footer">
            <div className="container">
                <div className="footer-container">
                    <div className="footer-column brand-info">
                    <h2 className="footer-logo">SVSC</h2>
                    <p>Empowering the street economy through official verification, trust, and standardized infrastructure. Built for speed and authority.</p>
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

export default Verify;
