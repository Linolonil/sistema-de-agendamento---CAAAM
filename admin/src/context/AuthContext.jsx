import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate para redirecionar
import { PropTypes } from 'prop-types';
import api from './../../services/api';
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Hook para navegação

  useEffect(() => {
    const loadingStoreData = async () => {
      const storedUser = localStorage.getItem("@Auth:user");
      const token = localStorage.getItem("@Auth:token");

      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        navigate("/admin"); // Corrigido para redirecionar sem JSX
      }
    };

    loadingStoreData();
  }, [navigate]);

  const SignIn = async ({ name, password }) => {
    try {
      const response = await api.post("/api/v1/auth/login", {
        name,
        password,
      });
      if (response.data.token) {
        localStorage.setItem("@Auth:user", JSON.stringify(response.data.user));
        localStorage.setItem("@Auth:token", response.data.token);
        setUser(response.data.user);
        const userName = response.data.user.name;
        
        toast.success(`Bem-vindo, ${userName}!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        
        navigate("/admin"); // Navegação após login com sucesso
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Erro ao realizar login", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const SignOut = () => {
    localStorage.removeItem("@Auth:user");
    localStorage.removeItem("@Auth:token");
    setUser(null);
    toast.success("Logout realizado com sucesso!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    navigate("/login");
  };

  const CreateUser = async ({ name, role, password }) => {
    try {
      const response = await api.post("api/v1/auth/register", {
        name,
        role,
        password,
      });
      toast.success("Usuário criado com sucesso!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return response.data;
    } catch (error) {
      console.error("Erro na criação do usuário", error);
      toast.error(error.response?.data?.message || "Erro ao criar usuário", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return error.response.data;
    }
  };

  const value = {
    user,
    signed: !!user,
    SignIn,
    SignOut,
    CreateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
