import { Routes, Route, NavLink } from 'react-router-dom';

import Home from './pages/Home';
import RetoDetalle from './pages/RetoDetalle';
import Scanner from './pages/Scanner';
import Album from './pages/Album';
import PanelComercio from './pages/PanelComercio';
import ValidarCodigo from './pages/ValidarCodigo';

const linkStyle = ({ isActive }: { isActive: boolean }) => ({
  color: isActive ? '#0f172a' : '#e2e8f0',
  background: isActive ? '#38bdf8' : 'transparent',
  textDecoration: 'none',
  padding: '8px 14px',
  borderRadius: '8px',
  fontWeight: isActive ? 'bold' : '500',
  fontSize: '14px',
  transition: 'all 0.2s ease',
});

function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'sans-serif' }}>
      <nav
        style={{
          background: '#0f172a',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '18px', letterSpacing: '0.5px' }}>
          📍 PasoLocal
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <NavLink to="/" end style={linkStyle}>
            🏠 Inicio
          </NavLink>
          <NavLink to="/scanner" style={linkStyle}>
            📷 Escanear QR
          </NavLink>
          <NavLink to="/album" style={linkStyle}>
            🏅 Mi Álbum
          </NavLink>
          <NavLink to="/comercio" style={linkStyle}>
            🏪 Panel Comercio
          </NavLink>
        </div>
      </nav>

      <main style={{ padding: '16px' }}>
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
  );
}

export default App;