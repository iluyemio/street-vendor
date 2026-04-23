
import React, { useEffect, useState } from 'react';
import '../styles.css';
import { apiUrl } from '../lib/api';

const AdminAccountSettings = () => {
    const MAX_UPLOAD_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    const [user, setUser] = useState<any>(null);
    const [adminName, setAdminName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            window.location.href = '/admin-login';
            return () => cleanup.forEach((fn) => fn());
        }

        const currentUser = JSON.parse(storedUser);
        if (currentUser.user_type !== 'admin') {
            window.location.href = '/admin-login';
            return () => cleanup.forEach((fn) => fn());
        }

        setUser(currentUser);
        setAdminName(`${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim());
        setEmailAddress(currentUser.email || '');
        setPhoneNumber(currentUser.contactNumber || '');
        setProfilePicture(currentUser.profile_picture || '');

        return () => cleanup.forEach((fn) => fn());
    }, []);

    const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/admin-login';
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('');
        setIsSubmitting(true);

        if (!user?.id) {
            setMessage('Unable to update profile. Please sign in again.');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch(apiUrl('/api/user/profile'), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: user.id,
                    firstName: adminName.split(' ')[0] || '',
                    lastName: adminName.split(' ').slice(1).join(' ') || '',
                    email: emailAddress,
                    contactNumber: phoneNumber,
                    profile_picture: profilePicture || undefined,
                }),
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

    const compressImageToDataUrl = (file: File, maxWidth = 1000, maxHeight = 1000, quality = 0.8) =>
        new Promise<string>((resolve, reject) => {
            const image = new Image();
            const objectUrl = URL.createObjectURL(file);

            image.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = image;

                const widthRatio = maxWidth / width;
                const heightRatio = maxHeight / height;
                const scale = Math.min(1, widthRatio, heightRatio);

                width = Math.round(width * scale);
                height = Math.round(height * scale);

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    URL.revokeObjectURL(objectUrl);
                    reject(new Error('Image processing context unavailable.'));
                    return;
                }

                ctx.drawImage(image, 0, 0, width, height);
                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                URL.revokeObjectURL(objectUrl);
                resolve(dataUrl);
            };

            image.onerror = () => {
                URL.revokeObjectURL(objectUrl);
                reject(new Error('Unable to process selected image.'));
            };

            image.src = objectUrl;
        });

    const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            setMessage('Only JPG, PNG, or WEBP images are allowed.');
            e.currentTarget.value = '';
            return;
        }

        if (file.size > MAX_UPLOAD_SIZE_BYTES) {
            setMessage('Image is too large. Max allowed size is 2MB.');
            e.currentTarget.value = '';
            return;
        }

        try {
            const compressedDataUrl = await compressImageToDataUrl(file);
            setProfilePicture(compressedDataUrl);
            setMessage('Profile image selected and optimized. Click Save Update to persist.');
        } catch (error) {
            console.error('Image compression failed:', error);
            setMessage('Unable to process selected image.');
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
                        <img src={profilePicture || user?.profile_picture || 'https://randomuser.me/api/portraits/men/31.jpg'} alt="Profile" />
                    </div>

                    <div className="profile-dropdown">
                        <div className="dropdown-content">
                            <p className="vendor-name">{user ? `${user.firstName} ${user.lastName}` : 'Administrator'}</p>
                            <p className="vendor-email">{user?.email || 'admin@example.com'}</p>
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
                                <img
                                    src={profilePicture || user?.profile_picture || 'https://randomuser.me/api/portraits/men/31.jpg'}
                                    alt="User Portrait"
                                    className="profile-photo"
                                />
                            </div>
                            <div className="basic-info">
                                <h2>{user ? `${user.firstName} ${user.lastName}` : 'Administrator'}</h2>
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

                        <form id="profileUpdateForm" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="profilePictureUpload">Profile Image</label>
                                <input
                                    type="file"
                                    id="profilePictureUpload"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={handleProfileImageUpload}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="adminName">Administrator Name</label>
                                <input
                                    type="text"
                                    id="adminName"
                                    name="adminName"
                                    value={adminName}
                                    onChange={(e) => setAdminName(e.target.value)}
                                    placeholder="e.g., Daren Ola"
                                />
                            </div>

                            <div className="form-row two-col">
                                <div className="form-group">
                                    <label htmlFor="emailAddress">Email Address</label>
                                    <input
                                        type="email"
                                        id="emailAddress"
                                        name="emailAddress"
                                        value={emailAddress}
                                        onChange={(e) => setEmailAddress(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phoneNumber">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        placeholder="+xxx xxxx xxxx"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                                </div>
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

export default AdminAccountSettings;
