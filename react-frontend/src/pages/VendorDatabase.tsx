
import React, { useEffect } from 'react';
import '../styles.css';

const VendorDatabase = () => {
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

                <a href="/vendor-login" className="btn-signout">Logout</a>

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

                <a href="/admin-account-settings" className="btn-account"><i className="fa-solid fa-user-gear"></i></a>
            </div>
        </div>
    </div>

    <section className='page-hero'>
        <div className='container reveal'>
            <h1 className='page-title'> Vendor Database </h1>
            <hr />
            <div className='breadcrumb btn-secondary'>
                <a href="/admin-dashboard" className="dashboard">Administrator Dashboard</a>

                <i className="fa-sharp fa-solid fa-angle-right success-green"></i>

                <p className="active"> Vendor Database </p>
            </div>
        </div>
    </section>

    <section className='section' style={{"paddingTop":"10px"}}>
        <div className='container grid-4'>
            <div className='stat-card metric-card reveal'>
                <div className='metric-label total'>Total Vendors</div>
                <div className='metric-value'>1,329</div>
            </div>
            <div className='stat-card metric-card reveal'>
                <div className='metric-label verified'>Verified Vendors</div>
                <div className='metric-value'>1,204</div>
            </div>
            <div className='stat-card metric-card reveal'>
                <div className='metric-label denied'>Denied</div>
                <div className='metric-value'>45</div>
            </div>
            <div className='stat-card metric-card reveal'>
                <div className='metric-label pending'>Pending Applications</div>
                <div className='metric-value'>18</div>
            </div>
        </div>
    </section>

    <section className="container">

        <div className="database-container">
            <main className="table-section">
                <div className="card card-table">
                    <div className="card-header-database">
                        <h2>Vendor Database</h2>
                        <div className="head-btn">
                            <button className="btn-export"><i className="fas fa-download"></i> Export CSV</button>
                            <button className="btn-sidebar"><i className="fas fa-user-plus"></i> Add New Vendor</button>
                        </div>

                    </div>

                    <div className="table-responsive">
                        <table id="vendorTable">
                            <thead>
                                <tr>
                                    <th>Vendor</th>
                                    <th>Name</th>
                                    <th>ID</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="vendorBody">
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            <aside className="insight-sidebar">

                <div className="card insight-card">
                    <h3>Vendor Distribution</h3>

                    <div className="chart-main-container">
                        <div className="svg-wrapper">
                            <svg viewBox="0 0 100 100" id="pie-chart">
                            </svg>
                        </div>

                        <div className="legend-container" id="legend">
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    </section>

    {/**/}
    <div className="modal-overlay" id="modalOverlay">
        <div className="modal-card">
            <button className="close-modal" id="closeModal">&times;</button>

            <div className="modal-header-hero">
                <h1 className="page-title">Vendor Profile</h1>
            </div>

            <div className="modal-body grid-list">
                <div className="card o-card profile-avatar-box">
                    <div className="avatar-large">
                        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Vendor Photo" />
                    </div>
                </div>

                <div className="card o-card profile-info-box">
                    <div className="card-row">
                        <h3>James K.</h3>
                        <span className="badge green">Verified</span>
                        <a href="/vendor-dashboard" className="dashboard-button">Visit Dashboard</a>
                    </div>
                    <p className="muted">Inside Success</p>

                    <div className="meta-grid">
                        <div className="field">
                            <label>Vendor ID</label>SVV-10293
                        </div>
                        <div className="field">
                            <label>Valid Until</label>15 June 2026
                        </div>
                        <div className="field full-width">
                            <label>Issued By</label>Street Vendor Standards Council
                        </div>
                    </div>

                    <p className="auth-text">This vendor is currently verified and authorized within the system.</p>

                    <div className="hero-actions">
                        <button className="verify">Verify</button>
                        <button className="reject">Reject</button>
                        <button className="suspend">Suspend</button>
                        <button className="delete">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div className="modal-overlay" id="addVendorModal">
        <div className="modal-card">
            <button className="close-modal" id="closeAddModal">&times;</button>

            <div className="modal-header-hero">
                <h1 className="page-title">Add New Vendor</h1>
                <p className="page-lead">Register a new vendor into the Standards Council database</p>
            </div>

            <form id="newVendorForm" className="modal-body2">
                <div className="form-grid">
                    <div className="input-group">
                        <label htmlFor="newVendorName">Full Name</label>
                        <input type="text" id="newVendorName" placeholder="e.g. James Kallean" required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="newVendorID">Vendor ID</label>
                        <input type="text" id="newVendorID" placeholder="e.g. SVV-XXXXX" required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="newVendorOrg">Organization / Company</label>
                        <input type="text" id="newVendorOrg" placeholder="e.g. Inside Success" required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="newVendorExpiry">Valid Until</label>
                        <input type="date" id="newVendorExpiry" required />
                    </div>
                </div>

                <div className="hero-actions full-width">
                    <button type="submit" className="verify">Create Vendor Account</button>
                    <button type="button" className="cancel" id="cancelAdd">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <div className='container footer'>Street Vendor Verified · Issued by Street Vendor Standards Council</div>
    

        </>
    );
};

export default VendorDatabase;
