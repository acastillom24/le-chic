// data-processor.js

const DataProcessor = (() => {
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
            if (row['Precio'] !== "Totales") {
                const producto = row['Producto'] || '';
                const marca = producto.split('-').pop().trim();

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

        return Object.entries(brandTotals)
            .map(([marca, subtotal]) => ({
                'Marca': marca,
                'Sub Total': subtotal,
                'Subtotal + IGV': subtotal * igvRate
            }))
            .sort((a, b) => b['Sub Total'] - a['Sub Total']);
    }

    function mapExampleToModel(data) {
        return data.map(row => ({
            "Código": row["CODIGO DE BARRA"] || "",
            "Nombre": row["NOMBRE"] || "",
            "Categoría": row["categoria"] || "",
            "Marca": row["MARCA"] || "",
            "Descripción": row["DESCRIPCION"] || "",
            "Stock": row["STOCK"] || 0,
            "Peso kg": "",
            "Imagen": "",
            "Precio 1": row["PRECIO"] || 0,
            "Precio 2": "",
            "Precio 3": "",
            "Precio 4": ""
        }));
    }

    return {
        summarizeByBrand,
        mapExampleToModel
    };
})();