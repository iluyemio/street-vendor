
import React, { useEffect } from 'react';
import '../styles.css';

const AdminDashboard = () => {
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

                <a href="/admin-account-settings" className="btn-account"><i className="fa-solid fa-user-gear"></i></a>
            </div>
        </div>
    </div>

    <section className='page-hero'>
        <div className='container reveal'>
            <div className="hero-header">
                <h1 className='page-title'><span>Welcome, </span> Daren </h1>
                <div>
                    <a href="/vendor-database" className="btn-management">
                        <div className="btn-icon"><i className="fas fa-database"></i></div>
                        <span className="btn-label">Vendor Database</span>
                    </a>
                </div>
            </div>

            <hr />
            <p className='page-lead'>Control centre for approvals, suspensions, renewals, and record review.</p>
        </div>
    </section>

    <section className='section' style={{"paddingTop":"10px"}}>
        <div className='container grid-3'>
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
            <div className='stat-card metric-card reveal'>
                <div className='metric-label suspended'>Suspended</div>
                <div className='metric-value'>7</div>
            </div>
            <div className='stat-card metric-card reveal'>
                <div className='metric-label expiring'>Expiring Soon</div>
                <div className='metric-value'>55</div>
            </div>
        </div>
    </section>

    <section className="container">
        <div className="admin-dashboard-wrapper">

            <div className="dashboard-grid">

                <main className="main-dashboard-content">

                    <section className="card vendor-applications-card">
                        <div className="card-header">
                            <h3>Vendor Applications</h3>
                            <div className="status-filters" id="statusFilters">
                                <span className="filter-tab total active" data-status="all">All</span>
                                <span className="filter-tab verified" data-status="verified">Verified</span>
                                <span className="filter-tab pending" data-status="pending">Pending</span>
                                <span className="filter-tab denied" data-status="denied">Denied</span>
                            </div>
                        </div>
                        <div className="application-list" id="applicationList">
                        </div>
                    </section>

                    <section className="card system-management-card">
                        <div className="card-header">
                            <h3>System Management</h3>
                        </div>
                        <div className="management-buttons">
                            <a href="/vendor-database" className="btn-management">
                                <div className="btn-icon"><i className="fas fa-database"></i></div>
                                <span className="btn-label">Vendor Database</span>
                            </a>
                            <a href="/compliance" className="btn-management">
                                <div className="btn-icon"><i className="fas fa-shield-alt"></i></div>
                                <span className="btn-label">Compliance Monitoring</span>
                            </a>
                            <a href="/reports" className="btn-management">
                                <div className="btn-icon"><i className="fas fa-chart-line"></i></div>
                                <span className="btn-label">Admin Reports</span>
                            </a>
                        </div>
                    </section>
                </main>

                <aside className="recent-activities-content">
                    <section className="card recent-activity-card">
                        <div className="card-header">
                            <h3>Recent Activity</h3>
                        </div>
                        <div className="activity-feed">
                            <div className="activity-item">
                                <div className="activity-dot blue-dot"></div>
                                <div className="activity-text unread">
                                    <span className="vendor-name">Maria R.</span>
                                    <span className="activity-action">added a new Food Cart.</span>
                                    <span className="activity-time">3 mins ago</span>
                                </div>
                            </div>
                            <div className="activity-item">
                                <div className="activity-dot blue-dot"></div>
                                <div className="activity-text unread">
                                    <span className="vendor-name">Carlos S.</span>
                                    <span className="activity-action">updated their account profile.</span>
                                    <span className="activity-time">12 mins ago</span>
                                </div>
                            </div>
                            <div className="activity-item">
                                <div className="activity-dot green-dot"></div>
                                <div className="activity-text">
                                    <span className="vendor-name">Rice T.</span>
                                    <span className="activity-action">was marked as verified.</span>
                                    <span className="activity-time">45 mins ago</span>
                                </div>
                            </div>
                            <div className="activity-item">
                                <div className="activity-dot amber-dot"></div>
                                <div className="activity-text">
                                    <span className="vendor-name">James K.</span>
                                    <span className="activity-action">submitted a verification request.</span>
                                    <span className="activity-time">1 hr ago</span>
                                </div>
                            </div>
                            <div className="activity-item">
                                <div className="activity-dot red-dot"></div>
                                <div className="activity-text">
                                    <span className="vendor-name">Maria R.</span>
                                    <span className="activity-action">Account deletion request for Maria P.</span>
                                    <span className="activity-time">2 hrs ago</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    </section>


    <div className='container footer'>Street Vendor Verified · Issued by Street Vendor Standards Council</div>
    

        </>
    );
};

export default AdminDashboard;
