
import { useEffect, useState } from 'react';
import { notifySuccess, notifyError } from '../lib/notifications';
import '../styles.css';
import { apiUrl } from '../lib/api';

const Apply = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [isUnder18, setIsUnder18] = useState(false);
    const [governmentIdFront, setGovernmentIdFront] = useState('');
    const [governmentIdBack, setGovernmentIdBack] = useState('');
    const [selfiePhoto, setSelfiePhoto] = useState('');
    const [proofOfAddressUpload, setProofOfAddressUpload] = useState('');
    const [applicationEmail, setApplicationEmail] = useState('');
    const [applicationUserId, setApplicationUserId] = useState<number | null>(null);
    const [emailCode, setEmailCode] = useState('');
    const [mobileCode, setMobileCode] = useState('');
    const [verificationMessage, setVerificationMessage] = useState('');

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
    }, []);

    const fileToDataUrl = (file: File) =>
        new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });

    const handleFileChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: (value: string) => void,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const dataUrl = await fileToDataUrl(file);
            setter(dataUrl);
        } catch {
            notifyError('Failed to process selected file.');
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        const form = e.currentTarget;
        const formData = new FormData(form);
        
        const data = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            organisationName: formData.get('organisationName'),
            fullLegalName: formData.get('fullLegalName'),
            dateOfBirth: formData.get('dateOfBirth'),
            governmentIdType: formData.get('governmentIdType'),
            governmentIdFront,
            governmentIdBack,
            selfiePhoto,
            currentAddress: formData.get('currentAddress'),
            postcode: formData.get('postcode'),
            proofOfAddressUpload,
            mobileNumber: formData.get('mobileNumber'),
            emergencyContactName: formData.get('emergencyContactName'),
            emergencyContactPhone: formData.get('emergencyContactPhone'),
            preferredDisplayName: formData.get('preferredDisplayName'),
            shortBio: formData.get('shortBio'),
            reasonForSelling: formData.get('reasonForSelling'),
            reasonForSellingCustom: formData.get('reasonForSellingCustom'),
            affiliatedOrganisation: formData.get('affiliatedOrganisation'),
            primarySellingLocations: formData.get('primarySellingLocations'),
            intendedWorkingDays: formData.get('intendedWorkingDays'),
            intendedWorkingHours: formData.get('intendedWorkingHours'),
            productType: formData.get('productType'),
            supervisorName: formData.get('supervisorName'),
            agreeCodeOfConduct: Boolean(formData.get('agreeCodeOfConduct')),
            agreeApprovedProductsOnly: Boolean(formData.get('agreeApprovedProductsOnly')),
            agreeDisplayBadge: Boolean(formData.get('agreeDisplayBadge')),
            agreeSuspensionForBreaches: Boolean(formData.get('agreeSuspensionForBreaches')),
            gdprConsent: Boolean(formData.get('gdprConsent')),
            digitalSignature: formData.get('digitalSignature'),
            isUnder18,
            guardianFullName: formData.get('guardianFullName'),
            guardianContactNumber: formData.get('guardianContactNumber'),
            guardianEmail: formData.get('guardianEmail'),
            guardianConsent: Boolean(formData.get('guardianConsent')),
        };

        try {
            const response = await fetch(apiUrl('/api/apply'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.success) {
                notifySuccess(result.message || 'Application submitted successfully!');
                setMessage(result.message || 'Application submitted successfully! Check your email for login credentials.');
                setApplicationEmail(String(data.email || ''));
                setApplicationUserId(typeof result.userId === 'number' ? result.userId : null);
                form.reset();
                setGovernmentIdFront('');
                setGovernmentIdBack('');
                setSelfiePhoto('');
                setProofOfAddressUpload('');
                setIsUnder18(false);
            } else {
                const errorMessage = result.message || 'Failed to submit application. Please try again.';
                notifyError(errorMessage);
                setMessage(errorMessage);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Network error. Please try again later.';
            notifyError(errorMessage);
            setMessage(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const verifyEmail = async () => {
        if (!applicationEmail || !emailCode) return;
        const response = await fetch(apiUrl('/api/user/verify-email'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: applicationEmail, code: emailCode }),
        });
        const result = await response.json();
        setVerificationMessage(result.message || result.error || 'Email verification failed.');
    };

    const verifyMobile = async () => {
        if (!applicationUserId || !mobileCode) return;
        const response = await fetch(apiUrl('/api/user/verify-mobile-otp'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: applicationUserId, code: mobileCode }),
        });
        const result = await response.json();
        setVerificationMessage(result.message || result.error || 'Mobile verification failed.');
    };
    
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
                <a href="/apply" className="active">Apply</a>
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
            <h1 className='page-title'>Apply for Verification</h1>
            <p className='page-lead'>Join a recognised verification standard designed to build trust, accountability, and
                public confidence.</p>
        </div>
    </section>
    <section className='section' style={{"padding":"50px 0"}}>
        <div className='container grid-2'>
            <div className='card o-card reveal'>
                <h2>Why get verified</h2>
                <div className='stack' style={{"marginTop":"18px"}}>
                    <div className='field'>
                        <img src="customer.png" alt="Customer Icon" />
                        <label>Build trust with customers</label>
                    </div>
                    <div className='field'>
                        <img src="shield.png" alt="Shield Icon" />
                        <label>Protect yourself from disputes</label>
                    </div>
                    <div className='field'>
                        <img src="incentive.png" alt="Incentive Icon" />
                        <label>Sell with credibility</label>
                    </div>
                </div>
            </div>
            <div className='card feature-card reveal'>
                <h2>Application form</h2>
                <form id='applyForm' method='POST' action='#' style={{"marginTop":"18px"}} onSubmit={handleSubmit}>
                    <div className='grid-2' style={{"gap":"18px"}}>
                        <input className='input' type='text' name='firstName' placeholder='First Name' required />
                        <input className='input' type='text' name='lastName' placeholder='Last Name' required />
                    </div>
                    <div className='grid-2' style={{"marginTop":"18px","gap":"18px"}}>
                        <input className='input' type='email' name='email' placeholder='Email Address' style={{"gridColumn":"1/-1"}} required />
                        <input className='input' type='text' name='organisationName' placeholder='Organisation Name' style={{"gridColumn":"1/-1"}} required />
                        <input className='input' type='text' name='fullLegalName' placeholder='Full Legal Name' style={{"gridColumn":"1/-1"}} required />
                        <input className='input' type='date' name='dateOfBirth' required />
                        <select className='input' name='governmentIdType' required>
                            <option value=''>Government ID Type</option>
                            <option value='Passport'>Passport</option>
                            <option value='Driving Licence'>Driving Licence</option>
                        </select>
                        <input className='input' type='text' name='currentAddress' placeholder='Current Address' style={{"gridColumn":"1/-1"}} required />
                        <input className='input' type='text' name='postcode' placeholder='Postcode' required />
                        <input className='input' type='text' name='mobileNumber' placeholder='Mobile Number' required />
                        <input className='input' type='text' name='emergencyContactName' placeholder='Emergency Contact Name' required />
                        <input className='input' type='text' name='emergencyContactPhone' placeholder='Emergency Contact Phone Number' required />
                        <input className='input' type='text' name='preferredDisplayName' placeholder='Preferred Display Name' required />
                        <textarea className='textarea' name='shortBio' placeholder='Short Bio (100-150 words)' style={{"gridColumn":"1/-1","minHeight":"120px"}} required />
                        <select className='input' name='reasonForSelling' required>
                            <option value=''>Reason for Selling</option>
                            <option value='Income Support'>Income Support</option>
                            <option value='Family Support'>Family Support</option>
                            <option value='Business Growth'>Business Growth</option>
                            <option value='Other'>Other</option>
                        </select>
                        <input className='input' type='text' name='reasonForSellingCustom' placeholder='Custom reason (if other)' />
                        <input className='input' type='text' name='affiliatedOrganisation' placeholder='Affiliated Organisation' required />
                        <input className='input' type='text' name='primarySellingLocations' placeholder='Primary Selling Locations (comma separated)' style={{"gridColumn":"1/-1"}} required />
                        <input className='input' type='text' name='intendedWorkingDays' placeholder='Intended Working Days (comma separated)' required />
                        <input className='input' type='text' name='intendedWorkingHours' placeholder='Intended Working Hours (e.g. 09:00-17:00)' required />
                        <select className='input' name='productType' required>
                            <option value=''>Product Type</option>
                            <option value='Food'>Food</option>
                            <option value='Drinks'>Drinks</option>
                            <option value='Accessories'>Accessories</option>
                            <option value='Crafts'>Crafts</option>
                        </select>
                        <input className='input' type='text' name='supervisorName' placeholder='Supervisor / Team Leader Name (optional)' />
                        <input className='input' type='text' name='digitalSignature' placeholder='Digital Signature (typed name)' required />
                    </div>

                    <div className='grid-2' style={{"marginTop":"18px","gap":"18px"}}>
                        <div style={{"gridColumn":"1/-1"}}>
                            <label>Government ID Upload (Front)</label>
                            <input className='input' type='file' accept='image/*,.pdf' onChange={(e) => handleFileChange(e, setGovernmentIdFront)} required />
                        </div>
                        <div style={{"gridColumn":"1/-1"}}>
                            <label>Government ID Upload (Back, if applicable)</label>
                            <input className='input' type='file' accept='image/*,.pdf' onChange={(e) => handleFileChange(e, setGovernmentIdBack)} />
                        </div>
                        <div style={{"gridColumn":"1/-1"}}>
                            <label>Selfie Photo</label>
                            <input className='input' type='file' accept='image/*' onChange={(e) => handleFileChange(e, setSelfiePhoto)} required />
                        </div>
                        <div style={{"gridColumn":"1/-1"}}>
                            <label>Proof of Address Upload</label>
                            <input className='input' type='file' accept='image/*,.pdf' onChange={(e) => handleFileChange(e, setProofOfAddressUpload)} required />
                        </div>
                    </div>

                    <div className='stack' style={{"marginTop":"18px"}}>
                        <label><input type='checkbox' name='agreeCodeOfConduct' required /> Agree to Code of Conduct</label>
                        <label><input type='checkbox' name='agreeApprovedProductsOnly' required /> Agree to Sell Only Approved Products</label>
                        <label><input type='checkbox' name='agreeDisplayBadge' required /> Agree to Display ID Badge at All Times</label>
                        <label><input type='checkbox' name='agreeSuspensionForBreaches' required /> Accept Suspension/Removal for Breaches</label>
                        <label><input type='checkbox' name='gdprConsent' required /> GDPR / Data Processing Consent</label>
                        <label>
                            <input type='checkbox' checked={isUnder18} onChange={(e) => setIsUnder18(e.target.checked)} /> Are you under 18?
                        </label>
                    </div>

                    {isUnder18 && (
                        <div className='grid-2' style={{"marginTop":"18px","gap":"18px"}}>
                            <input className='input' type='text' name='guardianFullName' placeholder='Parent/Guardian Full Name' required />
                            <input className='input' type='text' name='guardianContactNumber' placeholder='Parent/Guardian Contact Number' required />
                            <input className='input' type='email' name='guardianEmail' placeholder='Parent/Guardian Email' required />
                            <label style={{"gridColumn":"1/-1"}}><input type='checkbox' name='guardianConsent' required /> Parent/Guardian Consent Confirmation</label>
                        </div>
                    )}
                    <div className='form-action'>
                        <button type='submit' className='btn-submit' disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Apply Now!'}
                        </button>
                    </div>
                    <div id='applyLoader' className={`preloader ${isSubmitting ? '' : 'hidden'}`}>
                        <div className='spinner'></div>
                        <span>Sending application...</span>
                    </div>
                    <div id='applyStatus' className='status-message' aria-live='polite'>
                        {message}
                    </div>
                </form>
                {applicationUserId && (
                    <div style={{ marginTop: '18px', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                        <h3>Verification</h3>
                        <p className='muted'>Enter the email verification code and mobile OTP sent after signup.</p>
                        <div className='grid-2' style={{ gap: '12px', marginTop: '10px' }}>
                            <input className='input' type='text' placeholder='Email verification code' value={emailCode} onChange={(e) => setEmailCode(e.target.value)} />
                            <button type='button' className='btn-submit' onClick={verifyEmail}>Verify Email</button>
                            <input className='input' type='text' placeholder='Mobile OTP code' value={mobileCode} onChange={(e) => setMobileCode(e.target.value)} />
                            <button type='button' className='btn-submit' onClick={verifyMobile}>Verify Mobile</button>
                        </div>
                        {verificationMessage && <div className='status-message' style={{ marginTop: '10px' }}>{verificationMessage}</div>}
                    </div>
                )}
            </div>
        </div>
    </section>

    <footer className="main-footer">
        <div className="container">
            <div className="footer-container">
                <div className="footer-column brand-info">
                    <h2 className="footer-logo">SVSC</h2>
                    <p>Empowering the street economy through official verification, trust, and standardized
                        infrastructure. Built for speed and authority.</p>
                    <div className="social-links">
                        <a href="#"><i className="fab fa-facebook-f"></i></a>
                        <a href="#"><i className="fab fa-twitter"></i></a>
                        <a href="#"><i className="fab fa-instagram"></i></a>
                        <a href="#"><i className="fab fa-linkedin-in"></i></a>
                    </div>
                </div>

                <div className="footer-column">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/verify">Verify Vendor</a></li>
                        <li><a href="/apply">Apply Now</a></li>
                        <li><a href="#">Resources</a></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h3>Support</h3>
                    <ul>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Contact Us</a></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h3>Contact Us</h3>
                    <p><i className="fas fa-map-marker-alt"></i> Standards Council HQ, Digital Way</p>
                    <p><i className="fas fa-envelope"></i> support@svsc.gov</p>
                    <p><i className="fas fa-phone"></i> +1 (555) 000-1234</p>
                </div>
            </div>
        </div>

        <div className="footer-bottom">
            <p>&copy; 2026 Street Vendor Verified · Issued by Street Vendor Standards Council. All rights reserved.</p>
        </div>
    </footer>
    

        </>
    );
};

export default Apply;
