
let jsonData = null;

function isValidJson(json) {
    const requiredKeys = ["Nombres", "Apellidos", "Dirección", "Departamento", "Ciudad", "Celular", "Observaciones", "Cantidad", "Total", "Transpo", "Producto"];
    // Convertir el JSON a un objeto

    // Recorrer las claves requeridas
    for (const clave of requiredKeys) {
        // Si la clave no existe en el objeto, retornar falso
        if (!json.hasOwnProperty(clave)) {
            return false;
        }
    }

    // Si todas las claves existen, retornar verdadero
    return true;
}

const getJsonFromText = (text) => {
    const regex = /\+\+\+([^\n:]+):\s*(.*)/g;
    let match;
    const json = {};
    while ((match = regex.exec(text)) !== null) {
        const key = match[1].trim();
        const value = match[2].trim();
        if (!value) {
            err += 1;
            return;
        }
        json[key] = value;
    }
    console.log(json);
    if (!isValidJson(json)) {
        document.querySelector("#info").style.display = "none";
        return null;
    }
    return json;
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';



function changekeys(obj) {

    let newObj = {
        "NOMBRES": obj["Nombres"],
        "APELLIDOS": obj["Apellidos"],
        "DIRECCIÓN Y BARRIO": obj["Dirección"],
        "DEPARTAMENTO": obj["Departamento"],
        "CIUDAD": obj["Ciudad"],
        "TELÉFONO": obj["Celular"],
        "ID DE PRODUCTO": obj["Producto"],
        "CANTIDAD": obj["Cantidad"],
        "PRECIO TOTAL (SIN PUNTOS NI COMAS)": obj["Total"],
        "CON RECAUDO": "si",
        "NOTA": obj["Observaciones"],
        "EMAIL (OPCIONAL)": "",
        "ID DE VARIABLE (OPCIONAL)": "",
        "CODIGO POSTAL (OPCIONAL)": "",
        "TRANSPORTADORA (OPCIONAL)": obj["Transpo"],
        "CEDULA (OPCIONAL)": "",
        "COLONIA (OBLIGATORIO SOLO PARA QUIKEN)": ""
    }

    return newObj;
}

const changeArrObj = (data) => {
    const changedData = [];
    data.forEach(elem => {
        changedData.push(changekeys(elem));
    });
    return changedData;
};

function downloadAsExcel() {
    try {
        const data = changeArrObj(JSON.parse(localStorage.getItem("jsonOrders")));
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = {
            Sheets: {
                'data': worksheet
            },
            SheetNames: ['data']
        };
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        console.log(excelBuffer);
        saveAsExcel(excelBuffer, 'data_template');
    } catch (error) {
        alert("error al procesar el excel");
    }

}

function saveAsExcel(buffer, filename) {
    try {
        const date = new Date();
        const stringDate = date.toLocaleDateString();
        let ms = date.getMilliseconds();
        const fullDate = "-"+stringDate+"-"+ms;
        const data = new Blob([buffer], { type: EXCEL_TYPE });
        saveAs(data, filename+fullDate + EXCEL_EXTENSION);
        location.reload();
    } catch (error) {
        alert("error al guardar el excel");
    }

}


clearInfo = () => {
    hideInfo();
    setHtml(null);
}

const hideInfo = () => {
    document.querySelector("#info").style.display = "none";
}

const startprocess = () => {
    try {
        let orders = localStorage.getItem("jsonOrders") ? localStorage.getItem("jsonOrders") : [];
        let orderExist = 0;
        if (orders.length > 0) {
            orders = JSON.parse(orders);
            orders.forEach(order => {
                if (order["Celular"] === jsonData["Celular"]) {
                    orderExist += 1;
                }
            });
        }
        if (orderExist > 0) {
            alert("ya hay un numero registrado y es " + jsonData["Celular"] + "de " + jsonData["Nombres"]);
            clearInfo();
            return;
        }
        orders.push(jsonData);
        localStorage.setItem("jsonOrders", JSON.stringify(orders, null, 1));
        location.reload();
        return;
    } catch (error) {
        alert("hubo error al procesar localstorage");
    }

}


const createOrder = () => {
    startprocess();
}


const setHtml = (elem) => {
    document.querySelector("#NOMBRES").innerHTML = elem["Nombres"];
    document.querySelector("#APELLIDOS").innerHTML = elem["Apellidos"];
    document.querySelector("#DIRECCION").innerHTML = elem["Dirección"];
    document.querySelector("#TELÉFONO").innerHTML = elem["Celular"];
    document.querySelector("#PRODUCTOID").innerHTML = elem["Producto"];
    document.querySelector("#CANTIDAD").innerHTML = elem["Cantidad"];
    document.querySelector("#NOTA").innerHTML = elem["Observaciones"];
    document.querySelector("#TRANSPORTADORA").innerHTML = elem["Transpo"];
    document.querySelector("#TOTAL").innerHTML = elem["Total"];
    document.querySelector("#info").style.display = "block";
}

const show = async () => {
    navigator.clipboard.readText()
        .then(text => {
            jsonData = getJsonFromText(text);
            setHtml(jsonData);
        })
        .catch(err => {
            alert("hubo un error al mostrar los datos, revisa si copiaste bien el formato");
            console.error('Failed to read clipboard contents: ', err);
        });
}


const deleteAll = () => {
    // Mostrar mensaje de confirmación
    if (!confirm("¿Estás seguro de eliminar todo?")) {
        return;
    }

    localStorage.setItem("jsonOrders", []);
    location.reload();
}

