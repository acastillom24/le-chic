// UI Manager module
const UIManager = (() => {
    function displayResults(brandSummary, resultBody, downloadBtn, resetBtn) {
        // Limpiar resultados anteriores
        resultBody.innerHTML = '';

        brandSummary.forEach(item => {
            const row = resultBody.insertRow();
            const marcaCell = row.insertCell(0);
            const subtotalCell = row.insertCell(1);
            const subtotalIgvCell = row.insertCell(2);

            marcaCell.textContent = item.Marca;
            subtotalCell.textContent = item['Sub Total'].toLocaleString('es-PE', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
            });
            subtotalIgvCell.textContent = item['Subtotal + IGV'].toLocaleString('es-PE', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
            });
        });

        // Mostrar botones de descarga y reset
        downloadBtn.style.display = 'inline-block';
        resetBtn.style.display = 'inline-block';
    }

    function resetApp(resultBody, downloadBtn, resetBtn, fileInput, errorMessage) {
        resultBody.innerHTML = '';
        downloadBtn.style.display = 'none';
        resetBtn.style.display = 'none';
        fileInput.value = '';
        errorMessage.textContent = '';
    }

    function downloadResults(brandSummary) {
        const worksheet = XLSX.utils.json_to_sheet(brandSummary);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Resumen por Marca');
        
        XLSX.writeFile(workbook, 'Resumen_por_Marca.xlsx');
    }

    return {
        displayResults,
        resetApp,
        downloadResults
    };
})();