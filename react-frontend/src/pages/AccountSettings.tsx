
import React, { useEffect } from 'react';
import '../styles.css';

const AccountSettings = () => {
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
                        </div>
                    </div>
                </div>

                <a href="/account-settings" className="btn-account"><i className="fa-solid fa-user-gear"></i></a>
            </div>
        </div>
    </div>

    <section className='page-hero'>

        <div className='container reveal'>
            <h1 className='page-title'> Account Settings </h1>
            <hr />
            <div className='breadcrumb btn-secondary'>
                <a href="/vendor-dashboard" className="dashboard">Vendor Dashboard</a>

                <i className="fa-sharp fa-solid fa-angle-right success-green"></i>

                <p className="active"> Profile </p>
            </div>
        </div>
    </section>

    <section>
        <div className="container">
            <div className="dashboard-container">
                <aside className="sidebar">
                    <div className="card sidebar-card">

                        <div className="profile-header">
                            <div className="photo-wrapper">
                                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User Portrait"
                                    id="profile-photo" className="profile-photo" />
                            </div>
                            <div className="basic-info">
                                <h2>James K.</h2>
                                <p className="role">Tealb International</p>
                            </div>
                        </div>

                        <div className="profile-list">
                            <div className="profile-list-item">
                                <i className="fas fa-check-circle success-green"></i> <span>Verification: <span
                                        className='badge green'>Verified</span></span>
                            </div>
                            <div className="profile-list-item">
                                <i className="fas fa-check-circle success-green"></i> <span>Membership: <span
                                        className='badge green'>Active</span></span>
                            </div>
                            <div className="profile-list-item">
                                <i className="fas fa-check-circle success-green"></i> <span>Sales Status: Live</span>
                            </div>
                            <div className="profile-list-item">
                                <i className="fas fa-check-circle success-green"></i> <span>Reviews Status: Solid</span>
                            </div>
                        </div>

                        <button className="btn btn-green-full">Account History <i className="fas fa-history"></i></button>
                    </div>
                </aside>

                <main className="main-content">
                    <div className="card form-card">
                        <h3>Update Vendor Profile</h3>
                        <p className="form-instructions">Complete the form below to update your public-facing vendor
                            information.</p>

                        <form id="profileUpdateForm">
                            <div className="form-group">
                                <label htmlFor="vendorName">Company/Vendor Name</label>
                                <input type="text" id="vendorName" name="vendorName"
                                    placeholder="e.g., Tealb International" />
                            </div>

                            <div className="form-row two-col">
                                <div className="form-group">
                                    <label htmlFor="posterAddress">Poster Address (for billing)</label>
                                    <input type="text" id="posterAddress" name="posterAddress" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="mainAddress">Main Business Address</label>
                                    <input type="text" id="mainAddress" name="mainAddress" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="contactNumber">Contact Number</label>
                                <input type="tel" id="contactNumber" name="contactNumber" placeholder="+xxx xxxx xxxx" />
                            </div>

                            <div className="form-row two-col">
                                <div className="form-group">
                                    <label htmlFor="businessSector">Business Sector</label>
                                    <select id="businessSector" name="businessSector">
                                        <option value="">Select Sector</option>
                                        <option value="agro">Agro-Processing</option>
                                        <option value="retail">General Retail</option>
                                        <option value="logistics">Logistics</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="businessRegion">Business Region</label>
                                    <input type="text" id="businessRegion" name="businessRegion"
                                        placeholder="e.g., Kumasi, Ghana" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="taxId">Tax ID/Registration Number</label>
                                <input type="text" id="taxId" name="taxId" />
                            </div>

                            <button type="submit" className="btn btn-green">Save Update <i className="fas fa-save"></i></button>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    </section>

    <div className='container footer'>Street Vendor Verified · Issued by Street Vendor Standards Council</div>
    

        </>
    );
};

export default AccountSettings;
