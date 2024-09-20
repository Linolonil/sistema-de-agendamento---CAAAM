import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from './context/AuthContext'; // Importando AuthProvider corretamente

import PrivateRoutes from "./routes/PrivateRoutes";
import Login from './pages/auth/Login';
import Admin from './pages/admin/Admin';

function AppRouter() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<PrivateRoutes />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default AppRouter;
