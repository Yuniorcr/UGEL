import { getFirestore, collection, addDoc, onSnapshot, query, doc, deleteDoc, updateDoc} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, signOut, updateProfile,onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
const auth = getAuth();
const db = getFirestore();
const DeleteInstitution = async (id) => {
  await deleteDoc(doc(db, "Institucion",id));
}
document.getElementById("save").addEventListener("click", AddInstitucion);
document.getElementById("update").addEventListener("click", UpdateInstitution);

async function AddInstitucion(){
  
  let Nombre = document.getElementById("nombre").value;
  let Nivel = document.getElementById("nivel").value;
  let Codigo = document.getElementById("codigo").value;
  let Direccion = document.getElementById("direccion").value;
  let Distrito = document.getElementById("distrito").value;
  let aviso = document.getElementById("error1");
  var Modalerror = new bootstrap.Modal(document.getElementById('exampleModal1'), {keyboard: false})
  const docRef = await addDoc(collection(db, "Institucion"), {
    Nombre: Nombre,
    Nivel: Nivel,
    Codigo: Codigo,
    Direccion: Direccion,
    Distrito: Distrito
  })
  .then((docRef) => {
      document.getElementById("nombre").value = '';
      document.getElementById("nivel").value = '';
      document.getElementById("codigo").value = '';
      document.getElementById("direccion").value = '';
      document.getElementById("distrito").value = '';
  })
  .catch((error) => {
        Modalerror.show()
        aviso.innerHTML =`<div class="alert alert-danger" role="alert">
        ${error}
      </div>`
  });
}


window.addEventListener("DOMContentLoaded", async () => {
    var tab = document.getElementById("tab");
    const q = query(collection(db, "Institucion"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      tab.innerHTML = "";
      querySnapshot.forEach((doc) => {
        tab.innerHTML += 
        `
        <tr>
              <td>${doc.data().Nombre}</td>
              <td>${doc.data().Nivel}</td>
              <td>${doc.data().Codigo}</td>
              <td>${doc.data().Direccion}</td>
              <td>${doc.data().Distrito}</td>
              <td>
              <button class="btn btn-primary"><a data-bs-toggle="modal"  onclick="UpdateInstitution('${doc.id}','${doc.data().Nombre}','${doc.data().Nivel}','${doc.data().Codigo}','${doc.data().Direccion}','${doc.data().Distrito}')" data-bs-target="#staticBackdrop">Actualizar</a></button>
              <button class="btn btn-danger" id="${doc.id}" >Eliminar</button>
              </td>
            </tr>
        `
        const deleteButton = document.querySelectorAll('.btn-danger')
        deleteButton.forEach((button)=>{
          button.addEventListener('click', (e)=>{
            DeleteInstitution(e.target.id)
          })
    })
      });
    });

    onAuthStateChanged(auth, (user) => {
      if (user) {
          console.log("hi...");
      } else {
        location.href = "index.html";
      }
  });
    
  })
  async function UpdateInstitution(){
    let id = document.getElementById("idU").value;
    let Nombre = document.getElementById("nombreU").value;
    let Nivel = document.getElementById("nivelU").value;
    let Codigo = document.getElementById("codigoU").value;
    let Direccion = document.getElementById("direccionU").value;
    let Distrito = document.getElementById("distritoU").value;
    var alertita = document.getElementById("alertita");
    const washingtonRef = doc(db, "Institucion", id);
    
    // Set the "capital" field of the city 'DC'
    await updateDoc(washingtonRef, {
        Nombre: Nombre,
        Nivel: Nivel,
        Codigo: Codigo,
        Direccion: Direccion,
        Distrito: Distrito
    })
    .then(() => {
      alertita.innerHTML = `
      <div class="alert alert-success" role="alert">
      Update Correct ! :)
  </div>
      `
      document.getElementById("nombreU").value = '';
      document.getElementById("nivelU").value = '';
      document.getElementById("codigoU").value = '';
      document.getElementById("direccionU").value = '';
      document.getElementById("distritoU").value = '';
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

document.getElementById("cerrar").addEventListener("click", async () =>{
  signOut(auth).then(() => {
    location.href ="index.html";
  }).catch((error) => {
    console.log(error);
  });
})
