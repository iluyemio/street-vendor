
import React, { useEffect } from 'react';
import '../styles.css';

const VendorProfile = () => {
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

    <section className='page-hero'>
        <div className='container reveal'>
            <h1 className='page-title'>Vendor Profile</h1>
            <p className='page-lead'>Public-facing verification details shown after a successful check.</p>
        </div>
    </section>

    <section className='section' style={{"paddingTop":"10px"}}>
        <div className='container grid-2'>
            <div className='card o-card reveal' style={{"display":"grid","placeItems":"center","minHeight":"360px"}}>
                <div className='avatar' style={{"width":"220px","height":"220px","borderRadius":"28px"}}>
                    <img src='https://randomuser.me/api/portraits/men/32.jpg' alt='Vendor Photo'
                        style={{"width":"100%","height":"100%","objectFit":"cover","borderRadius":"28px"}} />
                </div>
            </div>
            <div className='card o-card reveal'>
                <div className='card-row'>
                    <h2>James K.</h2>
                    <span className='badge green'>Verified</span>
                </div>
                <p className='muted' style={{"marginTop":"8px"}}>Inside Success</p>
                <div className='meta-grid' style={{"marginTop":"18px"}}>
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
                <p style={{"marginTop":"18px","fontWeight":"800"}}>This vendor is currently verified and authorised within the
                    system.</p>
                <div className='hero-actions'>
                    <a className='btn btn-secondary' href="/report">Report this vendor</a>
                </div>
            </div>
        </div>
    </section>
    <div className='container footer'>Street Vendor Verified · Issued by Street Vendor Standards Council</div>
    

        </>
    );
};

export default VendorProfile;
