
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';
import '../styles2.css';

const VendorDatabase = () => {
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState<any[]>([]);
    const [vendors, setVendors] = useState<any[]>([]);
    const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
    const [vendorId, setVendorId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [stats, setStats] = useState({
        totalVendors: 0,
        verifiedVendors: 0,
        deniedVendors: 0,
        pendingApplications: 0
    });

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/admin/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setStats({
                totalVendors: data.totalVendors,
                verifiedVendors: data.verifiedVendors,
                deniedVendors: data.deniedVendors,
                pendingApplications: data.pendingApplications
            });
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/admin-login';
    };

    useEffect(() => {
        // Check if admin is logged in
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (!token || !userData) {
            window.location.href = '/admin-login';
            return;
        }

        const user = JSON.parse(userData);
        if (user.user_type !== 'admin') {
            window.location.href = '/admin-login';
            return;
        }

        fetchApplicants();
        fetchStats();
        fetchVendors();

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

    const fetchApplicants = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/admin/applicants', {
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

    const fetchVendors = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/admin/vendors', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setVendors(data);
        } catch (error) {
            console.error('Failed to fetch vendors:', error);
        }
    };

    const handleViewVendor = (vendorId?: string) => {
        if (!vendorId) {
            window.alert('Vendor ID not available.');
            return;
        }
        navigate(`/vendor-profile/${encodeURIComponent(vendorId)}`);
    };

    const downloadCSV = () => {
        if (!vendors.length) return;
        const rows = [
            ['Vendor', 'Name', 'Vendor ID', 'Status', 'Email'],
            ...vendors.map((vendor) => [
                vendor.organization_name || 'Vendor',
                `${vendor.firstName} ${vendor.lastName}`,
                vendor.vendor_id || 'N/A',
                vendor.status || 'PENDING',
                vendor.email,
            ])
        ];
        const csvContent = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'vendor-database.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleApplicantSelect = (applicant: any) => {
        setSelectedApplicant(applicant);
        setVendorId(`SVV-${Date.now().toString().slice(-5)}`);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedApplicant) return;

        setIsSubmitting(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData(e.target as HTMLFormElement);
            const expiryDateValue = formData.get('newVendorExpiry');
            if (typeof expiryDateValue !== 'string' || !expiryDateValue) {
                setMessage('Please select a valid expiry date.');
                setIsSubmitting(false);
                return;
            }
            const normalizedExpiryDate = new Date(`${expiryDateValue}T23:59:59.999Z`);
            if (Number.isNaN(normalizedExpiryDate.getTime())) {
                setMessage('Invalid expiry date format.');
                setIsSubmitting(false);
                return;
            }

            const response = await fetch(`http://localhost:3000/api/admin/promote-vendor/${selectedApplicant.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    vendor_id: vendorId,
                    expires_at: normalizedExpiryDate.toISOString()
                }),
            });

            if (response.ok) {
                setMessage('Vendor created successfully!');
                setSelectedApplicant(null);
                setVendorId('');
                fetchApplicants(); // Refresh applicants
                fetchVendors();
                (e.target as HTMLFormElement).reset();
            } else {
                const error = await response.json();
                setMessage(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Failed to promote vendor:', error);
            setMessage('Failed to create vendor. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
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
        </div>
    </section>

    <section className="container">

        <div className="database-container">
            <main className="table-section">
                <div className="card card-table">
                    <div className="card-header-database">
                        <h2>Vendor Database</h2>
                        <div className="head-btn">
                            <button className="btn-export" type="button" onClick={downloadCSV}><i className="fas fa-download"></i> Export CSV</button>
                            <button className="btn-sidebar" type="button" onClick={() => setShowModal(true)}><i className="fas fa-user-plus"></i> Add New Vendor</button>
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
                                {vendors.map((vendor) => (
                                    <tr key={vendor.id}>
                                        <td>
                                            <div className="vendor-cell">
                                                <img src={`https://i.pravatar.cc/100?u=${vendor.email}`} alt={vendor.firstName} className="vendor-img" />
                                                {vendor.organization_name || 'Vendor'}
                                            </div>
                                        </td>
                                        <td>{vendor.firstName} {vendor.lastName}</td>
                                        <td><code>{vendor.vendor_id || 'N/A'}</code></td>
                                        <td>
                                            <span className={`status-pill status-${vendor.status?.toLowerCase() || 'pending'}`}>
                                                {vendor.status || 'PENDING'}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn-action" type="button" onClick={() => handleViewVendor(vendor.vendor_id)}>
                                                View Vendor
                                            </button>
                                        </td>
                                    </tr>
                                ))}
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

    <div className="modal-overlay" id="addVendorModal" style={{display: showModal ? 'flex' : 'none'}}>
        <div className="modal-card">
            <button className="close-modal" onClick={() => { setShowModal(false); setSelectedApplicant(null); setVendorId(''); setMessage(''); }}>&times;</button>
            <div className="modal-header-hero">
                <h1 className="page-title">Add New Vendor</h1>
                <p className="page-lead">Select an applicant and register them as a vendor</p>
            </div>

            <div className="applicants-list" style={{marginBottom: '20px'}}>
                <h3>Pending Applicants</h3>
                <div style={{maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '5px'}} id="applicantsContainer">
                    {applicants.length ? applicants.map((applicant) => (
                        <button
                            key={applicant.id}
                            type="button"
                            className="applicant-row"
                            onClick={() => handleApplicantSelect(applicant)}
                            style={{
                                width: '100%',
                                textAlign: 'left',
                                border: 'none',
                                borderBottom: '1px solid #eee',
                                background: selectedApplicant?.id === applicant.id ? '#f0f8f4' : '#fff',
                                padding: '12px 14px',
                                cursor: 'pointer',
                            }}
                        >
                            <strong>{applicant.firstName} {applicant.lastName}</strong>
                            <div style={{fontSize: '0.85rem', color: '#666'}}>{applicant.email}</div>
                        </button>
                    )) : (
                        <div style={{padding: '12px 14px', color: '#666'}}>No pending applicants found.</div>
                    )}
                </div>
            </div>

            <form id="newVendorForm" className="modal-body2" onSubmit={handleFormSubmit}>
                    <div className="form-grid">
                        <div className="input-group">
                            <label htmlFor="newVendorName">Full Name</label>
                            <input type="text" id="newVendorName" placeholder="Select an applicant first" required readOnly value={selectedApplicant ? `${selectedApplicant.firstName} ${selectedApplicant.lastName}` : ''} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="newVendorID">Vendor ID</label>
                            <input type="text" id="newVendorID" placeholder="Auto-generated" required readOnly value={vendorId || ''} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="newVendorOrg">Organization / Company</label>
                            <input type="text" id="newVendorOrg" placeholder="Auto-populated" required readOnly value={selectedApplicant?.organization_name || ''} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="newVendorExpiry">Valid Until</label>
                            <input type="date" id="newVendorExpiry" name="newVendorExpiry" required />
                        </div>
                    </div>

                    <div className="hero-actions full-width">
                        <button type="submit" className="verify" disabled={isSubmitting || !selectedApplicant}>
                            {isSubmitting ? 'Creating...' : 'Create Vendor Account'}
                        </button>
                        <button type="button" className="cancel" onClick={() => { setShowModal(false); setSelectedApplicant(null); setVendorId(''); setMessage(''); }}>Cancel</button>
                    </div>
                    
                    {message && <div className="status-message" style={{marginTop: '10px'}}>{message}</div>}
                </form>
        </div>
    </div>

    <div className='container footer'>Street Vendor Verified · Issued by Street Vendor Standards Council</div>
    

        </>
    );
};

export default VendorDatabase;
