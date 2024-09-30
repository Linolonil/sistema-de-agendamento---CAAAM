import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import iconDefault from '../../src/assets/default.webp'; 
import api from "../../services/api";

const Profile = ({ user }) => {
  // Usar useRef para evitar re-renderizações desnecessárias
  const nameRef = useRef("");
  const passwordRef = useRef("");
  const userNameRef = useRef("");
  const confirmPasswordRef = useRef("");

  // Estado para armazenar a imagem atual e a nova imagem
  const [currentImage, setCurrentImage] = useState(user.profileImage || iconDefault); 
  const [newImage, setNewImage] = useState(null);

  // Puxar as informações do usuário do localStorage (ou de uma API)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("@Auth:user"));
    if (storedUser) {
      nameRef.current.value = storedUser.name;
    }
  }, []);

  // Função para enviar o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const name = nameRef.current.value;
    const password = passwordRef.current.value;
    const userName = userNameRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
  
    if (password !== confirmPassword) {
      toast.dismiss();
      toast.error("As senhas não coincidem!");
      return;
    }
  
    try {
      let updatedUser = {
        name,
        userName,
        password,
      };
  
      if (newImage) {
        const formData = new FormData();
        formData.append("iconProfile", newImage); // Adiciona a imagem ao FormData
  
        const imageUploadResponse = await api.put(`/api/v1/image/update-profile-image/${user._id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
  
        if (imageUploadResponse.status === 200) {
          updatedUser.iconProfile = imageUploadResponse.data.iconProfile;
        }
      }
  
      // Atualiza os demais dados do usuário
      const response = await api.put(`/api/v1/user/update-profile/${user.id}`, updatedUser);
  
      if (response.status === 200) {
        localStorage.setItem("@Auth:user", JSON.stringify(response.data));
        toast.dismiss();
        toast.success("Perfil atualizado com sucesso!");
        setCurrentImage(response.data.iconProfile); // Atualiza a imagem atual
      } else {
        toast.dismiss();
        toast.error("Erro ao atualizar perfil!");
      }
    } catch (error) {
      console.log(error);
      toast.dismiss();
      toast.error("Erro na conexão com o servidor!");
    }
  };
  

  // Função para lidar com o upload de imagem
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);

    // Exibir a nova imagem selecionada
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
      <div className="w-full flex justify-evenly  items-center gap-20 ">
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
        <form className="mt-8 mb-2 w-1/2" onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-col gap-6">
            <Typography className="mr-auto font-normal text-gray-400">
              Nome
            </Typography>
            <Input
              size="lg"
              ref={nameRef}
              placeholder={user.name}
              className="!border-t-blue-gray-200 focus:!border-red-900 text-gray-400"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />

            <Typography className="mr-auto font-normal text-gray-400">
              User Name
            </Typography>
            <Input
              size="lg"
              ref={userNameRef}
              placeholder={user.userName}
              className="!border-t-blue-gray-200 focus:!border-red-900 text-gray-400"
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
              ref={passwordRef}
              placeholder="********"
              className="!border-t-blue-gray-200 focus:!border-red-900 text-gray-400"
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
              ref={confirmPasswordRef}
              placeholder="********"
              className="!border-t-blue-gray-200 focus:!border-red-900 text-gray-400"
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
      </div>
    </Card>
  );
};

export default Profile;
