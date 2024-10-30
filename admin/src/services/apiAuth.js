import api from "./api";

export const login = async ({userName, password}) => { 
const response = await api.post("/api/v1/auth/login", {
        userName,
        password,
    });

return response;
};

export const register = async ({name, role, password}) => {
const response = await api.post("api/v1/auth/register", {
        name,
        role,
        password,
    });
    
return response
};

export const validateTokenUser = async (token) => {
  try {
    const response = await api.post(
      `/api/v1/auth/validate-token`,
      {}, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return { valid: false, message: "Token expirado ou inválido." };
    }
    return { valid: false, message: "Erro ao validar o token." };
  }
};

  
