import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import LoginPage from "@/pages/LoginPage.jsx";
import RegisterPage from "@/pages/RegisterPage";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicOnlyRoute from "@/routes/PublicOnlyRoute";
import DashboardPage from "@/pages/DashboardPage";
import TransactionPage from "@/pages/TransactionPage";
import CategoryPage from "./pages/CategoryPage";
import BudgetPage from "@/pages/BudgetPage";
import GoalPage from "@/pages/GoalPage";
import RecurrentPage from "@/pages/RecurrentPage";

function App() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionPage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/budgets" element={<BudgetPage />} />
          <Route path="/goals" element={<GoalPage />} />
          <Route path="/recurrents" element={<RecurrentPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
