import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
const auth = getAuth();


document.getElementById("singIn").addEventListener("click",()=>{
    let email = document.getElementById("email1").value;
    let password = document.getElementById("password1").value;
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        location.href = "admin.html"
    })
    .catch((error) => {
        const errorEnter = document.getElementById("error");
        const errorMessage = error.message;
        var Modalerror = new bootstrap.Modal(document.getElementById('exampleModal'), {keyboard: false})
        Modalerror.show()
        errorEnter.innerHTML =`<div class="alert alert-danger" role="alert">
        ${errorMessage}
      </div>`
    });
})

