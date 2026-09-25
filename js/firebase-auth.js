import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged,
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBB_P3JLwdCojVnzmjw11Z9qCOrbuWjt1w",
  authDomain: "astroinsight-724b6.firebaseapp.com",
  projectId: "astroinsight-724b6",
  storageBucket: "astroinsight-724b6.firebasestorage.app",
  messagingSenderId: "678515845937",
  appId: "1:678515845937:web:63fc45fa99d1fd45b6de10",
  measurementId: "G-D7JMZJX8KF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const authOverlay = document.getElementById('auth-modal-overlay');
    const authCloseBtn = document.getElementById('auth-close');
    const loginNavBtn = document.getElementById('nav-login-btn');
    const userProfileNav = document.getElementById('nav-user-profile');
    const userEmailDisplay = document.getElementById('nav-user-email');
    const logoutBtn = document.getElementById('nav-logout-btn');
    
    const tabSignIn = document.getElementById('tab-signin');
    const tabSignUp = document.getElementById('tab-signup');
    const formSignIn = document.getElementById('form-signin');
    const formSignUp = document.getElementById('form-signup');
    const errorMsg = document.getElementById('auth-error-msg');

    // Toggle Modal
    if (loginNavBtn) {
        loginNavBtn.addEventListener('click', () => {
            authOverlay.classList.add('active');
        });
    }

    if (authCloseBtn) {
        authCloseBtn.addEventListener('click', () => {
            authOverlay.classList.remove('active');
            errorMsg.style.display = 'none';
        });
    }

    // Toggle Tabs
    tabSignIn?.addEventListener('click', () => {
        tabSignIn.classList.add('active');
        tabSignUp.classList.remove('active');
        formSignIn.classList.add('active');
        formSignUp.classList.remove('active');
        errorMsg.style.display = 'none';
    });

    tabSignUp?.addEventListener('click', () => {
        tabSignUp.classList.add('active');
        tabSignIn.classList.remove('active');
        formSignUp.classList.add('active');
        formSignIn.classList.remove('active');
        errorMsg.style.display = 'none';
    });

    // Auth state listener
    if (auth) {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is logged in
                loginNavBtn.style.display = 'none';
                userProfileNav.style.display = 'flex';
                userEmailDisplay.textContent = user.email || 'User';
                authOverlay.classList.remove('active');
            } else {
                // User is logged out
                loginNavBtn.style.display = 'inline-block';
                userProfileNav.style.display = 'none';
            }
        });

        // Form Submissions
        formSignIn?.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const password = e.target.password.value;
            
            signInWithEmailAndPassword(auth, email, password)
                .catch((error) => {
                    errorMsg.textContent = error.message;
                    errorMsg.style.display = 'block';
                });
        });

        formSignUp?.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const password = e.target.password.value;
            
            createUserWithEmailAndPassword(auth, email, password)
                .catch((error) => {
                    errorMsg.textContent = error.message;
                    errorMsg.style.display = 'block';
                });
        });

        document.querySelectorAll('.auth-google-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                signInWithPopup(auth, provider).catch(error => {
                    errorMsg.textContent = error.message;
                    errorMsg.style.display = 'block';
                });
            });
        });

        logoutBtn?.addEventListener('click', () => {
            signOut(auth).catch((error) => {
                console.error("Sign out error", error);
            });
        });
    } else {
        // Mock behavior when config is missing
        formSignIn?.addEventListener('submit', (e) => {
            e.preventDefault();
            errorMsg.textContent = "Firebase config missing. Check console.";
            errorMsg.style.display = 'block';
        });
    }
});
