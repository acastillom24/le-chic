// File handler module
const FileHandler = (() => {
    const IGV_RATE = 1.18; // 18% IGV in Peru

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
                const workbook = XLSX.read(data, {type: 'array'});
                const firstSheetName = workbook.SheetNames[0];
                
                // Asumimos que los headers están en la fila 8 (índice 7)
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { range: 7 });

                // Validar columnas
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
        // Prevenir comportamiento por defecto de arrastrar
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
            const dt = e.dataTransfer;
            const files = dt.files;
            processFile(files[0], onFileProcessed, onError);
        }, false);

        fileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            processFile(files[0], onFileProcessed, onError);
        }, false);
    }

    return {
        setupFileListeners,
        processFile,
        IGV_RATE
    };
})();