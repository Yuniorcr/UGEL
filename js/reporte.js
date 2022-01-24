const mes = document.getElementById("mes");
mes.addEventListener("change", () => {
  division = mes.value.split("-");
  let date = new Date(division[0], division[1]-1, 1);
  let date2 = new Date(division[0], division[1], 0);
  console.log(date.getTime());
  console.log(date2);
})
// console.log("hello");
// var date = new Date();
// var primerDia = new Date(date.getFullYear(), date.getMonth(), 1);
// var ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);
// console.log(primerDia.toDateString());
// console.log(ultimoDia.toDateString());

// function convert(str) {
//     var mnths = {
//         Jan: "01",
//         Feb: "02",
//         Mar: "03",
//         Apr: "04",
//         May: "05",
//         Jun: "06",
//         Jul: "07",
//         Aug: "08",
//         Sep: "09",
//         Oct: "10",
//         Nov: "11",
//         Dec: "12"
//       },
//       date = str.split(" ");
  
//     return [date[3], mnths[date[1]], date[2]].join("-");
//   }
  
//   console.log(convert(primerDia.toDateString()));
//   //-> "2011-06-09"

//   console.log(primerDia.getTime());

// console.log(mes.value);