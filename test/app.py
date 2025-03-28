# %% Carga de bibliotecas
import pandas as pd

# %% Ruta del archivo Excel
archivo = "Reporte_POS_PRODUCTOS - LE CHIC IMPORT S.A.C - 2025-03-24 08_36_31.xlsx"

# %% Leer el Excel, considerando que los encabezados están en la fila 8 (header=7)
df = pd.read_excel(archivo, header=7)

# %% Asegurarse de que el campo 'producto' y 'subtotal' existan en el DataFrame
if 'Producto' not in df.columns or 'Sub Total' not in df.columns:
    raise ValueError("El archivo debe contener las columnas 'producto' y 'subtotal'.")

# %% Extraer la marca de producto. Se asume que la marca es la parte final del campo 'producto'
df['Marca'] = df['Producto'].astype(str).str.split('-').str[-1].str.strip()

# %% Filtrar la fila del campo 'Precio' que contenga "Totales"
df = df[~(df['Precio'] == "Totales")].reset_index()

# %% Convertir el campo Sub Total a formato numérico para poder sumar
df['Sub Total'] = df['Sub Total'].str.replace(',', '.')
df['Sub Total'] = df['Sub Total'].astype(float)

# %% Generar resumen del subtotal por marca
resumen = df.groupby('Marca', as_index=False)['Sub Total'].sum()

# Mostrar el resumen
print(resumen)

# Opcional: guardar el resumen en un nuevo archivo Excel
resumen.to_excel("Resumen_por_marca.xlsx", index=False)

# %%
