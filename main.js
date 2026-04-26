// ===== LOCAL STORAGE USERS =====
function getUsers() {
    return JSON.parse(localStorage.getItem('seo_users') || '[]');
}

function saveUsers(users) {
    localStorage.setItem('seo_users', JSON.stringify(users));
}

function getCurrentUser() {
    return JSON.parse(sessionStorage.getItem('seo_current') || 'null');
}

function saveCurrentUser(user) {
    sessionStorage.setItem('seo_current', JSON.stringify(user));
}

// ===== MODAL CONTROL =====
function openModal(tab) {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    switchTab(tab || 'signin');
    clearErrors();
}

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('modalSuccess').classList.add('hidden');
    document.getElementById('modalBox').querySelector('.modal-tabs').style.display = '';
    clearErrors();
}

function switchTab(which) {
    const tabSI = document.getElementById('tabSignIn');
    const tabSU = document.getElementById('tabSignUp');
    const formSI = document.getElementById('formSignIn');
    const formSU = document.getElementById('formSignUp');
    const success = document.getElementById('modalSuccess');

    success.classList.add('hidden');
    document.getElementById('modalBox').querySelector('.modal-tabs').style.display = '';
    clearErrors();

    if (which === 'signin') {
        tabSI.classList.add('active');
        tabSU.classList.remove('active');
        formSI.classList.remove('hidden');
        formSU.classList.add('hidden');
    } else {
        tabSU.classList.add('active');
        tabSI.classList.remove('active');
        formSU.classList.remove('hidden');
        formSI.classList.add('hidden');
    }
}

function clearErrors() {
    const siE = document.getElementById('siError');
    const suE = document.getElementById('suError');
    if (siE) siE.textContent = '';
    if (suE) suE.textContent = '';
}

document.getElementById('modalOverlay').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

document.getElementById('modalClose').addEventListener('click', closeModal);

// ===== SIGN IN =====
function handleSignIn(e) {
    e.preventDefault();

    const email = document.getElementById('siEmail').value.trim();
    const password = document.getElementById('siPassword').value;
    const errorEl = document.getElementById('siError');

    if (!email || !password) {
        errorEl.textContent = 'Please fill in all fields.';
        return;
    }

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        errorEl.textContent = 'Invalid email or password.';
        shakeModal();
        return;
    }

    saveCurrentUser(user);
    showSuccess('Welcome back!', `Signed in as ${user.name}.`);
    updateNavForUser(user);
}

// ===== SIGN UP =====
function handleSignUp(e) {
    e.preventDefault();

    const name = document.getElementById('suName').value.trim();
    const email = document.getElementById('suEmail').value.trim();
    const pass = document.getElementById('suPassword').value;
    const confirm = document.getElementById('suConfirm').value;
    const errorEl = document.getElementById('suError');

    if (!name || !email || !pass || !confirm) {
        errorEl.textContent = 'Please fill in all fields.';
        return;
    }

    if (pass.length < 6) {
        errorEl.textContent = 'Password must be at least 6 characters.';
        return;
    }

    if (pass !== confirm) {
        errorEl.textContent = 'Passwords do not match.';
        shakeModal();
        return;
    }

    const users = getUsers();

    if (users.find(u => u.email === email)) {
        errorEl.textContent = 'An account with this email already exists.';
        shakeModal();
        return;
    }

    const newUser = { name, email, password: pass, created: Date.now() };
    users.push(newUser);
    saveUsers(users);
    saveCurrentUser(newUser);

    showSuccess('Account Created!', `Welcome aboard, ${name}!`);
    updateNavForUser(newUser);
}

// ===== SHOW SUCCESS STATE =====
function showSuccess(title, msg) {
    document.getElementById('successTitle').textContent = title;
    document.getElementById('successMsg').textContent = msg;

    document.getElementById('formSignIn').classList.add('hidden');
    document.getElementById('formSignUp').classList.add('hidden');
    document.getElementById('modalSuccess').classList.remove('hidden');
    document.getElementById('modalBox').querySelector('.modal-tabs').style.display = 'none';
}

// ===== UPDATE NAV FOR LOGGED USER =====
function updateNavForUser(user) {
    const loginBtn = document.querySelector('.nav-login');
    const signupBtn = document.querySelector('.nav-signup');

    if (loginBtn) {
        loginBtn.textContent = user.name.split(' ')[0];
        loginBtn.onclick = function(e) {
            e.preventDefault();
            logOut();
        };
        loginBtn.title = 'Click to log out';
    }

    if (signupBtn) {
        signupBtn.textContent = 'Log Out';
        signupBtn.onclick = logOut;
    }
}

// ===== LOG OUT =====
function logOut() {
    sessionStorage.removeItem('seo_current');

    const loginBtn = document.querySelector('.nav-login');
    const signupBtn = document.querySelector('.nav-signup');

    if (loginBtn) {
        loginBtn.textContent = 'Login';
        loginBtn.onclick = function(e) { e.preventDefault(); openModal('signin'); };
        loginBtn.title = '';
    }

    if (signupBtn) {
        signupBtn.textContent = 'Sign Up';
        signupBtn.onclick = function() { openModal('signup'); };
    }

    closeModal();
}

// ===== SHAKE ANIMATION =====
function shakeModal() {
    const box = document.getElementById('modalBox');
    box.style.animation = 'none';
    box.offsetHeight;
    box.style.animation = 'shake 0.4s ease';
}

// ===== RESTORE SESSION =====
document.addEventListener('DOMContentLoaded', function() {
    const user = getCurrentUser();
    if (user) {
        updateNavForUser(user);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.feature-icon').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'scale(0.5)';
        observer.observe(el);
    });
});