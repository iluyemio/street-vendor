
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles.css';
import { apiUrl } from '../lib/api';

const VendorProfile = () => {
    const { vendorId } = useParams<{ vendorId?: string }>();
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

    useEffect(() => {
        if (!vendorId) {
            setStatusMessage('No vendor selected. Please search for a vendor first.');
            setVendor(null);
            return;
        }

        const fetchVendor = async () => {
            setIsLoading(true);
            setStatusMessage('');
            try {
                const response = await fetch(apiUrl(`/api/vendor/${encodeURIComponent(vendorId)}`));
                if (!response.ok) {
                    const errorData = await response.json();
                    setStatusMessage(errorData.message || 'Vendor not found.');
                    setVendor(null);
                    return;
                }
                const data = await response.json();
                setVendor(data);
            } catch (error) {
                console.error('Failed to load vendor profile:', error);
                setStatusMessage('Unable to load vendor profile.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchVendor();
    }, [vendorId]);
    
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
        <div className='container'>
            {isLoading ? (
                <div className='card o-card reveal' style={{ padding: '40px', textAlign: 'center' }}>
                    <p>Loading vendor details...</p>
                </div>
            ) : vendor ? (
                <div className='container grid-2'>
                    <div className='card o-card reveal' style={{"display":"grid","placeItems":"center","minHeight":"360px"}}>
                        <div className='avatar' style={{"width":"220px","height":"220px","borderRadius":"28px"}}>
                            <img
                                src={
                                    vendor.profile_picture ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                        `${vendor.firstName || ''} ${vendor.lastName || vendor.organization_name || 'Vendor'}`.trim(),
                                    )}&background=0D8ABC&color=fff&rounded=true&size=220`
                                }
                                alt='Vendor Photo'
                                style={{"width":"100%","height":"100%","objectFit":"cover","borderRadius":"28px"}}
                            />
                        </div>
                    </div>
                    <div className='card o-card reveal'>
                        <div className='card-row'>
                            <h2>{vendor.firstName} {vendor.lastName}</h2>
                            <span className={`badge ${vendor.status?.toLowerCase() === 'verified' ? 'green' : vendor.status?.toLowerCase() === 'suspended' ? 'red' : 'amber'}`}>
                                {vendor.status || 'PENDING'}
                            </span>
                        </div>
                        <p className='muted' style={{"marginTop":"8px"}}>{vendor.organization_name || 'Vendor'}</p>
                        <div className='meta-grid' style={{"marginTop":"18px"}}>
                            <div className='field'>
                                <label>Vendor ID</label>{vendor.vendor_id || 'N/A'}
                            </div>
                            <div className='field'>
                                <label>Valid Until</label>{vendor.expires_at ? new Date(vendor.expires_at).toLocaleDateString() : 'N/A'}
                            </div>
                            <div className='field' style={{"gridColumn":"1/-1"}}>
                                <label>Issued By</label>Street Vendor Standards Council
                            </div>
                        </div>
                        <p style={{"marginTop":"18px","fontWeight":"800"}}>
                            {vendor.status === 'VERIFIED'
                                ? 'This vendor is currently verified and authorised within the system.'
                                : vendor.status === 'SUSPENDED'
                                    ? 'This vendor is currently suspended and not authorised.'
                                    : 'This vendor is not currently verified.'}
                        </p>
                        <div className='hero-actions'>
                            <a className='btn btn-secondary' href="/report">Report this vendor</a>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='card o-card reveal' style={{ padding: '40px', textAlign: 'center' }}>
                    <p className='muted'>{statusMessage || 'No vendor selected yet. Use the search box to look up a vendor by ID.'}</p>
                </div>
            )}
        </div>
    </section>
    <div className='container footer'>Street Vendor Verified · Issued by Street Vendor Standards Council</div>
    

        </>
    );
};

export default VendorProfile;
