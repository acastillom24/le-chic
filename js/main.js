// Main application script
document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const resultBody = document.getElementById('resultBody');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');
    const errorMessage = document.getElementById('errorMessage');

    // Setup file handling
    FileHandler.setupFileListeners(
        dropZone, 
        fileInput, 
        (jsonData) => {
            // Process data
            const brandSummary = DataProcessor.summarizeByBrand(jsonData, FileHandler.IGV_RATE);
            
            // Display results
            UIManager.displayResults(brandSummary, resultBody, downloadBtn, resetBtn);
            
            // Setup download button
            downloadBtn.onclick = () => UIManager.downloadResults(brandSummary);
        },
        (error) => {
            errorMessage.textContent = `Error: ${error.message}`;
            UIManager.resetApp(resultBody, downloadBtn, resetBtn, fileInput, errorMessage);
        }
    );

    // Setup reset button
    resetBtn.addEventListener('click', () => {
        UIManager.resetApp(resultBody, downloadBtn, resetBtn, fileInput, errorMessage);
    });
});