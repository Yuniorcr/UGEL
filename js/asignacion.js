import { getFirestore, collection, addDoc, onSnapshot, query, doc, deleteDoc, updateDoc,where} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, signOut,onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
const auth = getAuth();
const db = getFirestore();

document.getElementById("Asignar").addEventListener("click", Asignar);

const ReadAsignacion = async (cargo) => {
    var tab = document.getElementById("tab");
    var asignacion;
    const q = query(collection(db, "Personal"), where("Cargo", "==", cargo));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        tab.innerHTML = ''
        querySnapshot.forEach((doc) => {
            if (doc.data().asignacion == undefined) {
                asignacion = "No asignado"
            }
            tab.innerHTML += 
            `
            <tr>
                <td>${doc.data().Dni}</td>
                <td>${doc.data().Nombres}</td>
                <td>${doc.data().Apellidos}</td>
                <td>${doc.data().Cargo}</td>
                <td>
                <button class="btn btn-primary"><a data-bs-toggle="modal"  onclick="Asignar('${doc.id}','${doc.data().Dni}','${doc.data().Nombres}','${doc.data().Apellidos}','${doc.data().Cargo}')" data-bs-target="#staticBackdrop">Actualizar</a></button>
                </td>
                <td>${asignacion}</td>
                </tr>
            `
      });
    });
}

window.addEventListener("DOMContentLoaded", async () => {
    var tab = document.getElementById("tab");
    var asignacion;
    const q = query(collection(db, "Personal"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        tab.innerHTML = ''
        querySnapshot.forEach((doc) => {
            if (doc.data().Asignacion == undefined) {
                asignacion = "No asignado"
            }else{
                asignacion = doc.data().Asignacion
            }
            tab.innerHTML += 
            `
            <tr>
                <td>${doc.data().Dni}</td>
                <td>${doc.data().Nombres}</td>
                <td>${doc.data().Apellidos}</td>
                <td>${doc.data().Cargo}</td>
                <td>
                <button class="btn btn-primary"><a data-bs-toggle="modal"  onclick="Asignar('${doc.id}','${doc.data().Dni}','${doc.data().Nombres}','${doc.data().Apellidos}','${doc.data().Cargo}')" data-bs-target="#staticBackdrop">Actualizar</a></button>
                </td>
                <td>${asignacion}</td>
                </tr>
            `
      });
    });
    buscar.addEventListener('change', (e)=>{
        ReadAsignacion(buscar.value)
    })
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("hi...");
        } else {
            location.href("index.html")
        }
    });
})

async function Asignar(){
    let id = document.getElementById('id').value;
    let InstitucionE = document.getElementById('institucionA').value;
    let horae = document.getElementById("horaeA").value;
    let horaa = document.getElementById("horasA").value;
    var alertita = document.getElementById("alertita");
    const washingtonRef = doc(db, "Personal", id);
    
    // Set the "capital" field of the city 'DC'
    await updateDoc(washingtonRef, {
        InstitucionE: InstitucionE,
        horaE: horae,
        horaS: horaa,
        Asignacion: "Asignado"
    })
    .then(() => {
      alertita.innerHTML = `
      <div class="alert alert-success" role="alert">
      Asigned Correct ! :)
  </div>
      `
      document.getElementById("horaeA").value = '';
      document.getElementById("horasA").value = '';
    })
    .catch((error) => {
        // The document probably doesn't exist.
        alertita.innerHTML = `
      <div class="alert alert-danger" role="alert">
      Update failed ! :(
  </div>
      `
    });
}