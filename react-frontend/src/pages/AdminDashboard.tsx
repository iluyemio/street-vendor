
import { useEffect, useState } from 'react';
import '../styles.css';
import { apiUrl } from '../lib/api';

const AdminDashboard = () => {
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState<any>({
        totalVendors: 0,
        verifiedVendors: 0,
        deniedVendors: 0,
        pendingApplications: 0,
        suspendedVendors: 0,
        expiringSoon: 0
    });
    const [applicants, setApplicants] = useState<any[]>([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [recentActivity, setRecentActivity] = useState<any[]>([]);

    const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/admin-login';
    };

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (!token || !userData) {
            window.location.href = '/admin-login';
            return;
        }

        setUser(JSON.parse(userData));

        fetchStats();
        fetchApplicants();
        fetchRecentActivity();

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
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(apiUrl('/api/admin/stats'), {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const fetchApplicants = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(apiUrl('/api/admin/applicants'), {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setApplicants(data);
        } catch (error) {
            console.error('Failed to fetch applicants:', error);
        }
    };

    const fetchRecentActivity = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(apiUrl('/api/admin/recent-activity'), {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setRecentActivity(data);
        } catch (error) {
            console.error('Failed to fetch recent activity:', error);
        }
    };

    const getFilteredApplicants = () => {
        if (filterStatus === 'all') return applicants;
        return applicants.filter((applicant) => {
            const status = (applicant.status || 'pending').toString().toLowerCase();
            return status === filterStatus;
        });
    };

    const handleFilterChange = (status: string) => {
        setFilterStatus(status);
    };

    const formatRelativeTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const diff = Date.now() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hr${hours === 1 ? '' : 's'} ago`;
        const days = Math.floor(hours / 24);
        return `${days} day${days === 1 ? '' : 's'} ago`;
    };
    
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

                <a href="/admin-login" className="btn-signout" onClick={handleLogout}>Logout</a>

                <div className="profile-container" id="profileTrigger">
                    <div className="profile-circle">
                        <img src="https://randomuser.me/api/portraits/men/31.jpg" alt="Profile" />
                    </div>

                    <div className="profile-dropdown">
                        <div className="dropdown-content">
                            <p className="vendor-name">{user ? `${user.firstName} ${user.lastName}` : 'Loading...'}</p>
                            <p className="vendor-email">{user?.email}</p>
                            <div className="status-badge verified">
                                <i className="fas fa-check-circle"></i> Administrator
                            </div>
                            <hr />
                            <a href="/admin-account-settings">Account Settings</a>
                        </div>
                    </div>
                </div>

                <a href="/admin-account-settings" className="btn-account" title="Account Settings"><i className="fa-solid fa-user-gear"></i></a>
            </div>
        </div>
    </div>

    <section className='page-hero'>
        <div className='container reveal'>
            <div className="hero-header">
                <h1 className='page-title'><span>Welcome, </span> {user?.firstName || 'Admin'}</h1>
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
                <div className='metric-value'>{stats.totalVendors}</div>
            </div>
            <div className='stat-card metric-card reveal'>
                <div className='metric-label verified'>Verified Vendors</div>
                <div className='metric-value'>{stats.verifiedVendors}</div>
            </div>
            <div className='stat-card metric-card reveal'>
                <div className='metric-label denied'>Denied</div>
                <div className='metric-value'>{stats.deniedVendors}</div>
            </div>
            <div className='stat-card metric-card reveal'>
                <div className='metric-label pending'>Pending Applications</div>
                <div className='metric-value'>{stats.pendingApplications}</div>
            </div>
            <div className='stat-card metric-card reveal'>
                <div className='metric-label suspended'>Suspended</div>
                <div className='metric-value'>{stats.suspendedVendors}</div>
            </div>
            <div className='stat-card metric-card reveal'>
                <div className='metric-label expiring'>Expiring Soon</div>
                <div className='metric-value'>{stats.expiringSoon}</div>
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
                                <button type="button" className={`filter-tab total ${filterStatus === 'all' ? 'active' : ''}`} onClick={() => handleFilterChange('all')}>All</button>
                                <button type="button" className={`filter-tab verified ${filterStatus === 'verified' ? 'active' : ''}`} onClick={() => handleFilterChange('verified')}>Verified</button>
                                <button type="button" className={`filter-tab pending ${filterStatus === 'pending' ? 'active' : ''}`} onClick={() => handleFilterChange('pending')}>Pending</button>
                                <button type="button" className={`filter-tab denied ${filterStatus === 'denied' ? 'active' : ''}`} onClick={() => handleFilterChange('denied')}>Denied</button>
                            </div>
                        </div>
                        <div className="application-list" id="applicationList">
                            {getFilteredApplicants().map(applicant => (
                                <div key={applicant.id} className="application-item">
                                    <div className="vendor-block">
                                        <img src={`https://i.pravatar.cc/100?u=${applicant.email}`} alt={applicant.firstName} className="vendor-avatar" />
                                        <div className="vendor-details">
                                            <h4>{applicant.firstName} {applicant.lastName}</h4>
                                            <p className="type">{applicant.organization_name}</p>
                                        </div>
                                    </div>
                                    <div className="action-block">
                                        <button className="btn-dashboard-item status-pending">Pending</button>
                                    </div>
                                </div>
                            ))}
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
                            {recentActivity.length > 0 ? recentActivity.map((activity) => (
                                <div key={activity.id} className="activity-item">
                                    <div className={`activity-dot ${activity.variant}-dot`}></div>
                                    <div className={`activity-text ${activity.variant === 'blue' ? 'unread' : ''}`}>
                                        <span className="vendor-name">{activity.name}</span>
                                        <span className="activity-action">{activity.action}</span>
                                        <span className="activity-time">{formatRelativeTime(activity.time)}</span>
                                    </div>
                                </div>
                            )) : (
                                <div className="activity-item">
                                    <div className="activity-dot blue-dot"></div>
                                    <div className="activity-text">
                                        <span className="activity-action">No recent activity available.</span>
                                    </div>
                                </div>
                            )}
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
