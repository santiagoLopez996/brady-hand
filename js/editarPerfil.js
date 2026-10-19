import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const editButton =
    document.getElementById("btn-edit-profile");

const editModal =
    document.getElementById("edit-profile-modal");

const editClose =
    document.getElementById("edit-profile-close");

const editCancel =
    document.getElementById("edit-profile-cancel");

const editForm =
    document.getElementById("edit-profile-form");


const editName =
    document.getElementById("edit-name");

const editLastname =
    document.getElementById("edit-lastname");

const editId =
    document.getElementById("edit-id");

const editEntity =
    document.getElementById("edit-entity");

const editGender =
    document.getElementById("edit-gender");

const editBirthdate =
    document.getElementById("edit-birthdate");


let currentDoctor = null;


onAuthStateChanged(auth, (user) => {

    if (user) {

        currentDoctor = user;

    }

});

editButton.addEventListener("click", async () => {

    if (!currentDoctor) {
        return;
    }


    try {

        const doctorRef =
            doc(
                db,
                "medicos",
                currentDoctor.uid
            );


        const doctorSnap =
            await getDoc(doctorRef);


        if (doctorSnap.exists()) {

            const doctorData =
                doctorSnap.data();


            editName.value =
                doctorData.nombre || "";

            editLastname.value =
                doctorData.apellido || "";

            editId.value =
                doctorData.cedula || "";

            editEntity.value =
                doctorData.entidad || "";

            editGender.value =
                doctorData.genero || "";

            editBirthdate.value =
                doctorData.birthdate || "";


            editModal.classList.add("active");

        }


    } catch (error) {

        console.error(
            "Error al cargar datos:",
            error
        );

    }

});

editClose.addEventListener("click", () => {

    editModal.classList.remove("active");

});


editCancel.addEventListener("click", () => {

    editModal.classList.remove("active");

});

editForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    console.log("Intentando guardar cambios...");


    if (!currentDoctor) {

        console.log("No hay médico autenticado.");

        return;
    }


    try {

        const doctorRef =
            doc(
                db,
                "medicos",
                currentDoctor.uid
            );


        await updateDoc(
            doctorRef,
            {
                nombre: editName.value.trim(),
                apellido: editLastname.value.trim(),
                cedula: editId.value.trim(),
                entidad: editEntity.value,
                genero: editGender.value,
                birthdate: editBirthdate.value
            }
        );


        console.log(
            "Perfil actualizado correctamente."
        );


        editModal.classList.remove("active");


        window.location.reload();


    } catch (error) {

        console.error(
            "Error al actualizar perfil:",
            error
        );

        alert(
            "No fue posible actualizar el perfil."
        );

    }

});