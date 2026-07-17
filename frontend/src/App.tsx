import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Modules from './pages/Modules';
import Cells from './pages/Cells';
import Marketplace from './pages/Marketplace';
import Settings from './pages/Settings';

export default function App() {
  return (
    <div className="app">
      <nav className="sidebar">
        <h1>🧬 NovaCore</h1>
        <ul>
          <li><Link to="/">Accueil</Link></li>
          <li><Link to="/modules">Modules</Link></li>
          <li><Link to="/cells">Cellules</Link></li>
          <li><Link to="/marketplace">Marketplace</Link></li>
          <li><Link to="/settings">Paramètres</Link></li>
        </ul>
      </nav>
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/modules" element={<Modules />} />
          <Route path="/cells" element={<Cells />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}
