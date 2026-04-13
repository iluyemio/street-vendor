
import React, { useEffect, useState } from 'react';
import '../styles.css';

const AccountSettings = () => {
    const [user, setUser] = useState<any>(null);
    const [organizationName, setOrganizationName] = useState('');
    const [posterAddress, setPosterAddress] = useState('');
    const [mainAddress, setMainAddress] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [businessSector, setBusinessSector] = useState('');
    const [businessRegion, setBusinessRegion] = useState('');
    const [taxId, setTaxId] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const buildAvatar = (name: string) =>
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&rounded=true`;

    useEffect(() => {
        const mobileMenu = document.getElementById('mobile-menu');
        const navLinks = document.getElementById('nav-links');
        const cleanup: Array<() => void> = [];

        if (mobileMenu && navLinks) {
            const toggleMenu = () => {
                navLinks.classList.toggle('active');
                mobileMenu.classList.toggle('active');
            };
            mobileMenu.addEventListener('click', toggleMenu);
            cleanup.push(() => mobileMenu.removeEventListener('click', toggleMenu));
        }

        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (!storedUser || !token) {
            window.location.href = '/vendor-login';
            return () => cleanup.forEach((fn) => fn());
        }

        const currentUser = JSON.parse(storedUser);
        setUser(currentUser);
        setOrganizationName(currentUser.organization_name || '');
        setPosterAddress(currentUser.posterAddress || '');
        setMainAddress(currentUser.mainAddress || '');
        setContactNumber(currentUser.contactNumber || '');
        setBusinessSector(currentUser.businessSector || '');
        setBusinessRegion(currentUser.businessRegion || '');
        setTaxId(currentUser.taxId || '');

        return () => cleanup.forEach((fn) => fn());
    }, []);

    const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/vendor-login';
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        if (!user?.id) {
            setMessage('Unable to update because user is not authenticated.');
            setIsSubmitting(false);
            return;
        }

        try {
            const payload = {
                id: user.id,
                vendorName: organizationName,
                posterAddress,
                mainAddress,
                contactNumber,
                businessSector,
                businessRegion,
                taxId,
            };

            const response = await fetch('http://localhost:3000/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (response.ok) {
                setUser(result);
                localStorage.setItem('user', JSON.stringify(result));
                setMessage('Profile updated successfully.');
            } else {
                setMessage(result?.message || 'Failed to update profile.');
            }
        } catch (error) {
            setMessage('Network error. Please try again later.');
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
                    <div className='brand-sub page-title2'>Vendor Dashboard</div>
                </div>
            </a>

            <div className="nav-dashboard">
                <a href="/" className="btn">Home</a>
                
                <a href="/vendor-login" className="btn-signout" onClick={handleLogout}>Logout</a>

                <div className="profile-container" id="profileTrigger">
                    <div className="profile-circle">
                        <img
                            src={user?.profile_picture || (user ? buildAvatar(`${user.firstName} ${user.lastName}`) : 'https://ui-avatars.com/api/?name=Vendor&background=0D8ABC&color=fff&rounded=true')}
                            alt="Profile"
                        />
                    </div>

                    <div className="profile-dropdown">
                        <div className="dropdown-content">
                            <p className="vendor-name">{user ? `${user.firstName} ${user.lastName}` : 'Vendor Name'}</p>
                            <p className="vendor-email">{user?.email || 'vendor@example.com'}</p>
                            <div className="status-badge verified">
                                <i className="fas fa-check-circle"></i> {user?.status || 'Pending'}
                            </div>
                            <hr />
                            <a href="/account-settings">Account Settings</a>
                        </div>
                    </div>
                </div>

                <a href="/account-settings" className="btn-account" title="Account Settings"><i className="fa-solid fa-user-gear"></i></a>
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
                                <img
                                    src={user?.profile_picture || (user ? buildAvatar(`${user.firstName} ${user.lastName}`) : 'https://ui-avatars.com/api/?name=Vendor&background=0D8ABC&color=fff&rounded=true')}
                                    alt="User Portrait"
                                    id="profile-photo"
                                    className="profile-photo"
                                />
                            </div>
                            <div className="basic-info">
                                <h2>{user ? `${user.firstName} ${user.lastName}` : 'Vendor Name'}</h2>
                                <p className="role">{user?.organization_name || 'Vendor Organization'}</p>
                            </div>
                        </div>

                        <div className="profile-list">
                            <div className="profile-list-item">
                                <i className="fas fa-check-circle success-green"></i> <span>Verification: <span
                                        className='badge green'>{user?.status || 'Pending'}</span></span>
                            </div>
                            <div className="profile-list-item">
                                <i className="fas fa-check-circle success-green"></i> <span>Membership: <span
                                        className='badge green'>Active</span></span>
                            </div>
                            <div className="profile-list-item">
                                <i className="fas fa-check-circle success-green"></i> <span>Vendor ID: {user?.vendor_id || 'Not assigned'}</span>
                            </div>
                            <div className="profile-list-item">
                                <i className="fas fa-check-circle success-green"></i> <span>Expires: {user?.expires_at ? new Date(user.expires_at).toLocaleDateString() : 'N/A'}</span>
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

                        <form id="profileUpdateForm" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="vendorName">Company/Vendor Name</label>
                                <input
                                    type="text"
                                    id="vendorName"
                                    name="vendorName"
                                    value={organizationName}
                                    onChange={(e) => setOrganizationName(e.target.value)}
                                    placeholder="e.g., Tealb International"
                                />
                            </div>

                            <div className="form-row two-col">
                                <div className="form-group">
                                    <label htmlFor="posterAddress">Poster Address (for billing)</label>
                                    <input
                                        type="text"
                                        id="posterAddress"
                                        name="posterAddress"
                                        value={posterAddress}
                                        onChange={(e) => setPosterAddress(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="mainAddress">Main Business Address</label>
                                    <input
                                        type="text"
                                        id="mainAddress"
                                        name="mainAddress"
                                        value={mainAddress}
                                        onChange={(e) => setMainAddress(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="contactNumber">Contact Number</label>
                                <input
                                    type="tel"
                                    id="contactNumber"
                                    name="contactNumber"
                                    placeholder="+xxx xxxx xxxx"
                                    value={contactNumber}
                                    onChange={(e) => setContactNumber(e.target.value)}
                                />
                            </div>

                            <div className="form-row two-col">
                                <div className="form-group">
                                    <label htmlFor="businessSector">Business Sector</label>
                                    <select
                                        id="businessSector"
                                        name="businessSector"
                                        value={businessSector}
                                        onChange={(e) => setBusinessSector(e.target.value)}
                                    >
                                        <option value="">Select Sector</option>
                                        <option value="agro">Agro-Processing</option>
                                        <option value="retail">General Retail</option>
                                        <option value="logistics">Logistics</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="businessRegion">Business Region</label>
                                    <input
                                        type="text"
                                        id="businessRegion"
                                        name="businessRegion"
                                        placeholder="e.g., Kumasi, Ghana"
                                        value={businessRegion}
                                        onChange={(e) => setBusinessRegion(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="taxId">Tax ID/Registration Number</label>
                                <input
                                    type="text"
                                    id="taxId"
                                    name="taxId"
                                    value={taxId}
                                    onChange={(e) => setTaxId(e.target.value)}
                                />
                            </div>

                            <button type="submit" className="btn btn-green" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : 'Save Update'} <i className="fas fa-save"></i>
                            </button>
                            {message && <div className="status-message">{message}</div>}
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
