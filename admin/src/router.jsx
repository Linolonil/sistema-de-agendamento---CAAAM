import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from './context/AuthContext'; // Importando AuthProvider corretamente

import PrivateRoutes from "./routes/PrivateRoutes";
import Login from './pages/auth/Login';
import Admin from './pages/admin/Admin';
import { ScheduleProvider } from "./context/SchedulesContext";

function AppRouter() {
  return (
    <Router>
      <AuthProvider>
        <ScheduleProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<PrivateRoutes />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
        </ScheduleProvider>
      </AuthProvider>
    </Router>
  );
}

export default AppRouter;
