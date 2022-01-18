import { getFirestore, collection, addDoc, onSnapshot, query, doc, deleteDoc, updateDoc} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, signOut,onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
const auth = getAuth();
const db = getFirestore();
const DeletePereson = async (id) => {
  await deleteDoc(doc(db, "Personal",id));
}
const disabled = async () => {
  let cargito = document.getElementById("cargo").value;
  if (cargito == "Director") {
    document.getElementById("Usuario22").removeAttribute("disabled");
    document.getElementById("contraseña22").removeAttribute("disabled");
  }else if (cargito == "Otro") {
    document.getElementById("Usuario22").setAttribute("disabled", "");
    document.getElementById("contraseña22").setAttribute("disabled", "");
  }
}
document.getElementById("cargo").addEventListener("change", disabled);
document.getElementById("save").addEventListener("click", AddPerson);
document.getElementById("update").addEventListener("click", updatePerson);
async function AddPerson(){
  
  let Dni = document.getElementById("dni").value;
  let Nombres = document.getElementById("nombres").value;
  let Apellidos = document.getElementById("apellidos").value;
  let Cargo = document.getElementById("cargo").value;
  let Condicion = document.getElementById("condicion").value;
  let Jornada = document.getElementById("jornada").value;
  let aviso = document.getElementById("error1");
  var Modalerror = new bootstrap.Modal(document.getElementById('exampleModal1'), {keyboard: false})
  const docRef = await addDoc(collection(db, "Personal"), {
    Dni: Dni,
    Nombres: Nombres,
    Apellidos: Apellidos,
    Cargo: Cargo,
    Condicion: Condicion,
    Jornada: Jornada
  })
  .then((docRef) => {
      document.getElementById("dni").value = '';
      document.getElementById("nombres").value = '';
      document.getElementById("apellidos").value = '';
      document.getElementById("jornada").value = '';
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
  const q = query(collection(db, "Personal"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    tab.innerHTML = "";
    querySnapshot.forEach((doc) => {
      tab.innerHTML += 
      `
      <tr>
            <td>${doc.data().Dni}</td>
            <td>${doc.data().Nombres}</td>
            <td>${doc.data().Apellidos}</td>
            <td>${doc.data().Cargo}</td>
            <td>${doc.data().Condicion}</td>
            <td>${doc.data().Jornada}</td>
            <td>
            <button class="btn btn-primary"><a data-bs-toggle="modal"  onclick="UpdatePerson('${doc.id}','${doc.data().Dni}','${doc.data().Nombres}','${doc.data().Apellidos}','${doc.data().Cargo}','${doc.data().Condicion}','${doc.data().Jornada}')" data-bs-target="#staticBackdrop">Actualizar</a></button>
            <button class="btn btn-danger" id="${doc.id}" >Eliminar</button>
            </td>
          </tr>
      `
      const deleteButton = document.querySelectorAll('.btn-danger')
      deleteButton.forEach((button)=>{
        button.addEventListener('click', (e)=>{
          DeletePereson(e.target.id)
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

async function updatePerson(){
  let id = document.getElementById("idU").value;
  let Dni = document.getElementById("dniU").value;
  let Nombres = document.getElementById("nombresU").value;
  let Apellidos = document.getElementById("apellidosU").value;
  let Cargo = document.getElementById("cargoU").value;
  let Condicion = document.getElementById("condicionU").value;
  let Jornada = document.getElementById("jornadaU").value;
  var alertita = document.getElementById("alertita");
  const washingtonRef = doc(db, "Personal", id);
  
  // Set the "capital" field of the city 'DC'
  await updateDoc(washingtonRef, {
    Dni: Dni,
    Nombres: Nombres,
    Apellidos: Apellidos,
    Cargo: Cargo,
    Condicion: Condicion,
    Jornada: Jornada
  })
  .then(() => {
    alertita.innerHTML = `
    <div class="alert alert-success" role="alert">
    Update Correct ! :)
</div>
    `
    document.getElementById("dniU").value = '';
    document.getElementById("nombresU").value = '';
    document.getElementById("apellidosU").value = '';
    document.getElementById("jornadaU").value = '';
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
