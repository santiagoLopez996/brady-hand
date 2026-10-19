import { auth, db } from "./firebase-config.js";

import {
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


const googleButton =
    document.getElementById("btn-google");


const googleProvider =
    new GoogleAuthProvider();


// Mostrar selector de cuentas de Google
googleProvider.setCustomParameters({
    prompt: "select_account"
});


googleButton.addEventListener("click", async () => {

    try {

        // Abrir ventana de Google
        const result =
            await signInWithPopup(
                auth,
                googleProvider
            );


        const user =
            result.user;


        console.log(
            "Usuario autenticado con Google:",
            user.email
        );


        // Buscar si el médico ya existe en Firestore

        const doctorRef =
            doc(
                db,
                "medicos",
                user.uid
            );


        const doctorSnap =
            await getDoc(doctorRef);


        if (doctorSnap.exists()) {

            // Médico ya registrado
            window.location.href =
                "perfil.html";

        } else {

            // Primera vez con Google
            window.location.href =
                "completarPerfil.html";

        }


    } catch (error) {

        console.error(
            "Error con Google Sign-In:",
            error
        );

        alert(
            "No fue posible iniciar sesión con Google."
        );

    }

});