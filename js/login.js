import { auth } from "./firebase-config.js";

import {
    signInWithEmailAndPassword,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


const loginForm =
    document.getElementById("login-form");


loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;


    try {

        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


        console.log(
            "Sesión iniciada:",
            userCredential.user.uid
        );


        window.location.href =
            "perfil.html";


    } catch (error) {

        console.error(
            "Error al iniciar sesión:",
            error
        );

        alert(
            "Correo o contraseña incorrectos."
        );

    }

});

const openResetModal =
    document.getElementById("open-reset-modal");

const resetModal =
    document.getElementById("reset-modal");

const closeResetModal =
    document.getElementById("reset-modal-close");

const resetPasswordForm =
    document.getElementById("reset-password-form");


openResetModal.addEventListener("click", (event) => {

    event.preventDefault();

    resetModal.classList.add("active");

});


closeResetModal.addEventListener("click", () => {

    resetModal.classList.remove("active");

});

resetPasswordForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const email =
            document
                .getElementById("reset-email")
                .value
                .trim();


        try {

            await sendPasswordResetEmail(
                auth,
                email
            );


            alert(
                "Se envió un enlace para restablecer la contraseña. Revisa tu correo."
            );


            resetPasswordForm.reset();

            resetModal.classList.remove("active");


        } catch (error) {

            console.error(
                "Error al recuperar contraseña:",
                error
            );

            alert(
                "No fue posible enviar el correo de recuperación."
            );

        }

    }
);