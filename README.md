# Hackathon
{
  "tipo_auditoria": "Auditoría financiera o contable estándar",
  "categorias": [
    {
      "id": "documentacion_legal_corporativa",
      "nombre": "Documentación Legal y Corporativa",
      "origen": "Empresa auditada",
      "proposito": "Verificar la constitución, estructura y obligaciones legales de la empresa.",
      "documentos": [
        {
          "nombre": "Acta constitutiva y estatutos",
          "descripcion": "Acta constitutiva y modificaciones a los estatutos sociales."
        },
        {
          "nombre": "Libros societarios",
          "descripcion": "Actas de asamblea de accionistas y del consejo de administración."
        },
        {
          "nombre": "Poderes notariales",
          "descripcion": "Poderes otorgados a representantes legales o apoderados."
        },
        {
          "nombre": "Contratos vigentes",
          "descripcion": "Contratos con clientes principales, proveedores, arrendamientos, préstamos bancarios, seguros y contratos colectivos o individuales de trabajo."
        },
        {
          "nombre": "Licencias y permisos",
          "descripcion": "Licencias y permisos de funcionamiento según el giro del negocio."
        }
      ]
    },
    {
      "id": "informacion_contable_financiera",
      "nombre": "Información Contable y Financiera",
      "origen": "Empresa auditada",
      "proposito": "Validar que las cifras reflejen la realidad económica de la entidad.",
      "documentos": [
        {
          "nombre": "Estados financieros básicos",
          "descripcion": "Balance General, Estado de Resultados, Estado de Flujos de Efectivo y Estado de Cambios en el Capital Contable del periodo a auditar, con sus notas."
        },
        {
          "nombre": "Balanza de comprobación",
          "descripcion": "Balanza a nivel de subcuenta (inicial, mensual y de cierre)."
        },
        {
          "nombre": "Libros contables y auxiliares",
          "descripcion": "Libro Diario y Libro Mayor, además de los auxiliares de cada cuenta (clientes, proveedores, inventarios, activos fijos)."
        },
        {
          "nombre": "Manual de políticas contables y catálogo de cuentas",
          "descripcion": "Lineamientos contables y estructura de cuentas utilizada por la empresa."
        }
      ]
    },
    {
      "id": "documentacion_bancaria_tesoreria",
      "nombre": "Documentación Bancaria y de Tesorería",
      "origen": "Empresa auditada",
      "proposito": "Comprobar la existencia y disponibilidad del efectivo y el manejo de deuda.",
      "documentos": [
        {
          "nombre": "Estados de cuenta bancarios",
          "descripcion": "Estados de cuenta de todos los meses del ejercicio, incluyendo cuentas de inversión o crédito."
        },
        {
          "nombre": "Conciliaciones bancarias",
          "descripcion": "Conciliaciones mensuales con el soporte de las partidas en conciliación."
        },
        {
          "nombre": "Arqueos de caja chica",
          "descripcion": "Arqueos de efectivo y vales o comprobantes de gastos menores."
        },
        {
          "nombre": "Tablas de amortización",
          "descripcion": "Tablas de amortización de créditos, pagarés y líneas de financiamiento."
        }
      ]
    },
    {
      "id": "soporte_operativo_fiscal",
      "nombre": "Soporte Operativo y Fiscal",
      "origen": "Empresa auditada",
      "proposito": "Respaldar las transacciones diarias y el cumplimiento ante la autoridad tributaria.",
      "documentos": [
        {
          "nombre": "Facturación",
          "descripcion": "Comprobantes fiscales (CFDI en México) emitidos y recibidos, junto con notas de crédito y complementos de pago."
        },
        {
          "nombre": "Inventarios",
          "descripcion": "Reportes de conteos físicos al cierre del periodo, valuación de inventarios y registros de mermas o artículos obsoletos."
        },
        {
          "nombre": "Activos fijos",
          "descripcion": "Cédula de activos con fechas de adquisición, facturas de compra, tasas de depreciación y resguardos."
        },
        {
          "nombre": "Nómina",
          "descripcion": "Listas de raya, recibos timbrados, cálculo de finiquitos y comprobantes de pago de seguridad social (IMSS, Infonavit, impuestos estatales)."
        },
        {
          "nombre": "Declaraciones fiscales",
          "descripcion": "Pagos provisionales mensuales, declaración anual, declaraciones informativas y acuses de recibo o devoluciones."
        }
      ]
    },
    {
      "id": "papeles_de_trabajo_auditor",
      "nombre": "Documentos propios del Auditor (Papeles de Trabajo)",
      "origen": "Auditor",
      "proposito": "Respaldar la planeación, ejecución y opinión emitida por el auditor.",
      "documentos": [
        {
          "nombre": "Carta de encargo o contrato de auditoría",
          "descripcion": "Define el alcance, responsabilidades y honorarios."
        },
        {
          "nombre": "Plan global y programa de auditoría",
          "descripcion": "Detalla los procedimientos, tiempos y riesgos identificados."
        },
        {
          "nombre": "Cédulas sumarias y analíticas",
          "descripcion": "Hojas de trabajo con cruces de información, recálculos y pruebas selectivas."
        },
        {
          "nombre": "Confirmaciones de terceros",
          "descripcion": "Cartas enviadas directamente a bancos, clientes, proveedores y abogados externos para validar saldos o litigios."
        },
        {
          "nombre": "Carta de manifestaciones de la administración",
          "descripcion": "Documento firmado por la dirección asegurando que entregó toda la información veraz y completa."
        }
      ]
    }
  ]
}

















####
Paso-Local/
├─ node_modules/
├─ public/
│  ├─ favicon.svg
│  ├─ icons.svg
│  └─ qr/                 <-- (Aquí guardaremos los QR de prueba)
├─ src/
│  ├─ app/                <-- (Configuración de rutas, contexto global)
│  ├─ assets/             <-- (Imágenes locales)
│  ├─ components/         <-- (Botones, tarjetas de comercios, etc.)
│  ├─ data/               <-- (Aquí irá comercios.demo.json)
│  ├─ lib/                <-- (Lógica pura: hash.ts, storage.ts, qr.ts, geo.ts)
│  ├─ pages/              <-- (Las 6 pantallas del MVP)
│  │  ├─ Home.tsx
│  │  ├─ RetoDetalle.tsx
│  │  ├─ Scanner.tsx
│  │  ├─ Album.tsx
│  │  ├─ PanelComercio.tsx
│  │  └─ ValidarCodigo.tsx
│  ├─ App.tsx             <-- (Renombró  a App.tsx)
│  ├─ index.css
│  └─ main.tsx            <-- (Renombró a main.tsx)
├─ .gitignore
├─ index.html
├─ package.json
├─ tsconfig.json          
└─ vite.config.js


cosas a instalar 

 instala TypeScript y los tipos para React:
npm install -D typescript @types/react @types/react-dom

Segundo, instala las librerías que usaremos para el MVP (enrutamiento, QR, mapas y utilidades):

npm install react-router-dom html5-qrcode qrcode leaflet react-leaflet
npm install -D @types/qrcode @types/leaflet
