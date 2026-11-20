import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      
      {/* Encabezado */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
          APP DE CONTRATOS
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          Sube tus documentos legales de forma segura
        </p>
      </header>

      {/* Tarjeta Principal */}
      <main className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        
        <div className="p-8">
          {/* Zona de carga (Dropzone estática) */}
          <div className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 p-12 flex flex-col items-center justify-center text-center hover:bg-slate-100 hover:border-blue-400 transition-colors cursor-pointer group">
            
            {/* Icono de Nube (SVG) */}
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2} 
                stroke="currentColor" 
                className="w-10 h-10"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-slate-700 mb-2">
              Arrastra y suelta tus archivos aquí
            </h2>
            <p className="text-slate-500 mb-6 text-sm">
              Soporta formatos PDF, DOCX y JPG (Máx. 10MB)
            </p>
            
            {/* Botón estático */}
            <button className="bg-white border border-slate-300 text-slate-700 px-6 py-2.5 rounded-lg font-medium shadow-sm hover:bg-slate-50 transition-colors">
              Examinar archivos
            </button>
          </div>

          {/* Botón de acción principal */}
          <div className="mt-8">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-[0.98]">
              Procesar Contrato
            </button>
          </div>
          
        </div>
        
        {/* Footer de la tarjeta */}
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex items-center justify-center">
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
            </svg>
            Conexión segura y cifrada de extremo a extremo
          </p>
        </div>
      </main>
    </div>
  );
}