// file-handler.js

const FileHandler = (() => {
    const IGV_RATE = 1.18;

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(dropZone) {
        dropZone.classList.add('dragover');
    }

    function unhighlight(dropZone) {
        dropZone.classList.remove('dragover');
    }

    function processFile(file, onSuccess, onError) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                // Leer desde la fila 8 (índice 7)
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { range: 7 });

                // Validación
                if (!jsonData[0].hasOwnProperty('Producto') || !jsonData[0].hasOwnProperty('Sub Total')) {
                    throw new Error("El archivo debe contener las columnas 'Producto' y 'Sub Total'.");
                }

                onSuccess(jsonData);
            } catch (error) {
                onError(error);
            }
        };
        reader.readAsArrayBuffer(file);
    }

    function setupFileListeners(dropZone, fileInput, onFileProcessed, onError) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => highlight(dropZone), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => unhighlight(dropZone), false);
        });

        dropZone.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            processFile(files[0], onFileProcessed, onError);
        }, false);

        fileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            processFile(files[0], onFileProcessed, onError);
        }, false);
    }

    async function readExcelFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: "array" });
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];

                    // En pestaña 2 se asume que los datos comienzan desde la fila 1
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);
                    resolve(jsonData);
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    function exportToModelExcel(mappedData) {
        const worksheet = XLSX.utils.json_to_sheet(mappedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Hoja1");
        XLSX.writeFile(workbook, "archivo_modelo.xlsx");
    }

    return {
        setupFileListeners,
        processFile,
        IGV_RATE,
        readExcelFile,
        exportToModelExcel
    };
})();