import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import api from "../services/api";
import { AuthContext } from './../context/AuthContext';
import { PropTypes } from 'prop-types';

const Profile = ({ user }) => {
  const { SignOut } = useContext(AuthContext);
  const [name, setName] = useState(user.name || "");
  const [userName, setUserName] = useState(user.userName || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentImage, setCurrentImage] = useState(`http://localhost:5000/images/${user.iconProfile}`);
  const [loading, setLoading] = useState(false);
  const [newImage, setNewImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();


    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem!");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();

      // Adiciona a nova imagem apenas se uma nova imagem foi escolhida
      if (newImage) {
        formData.append("iconProfile", newImage);
      }
      if (name) {
        formData.append("name", name);
      }
      if (userName) {
        formData.append("userName", userName);
      }
      if (password) {
        formData.append("password", password);
      }

      const response = await api.put(`/api/v1/users/${user._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Perfil atualizado com sucesso!");
        setCurrentImage(`http://localhost:5000/images/${response.data.iconProfile}`);
        setLoading(false);
        SignOut()
      } else {
        toast.error("Erro ao atualizar perfil!");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Erro na conexão com o servidor!");
      setLoading(false);
    }
  };

  // Função para lidar com o upload de imagem
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setCurrentImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card color="transparent" shadow={false} className="p-6 w-full mx-auto">
      <Typography variant="h2" className="mr-auto font-normal text-gray-400">
        Perfil de Usuário - {user.name}
      </Typography>
      <div className="w-full flex justify-evenly items-center gap-20">
        {/* Exibição da imagem atual */}
        <div className="flex flex-col items-center">
          <img
            src={currentImage}
            alt="Profile"
            className="size-40 rounded-full object-cover mb-4"
          />
          <label htmlFor="profileImage" className="cursor-pointer text-blue-500">
            Alterar Imagem
          </label>
          <input
            type="file"
            id="profileImage"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* Formulário de atualização de perfil */}
        <form className="mt-8 mb-2 w-1/2 form" onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-col gap-6">
            <Typography className="mr-auto font-normal text-gray-400">Nome</Typography>
            <Input
              size="lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="!border-t-blue-gray-200 focus:!border-red-900 text-gray-400"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />

            <Typography className="mr-auto font-normal text-gray-400">User Name</Typography>
            <Input
              size="lg"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="!border-t-blue-gray-200 focus:!border-red-900 text-gray-400"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />

            <Typography className="mr-auto font-normal text-gray-400">Nova Senha</Typography>
            <Input
              type="password"
              size="lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="!border-t-blue-gray-200 focus:!border-red-900 text-gray-400"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />

            <Typography className="mr-auto font-normal text-gray-400">Confirmar Senha</Typography>
            <Input
              type="password"
              size="lg"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="!border-t-blue-gray-200 focus:!border-red-900 text-gray-400"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>

          <div className="flex justify-center">
            <Button color="green" type="submit">
              <Typography className="mr-auto font-normal text-inherit">
                {loading ? "Atualizando..." : "Atualizar"}
              </Typography>
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

Profile.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string,
    userName: PropTypes.string,
    iconProfile: PropTypes.string,
  }).isRequired,
};

export default Profile;
