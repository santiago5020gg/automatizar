
let orders = [];

const listTable = (registros) => {
    // Función para crear una fila de tabla
const crearFila = (registro) =>{
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${registro.Nombres}</td>
      <td>${registro.Apellidos}</td>
      <td>${registro.Dirección}</td>
      <td>${registro.Departamento}</td>
      <td>${registro.Ciudad}</td>
      <td>${registro.Celular}</td>
      <td>${registro.Observaciones}</td>
      <td>${registro.Cantidad}</td>
      <td>${registro.Total}</td>
      <td>${registro.Transpo}</td>
      <td>${registro.Producto}</td>
    `;
    return fila;
  }
  
  // Recorrer los datos JSON y agregar filas a la tabla
  for (const registro of registros) {
    const fila = crearFila(registro);
    const tablaRegistros = document.querySelector("#tabla-registros");
    tablaRegistros.tBodies[0].appendChild(fila);
  }
}

const getOrders = () => {
    try {
        orders = JSON.parse(localStorage.getItem("jsonOrders")) ? JSON.parse(localStorage.getItem("jsonOrders")): [];
        if(orders && orders.length >0){
            listTable(orders);
        }

    } catch (error) {
        alert("error al cargar las ordenes");
    }
}