import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithEmailAndPassword,
    RecaptchaVerifier,
    signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAc6kwcTKSjOjPEDv7UcfCcFKTgH624KAc",
    authDomain: "voltix-14821.firebaseapp.com",
    projectId: "voltix-14821",
    storageBucket: "voltix-14821.appspot.com",
    messagingSenderId: "464964542492",
    appId: "1:464964542492:web:77178a15832ce44c263fd9",
    measurementId: "G-8FRJ0MZ3RQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const errorMessage = document.getElementById('error-message');

const providers = {
    google: new GoogleAuthProvider(),
    github: new GithubAuthProvider()
};

Object.entries(providers).forEach(([key, provider]) => {
    const btn = document.getElementById(`${key}-sign-in`);
    if (btn) {
        btn.addEventListener('click', () => {
            errorMessage.textContent = '';
            errorMessage.classList.remove('show');
            signInWithPopup(auth, provider)
                .then(() => window.location.href = "/pages/index.html")
                .catch(e => {
                    errorMessage.textContent = `Ошибка: ${e.message}`;
                    errorMessage.classList.add('show');
                });
        });
    }
});

// Email login
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const emailSubmit = document.getElementById('email-submit');

emailSubmit.addEventListener('click', e => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    if (!email || !password) {
        errorMessage.textContent = 'Введите Email и пароль';
        errorMessage.classList.add('show');
        return;
    }
    errorMessage.textContent = '';
    errorMessage.classList.remove('show');

    signInWithEmailAndPassword(auth, email, password)
        .then(() => window.location.href = "/pages/index.html")
        .catch(e => {
            errorMessage.textContent = `Ошибка: ${e.message}`;
            errorMessage.classList.add('show');
        });
});

// Phone login modal elements
const phoneButton = document.getElementById('phone-sign-in');
const phoneModal = document.getElementById('phone-modal');
const phoneModalClose = document.getElementById('phone-modal-close');
const phoneInput = document.getElementById('phone-input');
const phoneSubmit = document.getElementById('phone-submit');
const codeInput = document.getElementById('code-input');
const codeSubmit = document.getElementById('code-submit');

let confirmationResult = null;
let recaptchaVerifier = null;

if (phoneButton && phoneModal) {
    phoneButton.addEventListener('click', () => {
        errorMessage.textContent = '';
        errorMessage.classList.remove('show');
        phoneModal.style.display = 'flex';
        phoneModal.setAttribute('aria-hidden', 'false');
        phoneInput.style.display = 'block';
        phoneSubmit.style.display = 'block';
        codeInput.style.display = 'none';
        codeSubmit.style.display = 'none';
        phoneInput.value = '';
        codeInput.value = '';
        phoneInput.focus();

        if (!recaptchaVerifier) {
            recaptchaVerifier = new RecaptchaVerifier(phoneSubmit, { size: 'invisible' }, auth);
            recaptchaVerifier.render();
        }
    });

    phoneModalClose.addEventListener('click', () => {
        phoneModal.style.display = 'none';
        phoneModal.setAttribute('aria-hidden', 'true');
        phoneInput.value = '';
        codeInput.value = '';
    });

    phoneSubmit.addEventListener('click', () => {
        const phoneNumber = phoneInput.value.trim();
        if (!phoneNumber.match(/^\+\d{10,15}$/)) {
            errorMessage.textContent = 'Введите корректный номер телефона (например, +38xxxxxxxxxx)';
            errorMessage.classList.add('show');
            return;
        }
        errorMessage.textContent = '';
        errorMessage.classList.remove('show');

        signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
            .then(result => {
                confirmationResult = result;
                phoneInput.style.display = 'none';
                phoneSubmit.style.display = 'none';
                codeInput.style.display = 'block';
                codeSubmit.style.display = 'block';
                codeInput.focus();
            })
            .catch(e => {
                errorMessage.textContent = `Ошибка: ${e.message}`;
                errorMessage.classList.add('show');
            });
    });

    codeSubmit.addEventListener('click', () => {
        const code = codeInput.value.trim();
        if (!code) {
            errorMessage.textContent = 'Введите код подтверждения';
            errorMessage.classList.add('show');
            return;
        }
        errorMessage.textContent = '';
        errorMessage.classList.remove('show');

        confirmationResult.confirm(code)
            .then(() => {
                phoneModal.style.display = 'none';
                phoneModal.setAttribute('aria-hidden', 'true');
                phoneInput.value = '';
                codeInput.value = '';
                window.location.href = "/pages/index.html";
            })
            .catch(e => {
                errorMessage.textContent = `Ошибка: ${e.message}`;
                errorMessage.classList.add('show');
            });
    });

    window.addEventListener('keydown', e => {
        if (e.key === 'Escape' && phoneModal.style.display === 'flex') {
            phoneModal.style.display = 'none';
            phoneModal.setAttribute('aria-hidden', 'true');
            phoneInput.value = '';
            codeInput.value = '';
        }
    });
}