import { getAuth, signOut,onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
const auth = getAuth();

window.addEventListener("DOMContentLoaded", async () => {
    onAuthStateChanged(auth, (user) => {
        var tb = document.getElementById("datosInfo");
        if (user) {
            tb.innerHTML =''
            tb.innerHTML += `
            <tr>
                <th>${user.email}</th>
                <th>${user.displayName}</th>
            </tr>
            
            `
        } else {
            location.href = "index.html"
        }
    });
})


// const formulario = document.querySelector('#formulario');
// const boton = document.querySelector('#boton');
// const resultado = document.querySelector('#resultado')
                  
// const filtrar = ()=>{ 
//  // console.Log(formulario.value);
//   const texto = formulario.value.toLowerCase();
//  for(let producto of productos){
//     let nombre producto.nombre.toLowerCase(); 
//     if(nombre.indexOf (texto) !== -1){
//   }
// }
// boton.addEventListener('click', filtrar)

//