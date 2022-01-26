import { getFirestore, collection, addDoc, onSnapshot, query, doc, deleteDoc, updateDoc,where} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
const db = getFirestore();

const mes = document.getElementById("mes");
mes.addEventListener("change", async () => {
  let division = mes.value.split("-");
  var da = new Date(division[0], division[1]-1, 1);
  var primerDia = new Date(da.getFullYear(), da.getMonth(), 1);
  var ultimoDia = new Date(da.getFullYear(), da.getMonth() + 1, 0);
  TraerReporte(primerDia.getTime(), ultimoDia.getTime());
  console.log(countWorkDay(convert(primerDia.toString()), convert( ultimoDia.toString())));
})

window.addEventListener("DOMContentLoaded", async () => {
  TraerReporte(1641013200000,1643605200000); 
})


async function TraerReporte( dt1, dt2){
  let tabla = document.getElementById("reporte");
  const q = query(collection(db, "Personal"))
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    tabla.innerHTML = "";
    querySnapshot.forEach((doc) => {
        sumarHorasEinasistencias(doc.data().Dni, dt1, dt2, doc.data().Nombres,doc.data().Apellidos,doc.data().Cargo, doc.data().Condicion, doc.data().Jornada).then(async (data) => {
           tabla.innerHTML += `
           <tr>
              <td>${data.dni}</td>
              <td>${data.nombre +" "+ data.apellido}</td>
              <td>${data.cargo}</td>
              <td>${data.condicion}</td>
              <td>${data.jornada}</td>
              <td>${data.inasistencias}</td>
              <td>${data.tardanzaHoras}</td>
              <td>${data.tardanzaMinutos}</td>
              <td>${data.PermisoSGh}</td>
              <td>${data.PermisoSGm}</td>
              <td>${data.Huelga}</td>
            </tr>`;
        }).catch(async (error) => {
          tabla.innerHTML += `
           <tr>
              <td>${error.dni}</td>
              <td>${error.nombre +" "+ error.apellido}</td>
              <td>${error.cargo}</td>
              <td>${error.condicion}</td>
              <td>${error.jornada}</td>
              <td>${error.inasistencias}</td>
              <td>${error.tardanzaHoras}</td>
              <td>${error.tardanzaMinutos}</td>
              <td>${error.PermisoSGh}</td>
              <td>${error.PermisoSGm}</td>
              <td>${error.Huelga}</td>
            </tr>`;
        })
    });
  });
}

async function sumarHorasEinasistencias(dni, d1, d2, nombre, apellido, cargo, condicion, jornada){
  return new Promise(async (resolve, reject) => {
    let inasistencias = 0;
    let tardanzaHoras = 0;
    let tardanzaMinutos = 0;
    let PermisoSGh = 0;
    let PermisoSGm = 0;
    let Huelga = 0;
    const q = query(collection(db, "Asistencia"), where("Dni", "==", dni));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (parseInt(doc.data().fechaMarcaDeTiempo) >= parseInt(d1) && parseInt(doc.data().fechaMarcaDeTiempo) <= parseInt(d2)) {
          if (doc.data().Leyenda == "P") {
              PermisoSGh += parseInt(doc.data().Horas);
              PermisoSGm += parseInt(doc.data().Minutos);
          } if (doc.data().Leyenda == "T") {
              tardanzaHoras += parseInt(doc.data().Horas);
              tardanzaMinutos += parseInt(doc.data().Minutos);
          } if (doc.data().Leyenda == "I"){
              inasistencias+=1;
          } if (doc.data().Leyenda == "H"){
              Huelga+=1;
              console.log();
          }
          resolve({ dni, nombre, apellido,cargo , inasistencias, condicion, jornada, tardanzaHoras, tardanzaMinutos, PermisoSGh, PermisoSGm, Huelga });
        }
      });
      reject({ dni, nombre, apellido, cargo, inasistencias, condicion, jornada, tardanzaHoras, tardanzaMinutos, PermisoSGh, PermisoSGm, Huelga });
    });
  })
}

function convert(str) {
    let mnths = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12"
      },
      date = str.split(" ");
  
    return [date[3], mnths[date[1]], date[2]].join("-");
  }

function stringToDate(data){
  let dateString = data.split('-');
  return new Date(dateString[0], dateString[1] - 1, dateString[2]);
}


function countWorkDay(dt1, dt2){
  let date1 = stringToDate(dt1);
  let date2 = stringToDate(dt2);
  let delta = (date2-date1) / (1000 * 60 * 60 * 24) + 1; // calcula el tiempo total

  let weeks = 0;
  for(let i = 0; i < delta; i++){
      if (date1.getDay () == 0 || date1.getDay () == 6){
        weeks++; // agrega 1 si es sábado o domingo
      } 
      date1 = date1.valueOf();
      date1 += 1000 * 60 * 60 * 24;
      date1 = new Date(date1);
  }
  return delta - weeks;
}
