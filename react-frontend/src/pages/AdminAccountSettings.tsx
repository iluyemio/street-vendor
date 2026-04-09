
import React, { useEffect } from 'react';
import '../styles.css';

const AdminAccountSettings = () => {
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
                    <div className='brand-sub page-title2'>Administrator Dashboard</div>
                </div>
            </a>

            <div className="nav-dashboard">
                <a href="/" className="btn">Home</a>
                
                <a href="/admin-login" className="btn-signout">Logout</a>

                <div className="profile-container" id="profileTrigger">
                    <div className="profile-circle">
                        <img src="https://randomuser.me/api/portraits/men/31.jpg" alt="Profile" />
                    </div>

                    <div className="profile-dropdown">
                        <div className="dropdown-content">
                            <p className="vendor-name">Daren Ola</p>
                            <p className="vendor-email">daren.o@streetvendor.com</p>
                            <div className="status-badge verified">
                                <i className="fas fa-check-circle"></i> Administrator
                            </div>
                            <hr />
                            <a href="/admin-account-settings">Account Settings</a>
                        </div>
                    </div>
                </div>

                <a href="/account-settings" className="btn-account"><i className="fa-solid fa-user-gear"></i></a>
            </div>
        </div>
    </div>

    <section className='page-hero'>

        <div className='container reveal'>
            <h1 className='page-title'> Administrator Account Settings </h1>
            <hr />
            <div className='breadcrumb btn-secondary'>
                <a href="/admin-dashboard" className="dashboard">Administrator Dashboard</a>

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
                                <img src="https://randomuser.me/api/portraits/men/31.jpg" alt="User Portrait"
                                     className="profile-photo" />
                            </div>
                            <div className="basic-info">
                                <h2>Daren Ola</h2>
                                <p className="role">Administrator</p>
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="main-content">
                    <div className="card form-card">
                        <h3>Update Administrator Profile</h3>
                        <p className="form-instructions">Complete the form below to update your public-facing administrator
                            information.</p>

                        <form id="profileUpdateForm">
                            <div className="form-group">
                                <label htmlFor="adminName">Administrator Name</label>
                                <input type="text" id="adminName" name="adminName"
                                    placeholder="e.g., Daren Ola" />
                            </div>

                            <div className="form-row two-col">
                                <div className="form-group">
                                    <label htmlFor="emailAddress">Email Address</label>
                                    <input type="email" id="emailAddress" name="emailAddress" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phoneNumber">Phone Number</label>
                                    <input type="tel" id="phoneNumber" name="phoneNumber" placeholder="+xxx xxxx xxxx" />
                                </div>
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

export default AdminAccountSettings;
