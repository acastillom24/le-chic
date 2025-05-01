// ui-manager.js

const UIManager = (() => {
    function displayResults(brandSummary, resultBody, downloadBtn, resetBtn) {
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

    function mostrarVistaPrevia(data, tablaHead, tablaBody) {
        if (!data.length) return;

        // Cabecera
        const headers = Object.keys(data[0]);
        tablaHead.innerHTML = "<tr>" + headers.map(h => `<th>${h}</th>`).join('') + "</tr>";

        // Cuerpo
        tablaBody.innerHTML = data.map(row =>
            "<tr>" + headers.map(h => `<td>${row[h]}</td>`).join('') + "</tr>"
        ).join('');
    }

    function resetApp2(tablaHead, tablaBody, facturaInput, mensaje, descargarBtn, resetBtn2) {
        tablaHead.innerHTML = '';
        tablaBody.innerHTML = '';
        facturaInput.value = '';
        mensaje.textContent = '';
        resetBtn2.style.display = 'none';
        descargarBtn.style.display = 'none';
    }

    return {
        displayResults,
        resetApp,
        resetApp2,
        downloadResults,
        mostrarVistaPrevia
    };
})();