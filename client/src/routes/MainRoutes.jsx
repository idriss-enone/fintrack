import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../layouts/Layout';
import Dashboard from '../pages/Dashboard';
import Transactions from '../pages/Transactions';
import Categories from '../pages/Categories';
import Budgets from '../pages/Budgets';
import Recurrents from '../pages/Recurrents';
import Goals from '../pages/Goals';
import Rapport from '../pages/Rapport';

export default function MainRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="categories" element={<Categories />} />
          <Route path="budgets" element={<Budgets />} />
          <Route path="recurrents" element={<Recurrents />} />
          <Route path="goals" element={<Goals />} />
          <Route path="rapport" element={<Rapport />} />
        </Route>
      </Routes>
    
    </BrowserRouter>
  )
}
