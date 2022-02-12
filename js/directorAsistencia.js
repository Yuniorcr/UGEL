import { getFirestore, collection, addDoc, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
const auth = getAuth();
const db = getFirestore();


const fecha = async () => {
    let actFecha = document.getElementById("fechas").value;
    await llenarTabla(actFecha);
}
const leyenda = document.getElementById("inputGroupSelect01");
document.getElementById("fechas").addEventListener("change", fecha);
document.getElementById("marcar").addEventListener("click", MarcarAsistencia);
leyenda.addEventListener("change", () => {
    console.log(leyenda.value);
    if (leyenda.value == "P" || leyenda.value == "T") {
        document.getElementById("Hingreso").removeAttribute("disabled");
        document.getElementById("Hsalida").removeAttribute("disabled");
        
    }else{
        document.getElementById("Hingreso").setAttribute("disabled", "");
        document.getElementById("Hsalida").setAttribute("disabled", "");
    }
});
window.addEventListener("DOMContentLoaded", async () => {
    var  date = new Date();
    document.getElementById("fechas").value = date.getFullYear() + '-' + date.getMonth() +1+ '-' + date.getDate();
    var fechaValorP = document.getElementById("fechas").value;

    onAuthStateChanged(auth, (user) => {
    if (user) {
        const q = query(collection(db, "Personal"), where("usuario", "==", (user.email).toUpperCase()));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                llenarTabla(fechaValorP, doc.data().InstitucionE);
            })
        })

    } 
    });
})

function VerificarMarcadoAsistencia(dni, fecha){

    return new Promise((resolve, reject) => {
        const q = query(collection(db, "Asistencia"), where("Dni", "==", dni), where("fecha", "==", fecha));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            if (querySnapshot.empty == false) {
                resolve(true);
            } else {
                resolve(false);    
            }
        })
    })
}

async function llenarTabla(f, i) {
    let tb = document.getElementById("marcarasistencia");
    const q = query(collection(db, "Personal"), where("InstitucionE", "==", i));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
    tb.innerHTML = '';
    querySnapshot.forEach((doc) => {
        VerificarMarcadoAsistencia(doc.data().Dni,f ).then( (result) => {
            if (result == false) {
                tb.innerHTML +=
        `
        <tr>
              <td>${doc.data().Dni}</td>
              <td>${doc.data().Nombres} ${doc.data().Apellidos}</td>
              <td>${doc.data().Cargo}</td>
              <td>
              No marcado
              </td>
              <td>
                <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="marcarasistencia('${doc.data().Dni}','${doc.data().Nombres}','${doc.data().Apellidos}','${doc.data().Cargo}')">Marcar</button>
              </td>
            </tr>
        `
            } else {
                tb.innerHTML +=
                `
                <tr>
                    <td>${doc.data().Dni}</td>
                    <td>${doc.data().Nombres} ${doc.data().Apellidos}</td>
                    <td>${doc.data().Cargo}</td>
                    <td>
                    Marcado
                    </td>
                    <td>
                        <button type="button" class="btn btn-success"disabled>Marcar</button>
                    </td>
                    </tr>
        `
            }
        })
    });

    });
}
async function MarcarAsistencia(){
    const dni = document.getElementById("dniM").value;
    const nombres = document.getElementById("NonmbresM").value;
    const apellidos = document.getElementById("ApellidosM").value;
    const cargo = document.getElementById("CargoM").value;
    const fecha = document.getElementById("fechas2").value;
    const Hingreso = document.getElementById("Hingreso").value;
    const Hsalida = document.getElementById("Hsalida").value;
    const inputGroupSelect01 = document.getElementById("inputGroupSelect01").value;
    let fechasa = fecha.split("-");
    let dateasas = new Date(fechasa[0], fechasa[1]-1, fechasa[2],0,0,0);
    console.log(Hingreso, Hsalida);
    let hora1 = (Hsalida).split(":"),
    hora2 = (Hingreso).split(":"),
    t1 = new Date(),
    t2 = new Date();
    t1.setHours(hora1[0], hora1[1], 0);
    t2.setHours(hora2[0], hora2[1], 0);
    //Aquí hago la resta
    t1.setHours(t1.getHours() - t2.getHours(), t1.getMinutes() - t2.getMinutes(), t1.getSeconds() - t2.getSeconds());
    //Imprimo el resultado
    let horaTotal = 0;
    let MinutosTotal = 0;
    if (t1.getMinutes() ==0) {
        horaTotal = 5 - t1.getHours();
        MinutosTotal = t1.getMinutes();
    }else{
        horaTotal = (5 - t1.getHours())-1;
        MinutosTotal = (59 - t1.getMinutes())+1;
    }
    // console.log(dateasas.getTime());
    let stringcito = parseInt(dateasas.getTime())
    console.log(typeof(stringcito));
    if (inputGroupSelect01 == "P" || inputGroupSelect01 == "T") {
        const docRef = await addDoc(collection(db, "Asistencia"), {
            Dni: dni,
            Nombres: nombres,
            Apellidos: apellidos,
            Cargo: cargo,
            fecha: fecha,
            fechaMarcaDeTiempo: stringcito,
            Hingreso: Hingreso,
            Hsalida: Hsalida,
            Horas: horaTotal,
            Minutos: MinutosTotal,
            Leyenda: inputGroupSelect01
        }).then(() => {
            llenarTabla(fecha);
            document.getElementById("marcar").setAttribute("disabled", "");
        }).catch(() => {
            alert("Error al marcar asistencia");
        });
    } else{
        const docRef = await addDoc(collection(db, "Asistencia"), {
            Dni: dni,
            Nombres: nombres,
            Apellidos: apellidos,
            Cargo: cargo,
            fecha: fecha,
            fechaMarcaDeTiempo: stringcito,
            dia:1,
            Leyenda: inputGroupSelect01
        }).then(() => {
            document.getElementById("marcar").setAttribute("disabled", "");
            llenarTabla(fecha);
        }).catch(() => {
            alert("Error al marcar asistencia");
        });
    }
}

