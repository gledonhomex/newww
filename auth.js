// auth.js - Sistem Autentikasi Sederhana dan Aman
const AUTH_KEY = 'polling_auth';
const API_KEY = 'aodhoaidjwodjoijdiwjdad'; // Ganti dengan API key yang lebih aman

// Simpan session user
function setUserSession(user) {
    const sessionData = {
        user: user,
        timestamp: Date.now()
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(sessionData));
}

// Dapatkan user yang login
function getCurrentUser() {
    const session = localStorage.getItem(AUTH_KEY);
    if (!session) return null;
    
    const sessionData = JSON.parse(session);
    // Cek jika session kadaluarsa (8 jam)
    if (Date.now() - sessionData.timestamp > 28800000) {
        logout();
        return null;
    }
    return sessionData.user;
}

// Cek apakah user sudah login
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Logout
function logout() {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = 'index.html';
}

// Redirect berdasarkan role
function redirectByRole() {
    const user = getCurrentUser();
    if (!user) return;
    
    const currentPage = location.pathname.split('/').pop();
    const rolePages = {
        'admin': 'admin.html',
        'voter': 'voter.html',
        'idol': 'idol.html'
    };
    
    const targetPage = rolePages[user.role] || 'index.html';
    
    if (currentPage !== targetPage) {
        location.href = targetPage;
    }
}

// Validasi session di setiap halaman
function validateSession() {
    const publicPages = ['index.html', 'login.html'];
    const currentPage = location.pathname.split('/').pop();
    
    if (!isLoggedIn() && !publicPages.includes(currentPage)) {
        location.href = 'login.html';
    }
}

export {
    setUserSession,
    getCurrentUser,
    isLoggedIn,
    logout,
    redirectByRole,
    validateSession,
    API_KEY
};
