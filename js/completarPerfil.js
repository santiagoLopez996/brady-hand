import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const userName =
    document.getElementById("google-user-name");

const userEmail =
    document.getElementById("google-user-email");

const completeForm =
    document.getElementById("complete-profile-form");


let currentUser = null;

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href =
            "login.html";

        return;
    }


    currentUser = user;


    // Mostrar datos obtenidos de Google

    userName.textContent =
        user.displayName || "Usuario";

    userEmail.textContent =
        user.email;


    // Comprobar que no haya completado ya el perfil

    const doctorRef =
        doc(
            db,
            "medicos",
            user.uid
        );

    const doctorSnap =
        await getDoc(doctorRef);


    if (doctorSnap.exists()) {

        window.location.href =
            "perfil.html";

    }

});

completeForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        if (!currentUser) {
            return;
        }


        const cedula =
            document
                .getElementById("complete-id")
                .value
                .trim();

        const entidad =
            document
                .getElementById("complete-entity")
                .value;

        const genero =
            document
                .getElementById("complete-gender")
                .value;

        const birthdate =
            document
                .getElementById("complete-birthdate")
                .value;


        try {

            const nombreCompleto =
                currentUser.displayName || "";


            const partesNombre =
                nombreCompleto.split(" ");


            const nombre =
                partesNombre[0] || "";

            const apellido =
                partesNombre
                    .slice(1)
                    .join(" ");


            await setDoc(
                doc(
                    db,
                    "medicos",
                    currentUser.uid
                ),
                {
                    nombre: nombre,
                    apellido: apellido,
                    cedula: cedula,
                    entidad: entidad,
                    genero: genero,
                    birthdate: birthdate,
                    correo: currentUser.email,
                    proveedor: "google",
                    fechaRegistro:
                        serverTimestamp()
                }
            );


            console.log(
                "Perfil de Google completado."
            );


            window.location.href =
                "perfil.html";


        } catch (error) {

            console.error(
                "Error al completar perfil:",
                error
            );

            alert(
                "No fue posible completar el registro."
            );

        }

    }
);