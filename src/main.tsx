import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// v2.46 Oswald (títulos); v2.76 Archivo (texto); v2.77 itálico da Archivo nas falas. Auto-hospedadas (Fontsource, OFL-1.1)
import '@fontsource-variable/oswald';
import '@fontsource-variable/archivo';
import '@fontsource-variable/archivo/wght-italic.css';
import { App } from './App';
import { themeCss } from './ui/theme/theme';
import './ui/base.css';
import './ui/glass.css';

const theme = document.createElement('style');
theme.textContent = themeCss();
document.head.append(theme);

const container = document.getElementById('root');
if (!container) {
  throw new Error('Elemento #root não encontrado em index.html');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
