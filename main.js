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
    const modalTabs = document.getElementById('modalBox').querySelector('.modal-tabs');
    if (modalTabs) modalTabs.style.display = '';
    clearErrors();
}

function switchTab(which) {
    const tabSI = document.getElementById('tabSignIn');
    const tabSU = document.getElementById('tabSignUp');
    const formSI = document.getElementById('formSignIn');
    const formSU = document.getElementById('formSignUp');
    const success = document.getElementById('modalSuccess');

    success.classList.add('hidden');
    const modalTabs = document.getElementById('modalBox').querySelector('.modal-tabs');
    if (modalTabs) modalTabs.style.display = '';
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

const modalOverlay = document.getElementById('modalOverlay');
if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
}

const modalClose = document.getElementById('modalClose');
if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}
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

function showSuccess(title, msg) {
    document.getElementById('successTitle').textContent = title;
    document.getElementById('successMsg').textContent = msg;

    document.getElementById('formSignIn').classList.add('hidden');
    document.getElementById('formSignUp').classList.add('hidden');
    document.getElementById('modalSuccess').classList.remove('hidden');
    const modalTabs = document.getElementById('modalBox').querySelector('.modal-tabs');
    if (modalTabs) modalTabs.style.display = 'none';
}

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

    const mobileLogin = document.querySelector('.mobile-login');
    const mobileSignup = document.querySelector('.mobile-signup');

    if (mobileLogin) {
        mobileLogin.textContent = user.name.split(' ')[0];
        mobileLogin.onclick = function(e) {
            e.preventDefault();
            logOut();
        };
    }

    if (mobileSignup) {
        mobileSignup.textContent = 'Log Out';
        mobileSignup.onclick = logOut;
    }
}

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

    const mobileLogin = document.querySelector('.mobile-login');
    const mobileSignup = document.querySelector('.mobile-signup');

    if (mobileLogin) {
        mobileLogin.textContent = 'Login';
        mobileLogin.onclick = function(e) { e.preventDefault(); openModal('signin'); };
    }

    if (mobileSignup) {
        mobileSignup.textContent = 'Sign Up';
        mobileSignup.onclick = function() { openModal('signup'); };
    }

    closeModal();
}

function shakeModal() {
    const box = document.getElementById('modalBox');
    box.style.animation = 'none';
    box.offsetHeight;
    box.style.animation = 'shake 0.4s ease';
}

function initBurgerMenu() {
    const burgerIcon = document.getElementById('burgerIcon');
    const mobileMenu = document.getElementById('mobileMenu');

    if (burgerIcon && mobileMenu) {
        burgerIcon.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('open');
            document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
        });
        const mobileLinks = document.querySelectorAll('.mobile-nav-links a, .mobile-signup');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                burgerIcon.classList.remove('active');
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }
}

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

    initBurgerMenu();
});



// ===== РОЗШИРЕНИЙ ЧАТ З ШІ-АСИСТЕНТОМ (OpenRouter) =====
document.addEventListener('DOMContentLoaded', function() {
    const chatButton = document.getElementById('chatButton');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatMessages = document.getElementById('chatMessages');

    const OPENROUTER_API_KEY = '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'; 
    
    const MODEL = 'openrouter/free';

    if (chatButton) {
        chatButton.addEventListener('click', function(e) {
            e.stopPropagation();
            chatWindow.classList.toggle('open');
        });
    }

    if (chatClose) {
        chatClose.addEventListener('click', function() {
            chatWindow.classList.remove('open');
        });
    }

    document.addEventListener('click', function(e) {
        if (chatWindow && chatWindow.classList.contains('open')) {
            if (!chatWindow.contains(e.target) && !chatButton.contains(e.target)) {
                chatWindow.classList.remove('open');
            }
        }
    });

    function addMessage(text, isUser = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'system'}`;
        
        const messageText = document.createElement('span');
        messageText.textContent = text;
        messageDiv.appendChild(messageText);
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        return messageDiv;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message system typing-indicator';
        typingDiv.innerHTML = '<span>✎</span>';
        typingDiv.id = 'typingIndicator';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return typingDiv;
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
    }

    async function getAIResponse(userMessage) {
        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Lingtex Support Chat'
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: [
                        {
                            role: 'system',
                            content: `Ти - дружній асистент підтримки компанії Lingtex. 
                            Ти допомагаєш клієнтам з питаннями про SEO-послуги, беклінки, реєстрацію, 
                            ціни та загальні запитання. Відповідай українською мовою, будь ввічливим, 
                            доброзичливим і професійним. Якщо не знаєш відповіді - запропонуй зв'язатися 
                            з менеджером. Не використовуй маркдаун, тільки звичайний текст.`
                        },
                        {
                            role: 'user',
                            content: userMessage
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 500
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Помилка API:', error);
            return "Вибачте, сталася технічна помилка. Будь ласка, напишіть нам на email support@lingtex.com або спробуйте пізніше. 🙏";
        }
    }

    async function sendMessage() {
        const message = chatInput.value.trim();
        
        if (message === '') {
            chatInput.style.animation = 'shake 0.3s ease';
            setTimeout(() => {
                chatInput.style.animation = '';
            }, 300);
            return;
        }
        
        addMessage(message, true);
        
        chatInput.value = '';
        
        showTypingIndicator();
        
        try {
            const aiResponse = await getAIResponse(message);
            
            removeTypingIndicator();
            
            addMessage(aiResponse, false);
        } catch (error) {
            removeTypingIndicator();
            addMessage("Вибачте, сталася помилка. Будь ласка, спробуйте пізніше.", false);
        }
    }

    if (chatSendBtn) {
        chatSendBtn.addEventListener('click', sendMessage);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
    }
});