// Data processor module
const DataProcessor = (() => {
    // Brand categorization
    const BRAND_CATEGORIES = {
        "AVON - NATURA": ["AVON", "NATURA"],
        "CY'ZONE - ESIKA - L'BEL": ["ESIKA", "CY'ZONE", "L'BEL"]
    };

    function categorizeBrand(marca) {
        for (const [category, brands] of Object.entries(BRAND_CATEGORIES)) {
            if (brands.some(brand => marca.toUpperCase().includes(brand))) {
                return category;
            }
        }
        return marca;
    }

    function summarizeByBrand(data, igvRate) {
        const brandTotals = {};

        data.forEach(row => {
            // Filtrar filas que no sean "Totales"
            if (row['Precio'] !== "Totales") {
                // Extraer marca de la columna 'Producto'
                const producto = row['Producto'] || '';
                const marca = producto.split('-').pop().trim();
                
                // Convertir Sub Total a número, reemplazando ',' por '.'
                const subtotal = parseFloat(
                    (row['Sub Total'] || '0')
                        .toString()
                        .replace(',', '.')
                );

                if (marca) {
                    const categorizedMarca = categorizeBrand(marca);
                    brandTotals[categorizedMarca] = (brandTotals[categorizedMarca] || 0) + subtotal;
                }
            }
        });

        // Convertir a array para facilitar despliegue
        return Object.entries(brandTotals)
            .map(([marca, subtotal]) => ({ 
                'Marca': marca, 
                'Sub Total': subtotal,
                'Subtotal + IGV': subtotal * igvRate 
            }))
            .sort((a, b) => b['Sub Total'] - a['Sub Total']);
    }

    return {
        summarizeByBrand
    };
})();