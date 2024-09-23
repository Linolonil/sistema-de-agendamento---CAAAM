import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";

const Profile = ({user}) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Puxar as informações do usuário do localStorage (ou de uma API)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("@Auth:user"));
    if (storedUser) {
      setName(storedUser.name);
    }
  }, []);

  // Função para enviar o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem!");
      return;
    }

    // Dados para enviar
    const updatedUser = {
      name,
      password,
    };

    try {
      // Exemplo de requisição para o backend usando axios (substituir pela sua rota)
      const response = await axios.put("/api/v1/user/update-profile", updatedUser);

      if (response.status === 200) {
        localStorage.setItem("@Auth:user", JSON.stringify(response.data));
        toast.success("Perfil atualizado com sucesso!");
      } else {
        toast.error("Erro ao atualizar perfil!");
      }
    } catch (error) {
        console.log(error)
      toast.error("Erro na conexão com o servidor!");
    }
  };

  return (
    <Card color="transparent" shadow={false} className="p-6 max-w-lg mx-auto ">
      <Typography variant="h2" className="mr-auto font-normal text-gray-400">
        Perfil de Usuário - {user.name}
      </Typography>
      <Typography color="gray" className="mt-1 font-normal">
      </Typography>
      <form className="mt-8 mb-2 w-full" onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-col gap-6">
          <Typography className="mr-auto font-normal text-gray-400">
            Nome de Usuário
          </Typography>
          <Input
            size="lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome de usuário"
            className=" !border-t-blue-gray-200 focus:!border-red-900 text-gray-400"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
       
          <Typography className="mr-auto font-normal text-gray-400">
            Nova Senha
          </Typography>
          <Input
            type="password"
            size="lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            className=" !border-t-blue-gray-200 focus:!border-red-900 text-gray-400"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
          <Typography className="mr-auto font-normal text-gray-400">
            Confirmar Senha
          </Typography>
          <Input
            type="password"
            size="lg"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="********"
            className=" !border-t-blue-gray-200 focus:!border-red-900 text-gray-400"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
        </div>
       
       <div className="flex justify-center">
        <Button color="green">
            <Typography className="mr-auto font-normal text-inherit">
                Atualizar Perfil
            </Typography>
        </Button>
       </div>
      
      </form>
    </Card>
  );
};

export default Profile;
