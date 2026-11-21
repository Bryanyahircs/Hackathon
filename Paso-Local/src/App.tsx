import { lazy, Suspense } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';

import './App.css';

const Album = lazy(() => import('./pages/Album'));
const Home = lazy(() => import('./pages/Home'));
const PanelComercio = lazy(() => import('./pages/PanelComercio'));
const RetoDetalle = lazy(() => import('./pages/RetoDetalle'));
const Scanner = lazy(() => import('./pages/Scanner'));
const ValidarCodigo = lazy(() => import('./pages/ValidarCodigo'));

const enlaces = [
  { to: '/', label: 'Inicio', icono: '🏠', end: true },
  { to: '/scanner', label: 'Escanear QR', icono: '📷', end: false },
  { to: '/album', label: 'Mi Álbum', icono: '🏅', end: false },
  { to: '/comercio', label: 'Panel Comercio', icono: '🏪', end: false },
];

export default function App() {
  return (
    <div className="pl-app">
      <header className="pl-header">
        <div className="pl-header-inner">
          <NavLink to="/" className="pl-brand" aria-label="PasoLocal, ir al inicio">
            <span className="pl-brand-icon" aria-hidden="true">
              📍
            </span>
            <span className="pl-brand-text">PasoLocal</span>
          </NavLink>

          <nav className="pl-nav" aria-label="Navegación principal">
            {enlaces.map(({ to, label, icono, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `pl-nav-link${isActive ? ' is-active' : ''}`
                }
              >
                <span aria-hidden="true">{icono}</span> {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="pl-main">
        <Suspense
          fallback={
            <div className="pl-cargando" role="status">
              <span className="pl-cargando-spin" aria-hidden="true">
                🎡
              </span>
              <p>Cargando diversión…</p>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reto/:id" element={<RetoDetalle />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/album" element={<Album />} />
            <Route path="/comercio" element={<PanelComercio />} />
            <Route path="/comercio/validar" element={<ValidarCodigo />} />
            <Route path="*" element={<PaginaNoEncontrada />} />
          </Routes>
        </Suspense>
      </main>

      <footer className="pl-footer">
        <strong>✨ PasoLocal · Cancún, Quintana Roo</strong>
        <p>
          Comercios locales, retos culturales y sellos que cuentan historias.
          Hecho con 💖 para la comunidad.
        </p>
      </footer>
    </div>
  );
}

function PaginaNoEncontrada() {
  return (
    <div className="pl-page pl-vacio">
      <div style={{ fontSize: 72 }} aria-hidden="true">
        🛸
      </div>
      <h2>¡Vaya! Página perdida</h2>
      <p style={{ color: 'var(--muted)', fontWeight: 700 }}>
        Esta ruta no existe en el mapa.
      </p>
      <NavLink to="/" className="pl-btn pl-btn--sky">
        🏠 Volver al inicio
      </NavLink>
    </div>
  );
}
