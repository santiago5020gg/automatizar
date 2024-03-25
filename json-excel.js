
let jsonData = null;

const getJsonFromText = (text) => {
    const regex = /\*([^\n:]+):\s*([^*\n]+)/g;
    let match;
    const json = {};
    while ((match = regex.exec(text)) !== null) {
        const key = match[1].trim();
        const value = match[2].trim();
        json[key] = value;
    }
    console.log(json);
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
    const data = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, filename + EXCEL_EXTENSION);
}

const saveJson = () => {
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
        if (orderExist === 0) {
            orders.push(jsonData);
            localStorage.setItem("jsonOrders", JSON.stringify(orders, null, 1));
            return;
        }
        orders = [jsonData];
        localStorage.setItem("jsonOrders", JSON.stringify(orders, null, 1));
    } catch (error) {
        alert("hubo error al procesar localstorage");
    }

}


const createOrder = () => {
    saveJson();
    downloadAsExcel();
}


const show = async () => {
    navigator.clipboard.readText()
        .then(text => {
            jsonData = getJsonFromText(text);
            document.querySelector("#NOMBRES").innerHTML = jsonData["Nombres"];
            document.querySelector("#APELLIDOS").innerHTML = jsonData["Apellidos"];
            document.querySelector("#DIRECCION").innerHTML = jsonData["Dirección"];
            document.querySelector("#TELÉFONO").innerHTML = jsonData["Celular"];
            document.querySelector("#PRODUCTOID").innerHTML = jsonData["Producto"];
            document.querySelector("#CANTIDAD").innerHTML = jsonData["Cantidad"];
            document.querySelector("#NOTA").innerHTML = jsonData["Observaciones"];
            document.querySelector("#TRANSPORTADORA").innerHTML = jsonData["Transpo"];
            document.querySelector("#TOTAL").innerHTML = jsonData["Total"];
            document.querySelector("#info").style.display = "block";
        })
        .catch(err => {
            alert("hubo un error al mostrar los datos, revisa que no borraste nada");
            console.error('Failed to read clipboard contents: ', err);
        });
}



