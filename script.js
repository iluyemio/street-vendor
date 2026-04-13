// NAV-MENU
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    menuToggle.addEventListener('click', () => {
        // Toggle the 'active' class on both the links container and the button
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
});

function setVerifyState(type){const card=document.getElementById('verify-result');if(!card)return;let top='green',title='OFFICIALLY VERIFIED',badgeClass='green',badgeText='Verified',org='Inside Success',expiry='15 June 2026',message='This vendor is currently verified and authorised within the system.';if(type==='suspended'){top='red';title='SUSPENDED';badgeClass='red';badgeText='Suspended';org='Verification Restricted';message='This vendor is not currently authorised.';}if(type==='notfound'){top='gray';title='NO RECORD FOUND';badgeClass='amber';badgeText='Not Found';org='—';expiry='—';message='We could not locate this vendor ID.';}card.innerHTML=`<div class='result-banner ${top}'>${title}</div><div class='result-body'><div class='profile-grid'><div class='avatar'></div><div><div class='card-row'><h2 style='font-size:34px'>James K.</h2><span class='badge ${badgeClass}'>${badgeText}</span></div><p class='muted' style='margin-top:6px'>${org}</p><div class='meta-grid'><div class='field'><label>Vendor ID</label>SVV-10293</div><div class='field'><label>Valid Until</label>${expiry}</div></div><p style='font-weight:800;margin-top:18px'>${message}</p><div class='card-row' style='justify-content:space-between;margin-top:18px'><span class='muted'>Issued by Street Vendor Standards Council</span><a class='btn btn-secondary' href='report.html'>Report this vendor</a></div></div></div></div>`;}function runVerifyDemo(){const value=(document.getElementById('vendor-code')?.value||'').trim().toUpperCase();if(value==='SVV-44444')setVerifyState('suspended');else if(value&&value!=='SVV-10293')setVerifyState('notfound');else setVerifyState('verified');}document.addEventListener('DOMContentLoaded',()=>{if(document.getElementById('verify-result'))setVerifyState('verified');});

// Function to pull a random portrait to simulate dynamic data
const fetchRandomPhoto = () => {
    // We target "men" as seen in the source image, but this API is flexible.
    // '32' is a specific number, you can adjust this or make it random.
    const photoUrl = 'https://randomuser.me/api/portraits/men/32.jpg';
    const photoImg = document.getElementById('profile-photo');
    
    // Safety check to ensure the element exists
    if (photoImg) {
        photoImg.src = photoUrl;
    }
};

// Execute the function after the full DOM structure is parsed and safe to interact with.
document.addEventListener('DOMContentLoaded', fetchRandomPhoto);

document.addEventListener('DOMContentLoaded', () => {
    
    // Dynamic Application Data for simulation
    const applications = [
        { id: 1, name: 'Maria R.', type: 'Food Cart', status: 'pending', photo: 'maria_r.jpg' },
        { id: 2, name: 'Carlos S.', type: 'Clothing Vendor', status: 'pending', photo: 'carlos_s.jpg' },
        { id: 3, name: 'Rice T.', type: 'Artisan Crafts', status: 'verified', photo: 'rice_t.jpg' },
        { id: 4, name: 'James K.', type: 'Local Produce', status: 'verified', photo: 'james_k.jpg' },
        { id: 5, name: 'Maria P.', type: 'Services', status: 'denied', photo: 'maria_p.jpg' },
    ];

    const listElement = document.getElementById('applicationList');
    const filterTabs = document.getElementById('statusFilters');

    if (!listElement || !filterTabs) return;

    // --- Function to generate and render the application list based on filter ---
    const renderApplications = (filteredStatus = 'all') => {
        listElement.innerHTML = ''; // Clear current list

        const filteredApps = filteredStatus === 'all' 
            ? applications 
            : applications.filter(app => app.status === filteredStatus);

        filteredApps.forEach(app => {
            const itemElement = document.createElement('div');
            itemElement.className = 'application-item';
            
            // Random user images from pravatar for simulation
            const avatarUrl = `https://i.pravatar.cc/100?u=${app.photo}`;

            // Build status-specific content
            let statusClass = '';
            let statusText = '';
            let actionText = '';

            switch(app.status) {
                case 'verified': 
                    statusClass = 'status-verified';
                    actionText = 'Verified'; 
                    break;
                case 'denied': 
                    statusClass = 'status-denied';
                    actionText = 'Denied'; 
                    break;
                default: // Pending
                    statusClass = 'status-pending';
                    actionText = 'Pending'; 
                    break;
            }

            itemElement.innerHTML = `
                <div class="vendor-block">
                    <img src="${avatarUrl}" alt="${app.name}" class="vendor-avatar">
                    <div class="vendor-details">
                        <h4>${app.name}</h4>
                        <p class="type">${app.type}</p>
                        
                    </div>
                </div>
                <div class="action-block">
                    <button class="btn-dashboard-item ${statusClass}">${actionText}</button>
                </div>
            `;
            listElement.appendChild(itemElement);
        });
    };

    // --- Handle Filter Tab Clicks ---
    Array.from(filterTabs.children).forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active state
            Array.from(filterTabs.children).forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Render list based on selected status
            const status = this.getAttribute('data-status');
            renderApplications(status);
        });
    });

    // Initial render
    renderApplications();
});

// VENDOR DATABASE
document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('vendorBody');
    if (!tableBody) return;

    const vendorData = [
        { name: 'James Kallean', id: 'Ven-301', status: 'verified', action: 'View Vendor'},
        { name: 'Laura L.', id: 'Ven-332', status: 'verified', action: 'View Vendor'},
        { name: 'Stuart S.', id: 'Ven-322', status: 'pending', action: 'View Vendor'},
        { name: 'Tanya T.', id: 'Ven-315', status: 'denied', action: 'View Vendor'},
        { name: 'Carlos M.', id: 'Ven-310', status: 'verified', action: 'View Vendor'},
        { name: 'Maria P.', id: 'Ven-305', status: 'pending', action: 'View Vendor'},
        { name: 'Ravi R.', id: 'Ven-299', status: 'denied', action: 'View Vendor'},
    ];

    const modal = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('closeModal');

    // 1. Single loop to generate table rows
    vendorData.forEach((item) => {
        const row = document.createElement('tr');
        
        const randomImg = `https://i.pravatar.cc/100?u=${item.id}`;
        const statusClass = `status-${item.status}`;

        row.innerHTML = `
            <td>
                <div class="vendor-cell">
                    <img src="${randomImg}" class="vendor-img" alt="${item.name}">
                </div>
            </td>
            <td>${item.name}</td>
            <td><code>${item.id}</code></td>
            <td>
                <span class="status-pill ${statusClass}">
                    <i class="fas fa-circle" style="font-size: 6px"></i> ${item.status.toUpperCase()}
                </span>
            </td>
            <td> 
                <button class="btn-action" onclick="openVendorModal()">${item.action}</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // 2. Modal Logic Functions
    // We define this on the window object so the inline 'onclick' can find it
    window.openVendorModal = function() {
        modal.style.display = 'flex';
        // Optional: prevent background scrolling when modal is open
        document.body.style.overflow = 'hidden'; 
    };

    closeBtn.onclick = function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    // Close if clicking outside the card
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };
});

// VENDOR DATABASE CHART
const statusData = [
    { label: 'Verified', percentage: 65, color: '#16a34a' },
    { label: 'Pending', percentage: 25, color: '#f59e0b' },
    { label: 'Denied', percentage: 10, color: '#dc2626' }
];

const svg = document.getElementById('pie-chart');
const legend = document.getElementById('legend');

// Only render chart if elements exist
if (svg && legend) {
    let cumulativePercent = 0;

    function getCoordinates(percent, radius = 45) {
        const x = 50 + radius * Math.cos(2 * Math.PI * percent - Math.PI / 2);
        const y = 50 + radius * Math.sin(2 * Math.PI * percent - Math.PI / 2);
        return [x, y];
    }

    statusData.forEach(data => {
        // Calculate Slice Path
        const startPercent = cumulativePercent;
        const endPercent = cumulativePercent + (data.percentage / 100);
        const [startX, startY] = getCoordinates(startPercent);
        const [endX, endY] = getCoordinates(endPercent);
        const largeArcFlag = data.percentage > 50 ? 1 : 0;

        const pathData = `M 50 50 L ${startX} ${startY} A 45 45 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('fill', data.color);
        svg.appendChild(path);

        // Calculate Middle of Slice for Label
        const midPercent = startPercent + (data.percentage / 100) / 2;
        
        if (data.callout) {
            // Create External Callout for 'Absent'
            const [labelX, labelY] = getCoordinates(midPercent, 60);
        

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', labelX);
            text.setAttribute('y', labelY);
            text.setAttribute('class', 'callout-text');
            text.innerHTML = `<tspan x="${labelX}" dy="-1">${data.label}:</tspan><tspan x="${labelX}" dy="4.5">(${data.percentage}%)</tspan>`;
            svg.appendChild(text);
        } else {
            // Create Internal Label
            const [labelX, labelY] = getCoordinates(midPercent, 25);
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', labelX);
            text.setAttribute('y', labelY);
            text.setAttribute('class', 'chart-label');
            text.innerHTML = `<tspan x="${labelX}" dy="-1">${data.label}:</tspan><tspan x="${labelX}" dy="4.5">(${data.percentage}%)</tspan>`;
            svg.appendChild(text);
        }

        cumulativePercent = endPercent;

        // Add to Legend
        const item = document.createElement('div');
        item.className = 'legend-item';
        item.innerHTML = `<div class="color-box" style="background-color: ${data.color}"></div><span>${data.label}</span>`;
        legend.appendChild(item);
    });
}


// LOGIN Page
document.addEventListener('DOMContentLoaded', () => {
    const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#password');

    if (!togglePassword || !password) return;

    togglePassword.addEventListener('click', function () {
        // Toggle the type attribute
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        
        // Toggle the icon class between eye and eye-slash
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
});

// SECOND POPUP MODAL
document.addEventListener('DOMContentLoaded', () => {
    // Modal Elements
    const addVendorModal = document.getElementById('addVendorModal');
    const profileModal = document.getElementById('modalOverlay');
    
    if (!addVendorModal || !profileModal) return;

    // Trigger Buttons
    const btnAddNewVendor = document.querySelector('.btn-sidebar');
    const closeAddBtn = document.getElementById('closeAddModal');
    const cancelAddBtn = document.getElementById('cancelAdd');
    const newVendorForm = document.getElementById('newVendorForm');

    if (!btnAddNewVendor || !closeAddBtn || !cancelAddBtn || !newVendorForm) return;

    // Open Add Vendor Modal
    btnAddNewVendor.addEventListener('click', () => {
        addVendorModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    // Close Add Vendor Modal
    const closeAddAction = () => {
        addVendorModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    closeAddBtn.onclick = closeAddAction;
    cancelAddBtn.onclick = closeAddAction;

    // Handle Form Submission
    newVendorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Vendor added successfully to the database!');
        closeAddAction();
    });

    // Universal Close for clicking outside any modal
    window.onclick = function(event) {
        if (event.target == addVendorModal) closeAddAction();
        if (event.target == profileModal) {
            profileModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };
});

// APPLY FORM
document.addEventListener('DOMContentLoaded', () => {
    const applyForm = document.getElementById('applyForm');
    console.log('Apply form found:', applyForm ? 'YES' : 'NO');
    if (!applyForm) return;

    const submitBtn = applyForm.querySelector('.btn-submit');
    const statusMessage = document.getElementById('applyStatus');
    const loader = document.getElementById('applyLoader');

    console.log('Apply form elements loaded. Submit button:', submitBtn ? 'YES' : 'NO');

    applyForm.addEventListener('submit', async (e) => {
        console.log('Form submit event triggered');
        e.preventDefault();

        if (!submitBtn) return;

        statusMessage.textContent = '';
        statusMessage.className = 'status-message';
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        loader?.classList.remove('hidden');

        const formData = new FormData(applyForm);
        const payload = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            organisationName: formData.get('organisationName'),
        };

        console.log('Sending payload:', payload);

        try {
            const response = await fetch('http://localhost:3000/api/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json();

            console.log('Response:', data, 'Status:', response.status);

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Unable to submit application.');
            }

            statusMessage.textContent = 'Application submitted successfully. Confirmation email was sent.';
            statusMessage.classList.add('success');
            applyForm.reset();
        } catch (error) {
            console.error('Error:', error.message);
            statusMessage.textContent = `Error: ${error.message}`;
            statusMessage.classList.add('error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Apply Now!';
            loader?.classList.add('hidden');
        }
    });
});

// VENDOR DATABASE PAGE SPECIFIC
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('applicantsContainer')) return; // Only run on vendor-database.html

    let selectedApplicant = null;
    const applicantsContainer = document.getElementById('applicantsContainer');
    const newVendorForm = document.getElementById('newVendorForm');
    const messageDiv = document.getElementById('message');
    const createBtn = document.getElementById('createBtn');

    // Fetch applicants
    async function fetchApplicants() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = 'admin-login.html';
                return;
            }

            const response = await fetch('http://localhost:3000/api/admin/applicants', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = 'admin-login.html';
                return;
            }

            const applicants = await response.json();
            renderApplicants(applicants);
        } catch (error) {
            console.error('Failed to fetch applicants:', error);
        }
    }

    function renderApplicants(applicants) {
        applicantsContainer.innerHTML = '';
        applicants.forEach(applicant => {
            const div = document.createElement('div');
            div.style.padding = '10px';
            div.style.borderBottom = '1px solid #eee';
            div.style.cursor = 'pointer';
            div.style.backgroundColor = selectedApplicant?.id === applicant.id ? '#f0f8ff' : 'white';
            div.onclick = () => selectApplicant(applicant);

            div.innerHTML = `
                <strong>${applicant.firstName} ${applicant.lastName}</strong> - ${applicant.email}
                <br />
                <small>${applicant.organization_name}</small>
            `;
            applicantsContainer.appendChild(div);
        });
    }

    function selectApplicant(applicant) {
        selectedApplicant = applicant;
        document.getElementById('newVendorName').value = `${applicant.firstName} ${applicant.lastName}`;
        document.getElementById('newVendorOrg').value = applicant.organization_name;
        const vendorId = `SVV-${Date.now().toString().slice(-5)}`;
        document.getElementById('newVendorID').value = vendorId;
        renderApplicants(JSON.parse(applicantsContainer.dataset.applicants || '[]'));
    }

    // Handle form submission
    newVendorForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!selectedApplicant) {
            messageDiv.textContent = 'Please select an applicant first.';
            messageDiv.style.color = 'red';
            return;
        }

        createBtn.disabled = true;
        createBtn.textContent = 'Creating...';
        messageDiv.textContent = '';

        try {
            const token = localStorage.getItem('token');
            const expiryDate = document.getElementById('newVendorExpiry').value;

            const vendorData = {
                firstName: selectedApplicant.firstName,
                lastName: selectedApplicant.lastName,
                email: selectedApplicant.email,
                password: 'tempPassword123',
                organization_name: selectedApplicant.organization_name,
                user_type: 'vendor',
                vendor_id: document.getElementById('newVendorID').value,
                expires_at: new Date(expiryDate),
                status: 'VERIFIED'
            };

            const response = await fetch('http://localhost:3000/api/admin/create-vendor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(vendorData),
            });

            if (response.ok) {
                messageDiv.textContent = 'Vendor created successfully!';
                messageDiv.style.color = 'green';
                selectedApplicant = null;
                fetchApplicants();
                newVendorForm.reset();
            } else {
                const error = await response.json();
                messageDiv.textContent = `Error: ${error.message}`;
                messageDiv.style.color = 'red';
            }
        } catch (error) {
            console.error('Failed to create vendor:', error);
            messageDiv.textContent = 'Failed to create vendor. Please try again.';
            messageDiv.style.color = 'red';
        } finally {
            createBtn.disabled = false;
            createBtn.textContent = 'Create Vendor Account';
        }
    });

    fetchApplicants();
});

// ADMIN DASHBOARD PAGE SPECIFIC
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('applicationList')) return; // Only run on admin-dashboard.html

    // Fetch stats
    async function fetchStats() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = 'admin-login.html';
                return;
            }

            const response = await fetch('http://localhost:3000/api/admin/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = 'admin-login.html';
                return;
            }

            const stats = await response.json();
            updateStats(stats);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    }

    function updateStats(stats) {
        document.querySelector('.metric-value').textContent = stats.totalVendors;
        document.querySelectorAll('.metric-value')[1].textContent = stats.verifiedVendors;
        document.querySelectorAll('.metric-value')[2].textContent = stats.deniedVendors;
        document.querySelectorAll('.metric-value')[3].textContent = stats.pendingApplications;
        document.querySelectorAll('.metric-value')[4].textContent = stats.suspendedVendors;
        document.querySelectorAll('.metric-value')[5].textContent = stats.expiringSoon;
    }

    // Fetch applicants
    async function fetchApplicants() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/admin/applicants', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const applicants = await response.json();
            renderApplicants(applicants);
        } catch (error) {
            console.error('Failed to fetch applicants:', error);
        }
    }

    function renderApplicants(applicants) {
        const listElement = document.getElementById('applicationList');
        listElement.innerHTML = '';

        applicants.forEach(applicant => {
            const itemElement = document.createElement('div');
            itemElement.className = 'application-item';

            const avatarUrl = `https://i.pravatar.cc/100?u=${applicant.email}`;

            itemElement.innerHTML = `
                <div class="vendor-block">
                    <img src="${avatarUrl}" alt="${applicant.firstName}" class="vendor-avatar">
                    <div class="vendor-details">
                        <h4>${applicant.firstName} ${applicant.lastName}</h4>
                        <p class="type">${applicant.organization_name}</p>
                    </div>
                </div>
                <div class="action-block">
                    <button class="btn-dashboard-item status-pending">Pending</button>
                </div>
            `;
            listElement.appendChild(itemElement);
        });
    }

    fetchStats();
    fetchApplicants();
});


