import { Routes, Route, Link } from 'react-router-dom'

// Importaremos las páginas después de crearlas
import Home from './pages/Home'
import RetoDetalle from './pages/RetoDetalle'
import Scanner from './pages/Scanner'
import Album from './pages/Album'
import PanelComercio from './pages/PanelComercio'
import ValidarCodigo from './pages/ValidarCodigo'

function App() {
  return (
    <div className="app-container">
      {/* Navbar temporal para probar la navegación */}
      <nav style={{ padding: '1rem', display: 'flex', gap: '1rem', background: '#eee' }}>
        <Link to="/">Inicio</Link>
        <Link to="/album">Mi Álbum</Link>
        <Link to="/comercio">Panel Comercio</Link>
      </nav>

      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reto/:id" element={<RetoDetalle />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/album" element={<Album />} />
          <Route path="/comercio" element={<PanelComercio />} />
          <Route path="/comercio/validar" element={<ValidarCodigo />} />
        </Routes>
      </main>
    </div>
  )
}

export default App