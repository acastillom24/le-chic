// main.js

document.addEventListener('DOMContentLoaded', () => {
    // ---------- FUNCIONALIDAD PESTAÑA 1 ----------
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const resultBody = document.getElementById('resultBody');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');
    const errorMessage = document.getElementById('errorMessage');

    FileHandler.setupFileListeners(
        dropZone,
        fileInput,
        (jsonData) => {
            const brandSummary = DataProcessor.summarizeByBrand(jsonData, FileHandler.IGV_RATE);
            UIManager.displayResults(brandSummary, resultBody, downloadBtn, resetBtn);
            downloadBtn.onclick = () => UIManager.downloadResults(brandSummary);
        },
        (error) => {
            errorMessage.textContent = `Error: ${error.message}`;
            UIManager.resetApp(resultBody, downloadBtn, resetBtn, fileInput, errorMessage);
        }
    );

    resetBtn.addEventListener('click', () => {
        UIManager.resetApp(resultBody, downloadBtn, resetBtn, fileInput, errorMessage);
    });

    // ---------- FUNCIONALIDAD PESTAÑA 2 ----------
    const convertirBtn = document.getElementById("convertirBtn");
    const facturaInput = document.getElementById("facturaInput");
    const mensaje = document.getElementById("mensajeResultado");
    const descargarBtn = document.getElementById("descargarBtn");
    const tablaHead = document.getElementById("tablaPreviewHead");
    const tablaBody = document.getElementById("tablaPreviewBody");
    const resetBtn2 = document.getElementById('resetBtn2');

    let datosConvertidos = [];

    convertirBtn.addEventListener("click", async () => {
        const file = facturaInput?.files?.[0];
        if (!file) {
            mensaje.textContent = "Por favor selecciona un archivo.";
            return;
        }

        try {
            const data = await FileHandler.readExcelFile(file);
            datosConvertidos = DataProcessor.mapExampleToModel(data);

            UIManager.mostrarVistaPrevia(datosConvertidos, tablaHead, tablaBody);
            mensaje.textContent = "Conversión realizada. Puedes revisar los datos antes de descargar.";
            descargarBtn.disabled = false;
            resetBtn2.disabled = false;
        } catch (err) {
            console.error(err);
            mensaje.textContent = "Ocurrió un error al procesar el archivo.";
        }
    });

    descargarBtn.addEventListener("click", () => {
        if (datosConvertidos.length > 0) {
            FileHandler.exportToModelExcel(datosConvertidos);
            mensaje.textContent = "Archivo descargado correctamente.";
        }
    });

    resetBtn2.addEventListener('click', () => {
        UIManager.resetApp2(tablaHead, tablaBody, facturaInput, mensaje, descargarBtn, resetBtn2);
    });
});