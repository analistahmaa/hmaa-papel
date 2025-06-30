import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';

function RoutesComponent() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/listagem" element={<Listagem />} />
        <Route path="/relatorios" element={<Relatorios />} />
      </Routes>
    </Router>
  );
}

export default RoutesComponent;