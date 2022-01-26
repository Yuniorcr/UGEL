
function UpdatePerson(id, Dni,Nombres,Apellidos,Cargo,Condicion,Jornada){
    document.getElementById('idU').value = id;
    document.getElementById("dniU").value = Dni;
    document.getElementById("nombresU").value = Nombres;
    document.getElementById("apellidosU").value = Apellidos;
    document.getElementById("cargoU").value = Cargo;
    document.getElementById("condicionU").value = Condicion;
    document.getElementById("jornadaU").value = Jornada;
  }

function UpdateInstitution(id, nombre, nivel, codigo, direccion, distrito ){
    document.getElementById('idU').value = id;
    document.getElementById("nombreU").value = nombre;
    document.getElementById("nivelU").value = nivel;
    document.getElementById("codigoU").value = codigo;
    document.getElementById("direccionU").value = direccion;
    document.getElementById("distritoU").value = distrito;
}

function Asignar(id,Dni,Nombres,Apellidos,Cargo){
    document.getElementById('id').value = id;
    document.getElementById('dniA').value = Dni;
    document.getElementById("nombreA").value = Nombres;
    document.getElementById("apellidoA").value = Apellidos;
    document.getElementById("cargoA").value = Cargo;
}

function marcarasistencia(dni,nombres,apellidos,cargo){
    document.getElementById("dniM").value = dni;
    document.getElementById("NonmbresM").value = nombres;
    document.getElementById("ApellidosM").value = apellidos;
    document.getElementById("CargoM").value = cargo;
    document.getElementById("fechas2").value = document.getElementById("fechas").value;
}