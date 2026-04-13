
import React, { useEffect, useState } from 'react';
import '../styles.css';
import { apiUrl } from '../lib/api';

const VendorDashboard = () => {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const isVerified = user?.status === 'ACTIVE' || user?.status === 'VERIFIED';

    const formatDate = (value: string | null | undefined) => {
        if (!value) return 'N/A';
        return new Date(value).toLocaleDateString();
    };

    const fetchUserProfile = async (id: number) => {
        try {
            const response = await fetch(apiUrl(`/api/user/profile/${id}`));
            if (response.ok) {
                const freshUser = await response.json();
                setUser(freshUser);
                localStorage.setItem('user', JSON.stringify(freshUser));
            } else {
                console.error('Failed to refresh user profile');
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (!token || !userData) {
            window.location.href = '/vendor-login';
            return;
        }

        const parsedUser = JSON.parse(userData);
        if (parsedUser.user_type !== 'vendor' && parsedUser.user_type !== 'user') {
            window.location.href = '/vendor-login';
            return;
        }

        setUser(parsedUser);
        fetchUserProfile(parsedUser.id);

        const cleanupFns: Array<() => void> = [];
        const mobileMenu = document.getElementById('mobile-menu');
        const navLinks = document.getElementById('nav-links');
        
        if (mobileMenu && navLinks) {
            const toggleMenu = () => {
                navLinks.classList.toggle('active');
                mobileMenu.classList.toggle('active');
            };
            mobileMenu.addEventListener('click', toggleMenu);
            cleanupFns.push(() => mobileMenu.removeEventListener('click', toggleMenu));
        }

        return () => cleanupFns.forEach((fn) => fn());
    }, []);

    const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/vendor-login';
    };
    
    if (isLoading) {
        return <div className="page-loading">Loading vendor dashboard...</div>;
    }
    
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
                
                <a href="/vendor-login" className="btn-signout" onClick={handleLogout}>Logout</a>

                <div className="profile-container" id="profileTrigger">
                    <div className="profile-circle">
                        <img
                            src={user?.profile_picture || (user ? `https://ui-avatars.com/api/?name=${encodeURIComponent(`${user.firstName} ${user.lastName}`)}&background=0D8ABC&color=fff&rounded=true` : 'https://ui-avatars.com/api/?name=Vendor&background=0D8ABC&color=fff&rounded=true')}
                            alt="Profile"
                        />
                    </div>

                    <div className="profile-dropdown">
                        <div className="dropdown-content">
                            <p className="vendor-name">{user ? `${user.firstName} ${user.lastName}` : 'Loading...'}</p>
                            <p className="vendor-email">{user?.email}</p>
                            <div className={`status-badge ${user?.status?.toLowerCase() === 'active' ? 'green' : 'pending'}`}>
                                <i className="fas fa-check-circle"></i> {user?.status ?? 'PENDING'}
                            </div>
                            <hr />
                            <a href="/account-settings">Account Settings</a>
                            <a className="account-delete">Delete Account</a>
                        </div>
                    </div>
                </div>

                <a href="/account-settings" className="btn-account" title="Account Settings"><i className="fa-solid fa-user-gear"></i></a>
            </div>
        </div>
    </div>

    <section className='page-hero'>
        <div className='container reveal'>
            <h1 className='page-title'><span>Welcome, </span> {user?.firstName ?? 'Vendor'}</h1>
            <hr />
            <p className='page-lead'>{user?.organization_name ? `${user.organization_name} vendor area` : 'Utility-first vendor area focused on status, renewal, and QR visibility.'}</p>
        </div>
    </section>

    <section className='section' style={{"paddingTop":"10px"}}>
        <div className='container grid-3'>
            <div className='card metric-card reveal'>
                <div className='metric-label'>Status</div>
                {/* <div className='metric-value-status'>{user?.status ?? 'PENDING'}</div> */}
                <span style={{ fontSize:"34px",
                    fontWeight:900,
                    marginTop:"6px" }} className={`badge ${user?.status === 'ACTIVE' || user?.status === 'VERIFIED' ? 'green' : 'amber'}`}>
                    {user?.status === 'ACTIVE' || user?.status === 'VERIFIED' ? 'Active' : user?.status ? user.status : 'Pending'}
                </span>
            </div>
            <div className='card metric-card reveal'>
                <div className='metric-label'>Vendor ID</div>
                <div className='metric-value'>{user?.vendor_id || 'Not assigned'}</div>
            </div>
            <div className='card metric-card reveal'>
                <div className='metric-label'>Valid Until</div>
                <div className='metric-value'>{formatDate(user?.expires_at)}</div>
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
                                        <img src={user?.profile_picture || 'https://randomuser.me/api/portraits/men/32.jpg'} alt="User Portrait"
                                            id="profile-photo" className="profile-photo" />
                                    </div>

                                    <div className="header-text">
                                        <h2>{user ? `${user.firstName} ${user.lastName}` : 'Vendor Name'}</h2>
                                        <p>{user?.organization_name || 'Vendor Organization'}</p>
                                        <p className="sub-text">{user?.email || 'vendor@example.com'}</p>
                                    </div>

                                    <div className="action-buttons">
                                        <button className="btn btn-primary renew-btn">Renew Now <i
                                                className="fas fa-chevron-right"></i></button>
                                    </div>
                                </div>

                                <div className='meta-grid' style={{"margin":"18px 0"}}>
                                    <div className='field'>
                                        <label>Vendor ID</label>{user?.vendor_id || 'Not assigned'}
                                    </div>
                                    <div className='field'>
                                        <label>Valid Until</label>{formatDate(user?.expires_at)}
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
                            <span className={`value status-verify ${isVerified ? 'verified' : 'not-verified'}`}>
                                <i className={`fas ${isVerified ? 'fa-check-circle' : 'fa-times-circle'}`}></i> {isVerified ? 'VERIFIED' : 'NOT VERIFIED'}
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
