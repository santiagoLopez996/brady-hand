// Firebase principal
import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

// Firebase Authentication
import { getAuth }
from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

// Cloud Firestore
import { getFirestore }
from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


// Configuración de tu proyecto Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDgla_w7rZmEItyQ_levTeVklStH2r60HA",
    authDomain: "bradyhand-5593a.firebaseapp.com",
    projectId: "bradyhand-5593a",
    storageBucket: "bradyhand-5593a.firebasestorage.app",
    messagingSenderId: "772862789207",
    appId: "1:772862789207:web:512baa1d4a961cae838512"
};


// Inicializar Firebase
const app = initializeApp(firebaseConfig);


// Inicializar servicios que vamos a usar
const auth = getAuth(app);
const db = getFirestore(app);


// Permitir que otros archivos JS los utilicen
export { auth, db };