import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, onSnapshot, query,where} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
const db = getFirestore();
const auth = getAuth();


document.getElementById("singIn").addEventListener("click",()=>{
    let email = document.getElementById("email1").value;
    let password = document.getElementById("password1").value;
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        usuarios(email)
        
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


async function usuarios(email){
    const q = query(collection(db, "Personal"), where("usuario", "==", email));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
        if (doc.data().Cargo == "Director") {
            location.href = "director-ini.html"
        }
        else {
            location.href = "admin.html"
        }
        });
    });
}