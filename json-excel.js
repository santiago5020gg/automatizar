
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



function downloadAsExcel() {
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
}

function saveAsExcel(buffer, filename) {
    const data = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, filename + EXCEL_EXTENSION);
}

const saveJson = () => {
    try {
        localStorage.setItem("orders-json", JSON.stringify(jsonData, null, 1));
    } catch (error) {
        alert("hubo error al guardar los datos en localstorage");
    }
    
}


const createOrder = () => {
    saveJson();
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



