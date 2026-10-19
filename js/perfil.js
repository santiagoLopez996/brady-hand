import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
    doc,
    getDoc,
    collection,
    addDoc,
    getDocs,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


const addPatientButton =
    document.getElementById("btn-add-patient");

const patientModal =
    document.getElementById("patient-modal");

const closeModalButton =
    document.getElementById("modal-close");

const cancelButton =
    document.getElementById("btn-cancel");

const logoutButton =
    document.getElementById("btn-logout");


addPatientButton.addEventListener("click", () => {

    patientModal.classList.add("active");

});


closeModalButton.addEventListener("click", () => {

    patientModal.classList.remove("active");

});


cancelButton.addEventListener("click", () => {

    patientModal.classList.remove("active");

});

/*PONER LOS IMPORTS DE LA INFO DEL DOCTOR*/

const doctorFirstName = document.getElementById("doctor-first-name");
const doctorFullName = document.getElementById("doctor-full-name");
const doctorInitials = document.getElementById("doctor-initials");
const doctorId = document.getElementById("doctor-id");
const doctorEntity = document.getElementById("doctor-entity");
const doctorGenre = document.getElementById("doctor-genre");
const doctorBirthdate = document.getElementById("doctor-birth-date");
const doctorEmail = document.getElementById("doctor-email");
let currentUser = null;

const viewPatientModal =
    document.getElementById("view-patient-modal");

const viewPatientClose =
    document.getElementById("view-patient-close");

const viewPatientName =
    document.getElementById("view-patient-name");

const viewPatientId =
    document.getElementById("view-patient-id");

const viewPatientBirthdate =
    document.getElementById("view-patient-birthdate");

const viewPatientAge =
    document.getElementById("view-patient-age");

const registerTestButton =
    document.getElementById("btn-register-test");

const patientForm =
    document.getElementById("patient-form");

    const patientsList =
    document.getElementById("patients-list");

    let currentPatientId = null;


patientForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    const nombre =
        document.getElementById("patient-name").value.trim();

    const apellido =
        document.getElementById("patient-lastname").value.trim();

    const documento =
        document.getElementById("patient-id").value.trim();

    const fechaNacimiento =
        document.getElementById("patient-birthdate").value;


    if (!currentUser) {

        alert("No hay un usuario autenticado.");

        return;
    }


    try {

        const patientRef =
            await addDoc(
                collection(
                    db,
                    "medicos",
                    currentUser.uid,
                    "pacientes"
                ),
                {
                    nombre: nombre,
                    apellido: apellido,
                    documento: documento,
                    fechaNacimiento: fechaNacimiento,
                    fechaRegistro: serverTimestamp()
                }
            );

            await cargarPacientes();


        console.log(
            "Paciente guardado correctamente:",
            patientRef.id
        );


        alert(
            "Paciente registrado correctamente."
        );


        patientForm.reset();

        patientModal.classList.remove("active");


    } catch (error) {

        console.error(
            "Error al guardar paciente:",
            error
        );

        alert(
            "No fue posible registrar al paciente."
        );

    }

});

async function cargarPacientes() {

    if (!currentUser) {
        return;
    }

    try {

        const patientsRef =
            collection(
                db,
                "medicos",
                currentUser.uid,
                "pacientes"
            );

        const patientsSnapshot =
            await getDocs(patientsRef);


        // Limpiar lista antes de volver a cargar
        patientsList.innerHTML = "";


        patientsSnapshot.forEach((patientDocument) => {

            const patientData =
                patientDocument.data();

            const patientId =
                patientDocument.id;


            const patientCard =
                document.createElement("article");

            patientCard.classList.add("patient-card");


            const patientInfo =
                document.createElement("div");

            patientInfo.classList.add("patient-info");


            const patientName =
                document.createElement("h3");

            patientName.textContent =
                patientData.nombre + " " + patientData.apellido;


            const patientDocumentText =
                document.createElement("span");

            patientDocumentText.textContent =
                "Documento: " + patientData.documento;


            const viewButton =
                document.createElement("button");

            viewButton.classList.add("btn-view-patient");

            viewButton.textContent =
                "Ver paciente";


            // Guardamos el ID real de Firebase en el botón
            viewButton.dataset.patientId =
                patientId;

            viewButton.addEventListener("click", () => {

                abrirPaciente(patientId);

                });


            patientInfo.appendChild(patientName);
            patientInfo.appendChild(patientDocumentText);

            patientCard.appendChild(patientInfo);
            patientCard.appendChild(viewButton);

            patientsList.appendChild(patientCard);

        });


    } catch (error) {

        console.error(
            "Error al cargar pacientes:",
            error
        );

    }

}

async function abrirPaciente(patientId) {

    if (!currentUser) {
        return;
    }


    try {

        const patientRef =
            doc(
                db,
                "medicos",
                currentUser.uid,
                "pacientes",
                patientId
            );


        const patientSnap =
            await getDoc(patientRef);


        if (!patientSnap.exists()) {

            console.log(
                "No se encontró el paciente."
            );

            return;
        }


        const patientData =
            patientSnap.data();


        currentPatientId =
            patientId;


        viewPatientName.textContent =
            patientData.nombre +
            " " +
            patientData.apellido;


        viewPatientId.textContent =
            patientData.documento;


        viewPatientBirthdate.textContent =
            patientData.fechaNacimiento;


        viewPatientAge.textContent =
            calcularEdad(
                patientData.fechaNacimiento
            ) + " años";


        viewPatientModal.classList.add(
            "active"
        );


    } catch (error) {

        console.error(
            "Error al cargar paciente:",
            error
        );

    }

}

function calcularEdad(fechaNacimiento){

    const partes =
        fechaNacimiento.split("-");


    const año =
        Number(partes[0]);

    const mes =
        Number(partes[1]);

    const dia =
        Number(partes[2]);


    const hoy =
        new Date();


    let edad =
        hoy.getFullYear() - año;


    const mesActual =
        hoy.getMonth() + 1;

    const diaActual =
        hoy.getDate();


    if (
        mesActual < mes ||
        (
            mesActual === mes &&
            diaActual < dia
        )
    ) {

        edad--;

    }


    return edad;
}

viewPatientClose.addEventListener(
    "click",
    () => {

        viewPatientModal.classList.remove(
            "active"
        );

    }
);

registerTestButton.addEventListener(
    "click",
    () => {

        console.log(
            "Registrar prueba para:",
            currentPatientId
        );

    }
);

logoutButton.addEventListener("click", async (event) => {

    event.preventDefault();

    try {

        await signOut(auth);

        console.log("Sesión cerrada correctamente.");

        window.location.href = "index.html";

    } catch (error) {

        console.error(
            "Error al cerrar sesión:",
            error
        );

    }

});

onAuthStateChanged(auth, async (user) => {

    if (user) {

        currentUser = user;
        await cargarPacientes();

        try {

            const doctorRef =
                doc(db, "medicos", user.uid);

            const doctorSnap =
                await getDoc(doctorRef);


            if (doctorSnap.exists()) {

                const doctorData =
                    doctorSnap.data();


                doctorFirstName.textContent =
                    doctorData.nombre;

                doctorFullName.textContent =
                    doctorData.nombre + " " + doctorData.apellido;

                doctorId.textContent =
                    doctorData.cedula;

                doctorEntity.textContent =
                    doctorData.entidad;

                doctorGenre.textContent =
                    doctorData.genero;
                    
                doctorBirthdate.textContent =
                    doctorData.birthdate;                    

                doctorEmail.textContent =
                    doctorData.correo;


                doctorInitials.textContent =
                    doctorData.nombre.charAt(0).toUpperCase() +
                    doctorData.apellido.charAt(0).toUpperCase();


                console.log(
                    "Datos del médico cargados correctamente."
                );

            } else {

                console.log(
                    "No se encontraron datos del médico."
                );

            }

        } catch (error) {

            console.error(
                "Error al cargar el perfil:",
                error
            );

        }

    } else {

        window.location.href = "login.html";

    }

});