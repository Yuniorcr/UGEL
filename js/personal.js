import { getFirestore, collection, addDoc, onSnapshot, query, doc, deleteDoc, updateDoc, orderBy } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, signOut, onAuthStateChanged, createUserWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
const auth = getAuth();
const db = getFirestore();

// borrar documentos de  Personal
const DeletePereson = async (id) => {
  await deleteDoc(doc(db, "Personal",id));
}
// CerrarSession
const CerrarSession = async () => {
  signOut(auth).then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
}
// habilitar usuarios
const disabled = async () => {
  let cargito = document.getElementById("cargo").value;
  if (cargito == "Director") {
    document.getElementById("Usuario22").removeAttribute("disabled");
    document.getElementById("contraseña22").removeAttribute("disabled");
  }else{
    document.getElementById("Usuario22").setAttribute("disabled", "");
    document.getElementById("contraseña22").setAttribute("disabled", "");
  }
}
document.getElementById("CerrarSession").addEventListener("click", CerrarSession);
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
  let Usuario = document.getElementById("Usuario22").value;
  let password = document.getElementById("contraseña22").value;
  let aviso = document.getElementById("error1");
  var Modalerror = new bootstrap.Modal(document.getElementById('exampleModal1'), {keyboard: false})
  if (Cargo == "Director") {
      if ( await ValidateDni(Dni) && await ValidateName(Nombres) && await ValidateSurnames(Apellidos) && await ValidateEmail(Usuario) && await ValidatePassword(password)) {
        createUserWithEmailAndPassword(auth, Usuario, cleanSpaces(password))
        .then(() => {
          agregarConEmail(Dni, Nombres, Apellidos, Cargo, Condicion, Jornada, Usuario, Modalerror, aviso);
        })
        .catch((error) => {
          const errorMessage = error.message;
          Modalerror.show()
                aviso.innerHTML =`<div class="alert alert-danger" role="alert">
                ${errorMessage}
              </div>`
        });
      }else{
        console.log("error");
      }
  }else{
    if (await ValidateDni(Dni) && await ValidateName(Nombres) && await ValidateSurnames(Apellidos) ) {
      const docRef = await addDoc(collection(db, "Personal"), {
        Dni: Dni.trim(),
        Nombres: Nombres.trim().toUpperCase(),
        Apellidos: Apellidos.trim().toUpperCase(),
        Cargo: Cargo,
        Condicion: Condicion,
        Jornada: Jornada.trim().toUpperCase(),
        date: new Date()
      })
      .then((docRef) => {
          Modalerror.show()
          aviso.innerHTML =`<div class="alert alert-success" role="alert">Documento Insertado </br><p>Id: ${docRef.id}</p></div>`
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
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  var tab = document.getElementById("tab");
  var spinner = document.getElementById("Spinner");
  spinner.innerHTML = `<div class="spinner-border text-info" role="status">
  <span class="visually-hidden">Loading...</span>
</div>`
  const q = query(collection(db, "Personal"), orderBy("date", "desc"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    spinner.innerHTML = '';
    tab.innerHTML = `<tr>
    <th>DNI</th>
    <th>Nombres</th>
    <th>Apellidos</th>
    <th>Cargo</th>
    <th>Condicion Laboral</th>
    <th>Jornada Laboral</th>
    <th>Acción</th>
  </tr>`;
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

async function ValidateDni(dni){
  // clean special characters, letters, spaces only leave numbers together
  dni = dni.replace(/[^0-9]/g, '');
  if (dni.length != 8) {
    document.getElementById("dni").setAttribute("style", "border: 1px solid red");
    return false;
  }else if (dni.length ==8) {
    document.getElementById("dni").removeAttribute("style");
    return true;
  }
}

//function to validate name cleaning spaces
async function ValidateName(name){
  name = name.replace(/[^a-zA-Z ]/g, ''); // remove special characters
  name = name.replace(/\s+/g, ' '); // remove spaces
  name = name.trim(); // remove spaces from start and end of string
  if (name.length < 3) {
    document.getElementById("nombres").setAttribute("style", "border: 1px solid red");
    return false;
  }else if (name.length >= 3) {
    document.getElementById("nombres").removeAttribute("style");
    return true;
  }
}
//function to validate surnames
async function ValidateSurnames(surnames){
  surnames = surnames.replace(/[^a-zA-Z ]/g, ''); // remove special characters
  surnames = surnames.replace(/\s+/g, ' '); // remove spaces
  surnames = surnames.trim(); // remove spaces from start and end of string
  if (surnames.length < 3) {
    document.getElementById("apellidos").setAttribute("style", "border: 1px solid red");
    return false;
  }else if (surnames.length >= 3) {
    document.getElementById("apellidos").removeAttribute("style");
    return true;
  }
}

// function to validate email
async function ValidateEmail(email){
  var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(email.match(regex)){
    document.getElementById("Usuario22").removeAttribute("style");
    return true;
  }else{
    document.getElementById("Usuario22").setAttribute("style", "border: 1px solid red");
    return false;
  }
}

// function to validate password
async function ValidatePassword(password){
  if(cleanSpaces(password).length >= 6){
    document.getElementById("contraseña22").removeAttribute("style");
    return true;
  }else{
    document.getElementById("contraseña22").setAttribute("style", "border: 1px solid red");

    console.log(cleanSpaces(password));
    return false;
    
  }
}

//function to clean spaces
function cleanSpaces(string){
  return string.replace(/\s/g, '');
}

//clean java script tags
function cleanScript(string){
  return string.replace(/<script[^>]*>(.|\n)*?<\/script>/g, '');
}

async function agregarConEmail(Dni, Nombres, Apellidos, Cargo, Condicion, Jornada, usuario, Modalerror, aviso){
  const docRef = await addDoc(collection(db, "Personal"), {
    Dni: Dni.trim(),
    Nombres: Nombres.trim().toUpperCase(),
    Apellidos: Apellidos.trim().toUpperCase(),
    Cargo: Cargo,
    Condicion: Condicion,
    Jornada: Jornada.trim().toUpperCase(),
    usuario: usuario.trim().toUpperCase(),
    date: new Date()
  })
  .then((docRef) => {
      Modalerror.show()
      aviso.innerHTML =`<div class="alert alert-success" role="alert">Documento Insertado </br><p>Id: ${docRef.id}</p></div>`
      document.getElementById("dni").value = '';
      document.getElementById("nombres").value = '';
      document.getElementById("apellidos").value = '';
      document.getElementById("jornada").value = '';
      document.getElementById("Usuario22").value = '';
      document.getElementById("contraseña22").value = '';
  })
  .catch((error) => {
        Modalerror.show()
        aviso.innerHTML =`<div class="alert alert-danger" role="alert">
        ${error}
      </div>`
  });
}

