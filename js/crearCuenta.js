import { auth, db } from "./firebase-config.js";

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

console.log("crearCuenta.js cargó correctamente");


const registerForm =
    document.getElementById("register-form");


registerForm.addEventListener("submit", async (event) => {

    console.log("Formulario detectado");

    event.preventDefault();


    // Obtener datos del formulario

    const nombre =
        document.getElementById("nombre").value.trim();

    const apellido =
        document.getElementById("apellido").value.trim();

    const cedula =
        document.getElementById("cedula").value.trim();

    const entidad =
        document.getElementById("entidad").value;

    const genero =
        document.getElementById("genero").value;
        
    const birthdate =
        document.getElementById("birth-date").value;

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirm-password").value;

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;


    // Verificar contraseñas

    if (!passwordRegex.test(password)) {

    alert(
        "La contraseña debe tener mínimo 8 caracteres, " +
        "una mayúscula, una minúscula y un número."
    );

    return;
}

    if (password !== confirmPassword) {

        alert("Las contraseñas no coinciden.");

        return;
    }


    try {

        // Crear usuario en Authentication

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );


        const user = userCredential.user;


        // Guardar información del médico en Firestore

        await setDoc(
            doc(db, "medicos", user.uid),
            {
                nombre: nombre,
                apellido: apellido,
                cedula: cedula,
                entidad: entidad,
                genero: genero,
                birthdate: birthdate,
                correo: email,
                fechaRegistro: serverTimestamp()
            }
        );


        console.log("Médico registrado correctamente.");

        // Ir al perfil

        window.location.href = "perfil.html";


    } catch (error) {

        console.error("Error:", error);

        alert("No fue posible crear la cuenta.");

    }

});