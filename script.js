// script.js - Logika Aplikasi Utama
import { 
    setUserSession, 
    getCurrentUser, 
    isLoggedIn, 
    logout, 
    redirectByRole, 
    validateSession,
    API_KEY
} from './auth.js';

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
    validateSession();
    setupEventListeners();
    
    if (isLoggedIn()) {
        redirectByRole();
        loadPageContent();
    }
});

// Setup event listeners
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('loginError');
    
    try {
        // Ganti dengan URL Apps Script Anda
        const response = await fetch('https://script.google.com/macros/s/AKfycbwo9QqACPfNSFi74Ra99gyKnbM4gpou0ykImQ8IjqiCOgpCLoFZ_HYKWA-HpRIB4oX9yA/exec', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'login',
                username,
                password,
                key: API_KEY
            })
        });
        
        const data = await response.json();
        
        if (data.error) throw new Error(data.error);
        if (!data.user) throw new Error('Login gagal');
        
        setUserSession(data.user);
        redirectByRole();
    } catch (error) {
        errorElement.textContent = error.message || 'Login gagal';
        console.error('Login error:', error);
    }
}

// Load content berdasarkan role
function loadPageContent() {
    const user = getCurrentUser();
    if (!user) return;
    
    // Update UI
    const welcomeElement = document.querySelector('header h1');
    if (welcomeElement) {
        welcomeElement.textContent += ` - ${user.username}`;
    }
    
    // Load role-specific content
    if (user.role === 'admin') loadAdminContent();
    else if (user.role === 'voter') loadVoterContent();
    else if (user.role === 'idol') loadIdolContent();
}

// Fungsi untuk masing-masing role
function loadAdminContent() {
    document.querySelector('main').innerHTML = `
        <h2>Admin Dashboard</h2>
        <p>Selamat datang di panel admin</p>
    `;
}

function loadVoterContent() {
    document.querySelector('main').innerHTML = `
        <h2>Voter Dashboard</h2>
        <p>Silakan pilih idol favorit Anda</p>
    `;
}

function loadIdolContent() {
    document.querySelector('main').innerHTML = `
        <h2>Idol Dashboard</h2>
        <p>Kelola profil Anda</p>
    `;
}
