import { useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import bg from '../../assets/image/bg/bg-login.gif';
import logo from '../../assets/image/logocaaam.png';
import { Navigate } from "react-router-dom";

const Login = () => {

  const { SignIn, signed } = useContext(AuthContext);
  const usernameRef = useRef(null);  
  const passwordRef = useRef(null); 

  const handleSignIn = async (e) => {
    e.preventDefault();
    const data = {
      userName: usernameRef.current.value, 
      password: passwordRef.current.value,
    };
    await SignIn(data);
  };

  if (signed) {
    return <Navigate to="/admin" />;
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url("${bg}")` }}
    >
      <div className="flex flex-col md:flex-row items-center justify-center bg-black bg-opacity-70 p-10 rounded-lg shadow-lg max-w-5xl w-full">
        {/* Left Section: Welcome Message */}
        <div className="hidden h-[26.5rem] md:flex flex-col items-start justify-center w-full md:w-1/2 p-8 text-white space-y-6 relative">
          <img src={logo} alt="logo" className=" h-20 w-auto absolute top-4 left-32 bg-opacity-10" />
          <div className="p-3">
            <h1 className="text-4xl font-bold">Bem-vindo ao sistema de agendamento</h1>
            <p className="text-gray-300 mt-10">
              Gerencie os agendamentos das salas de maneira fácil e prática.
            </p>
          </div>
        </div>
        {/* Right Section: Login Form */}
        <div className="flex flex-col w-full md:w-1/2 p-8 text-white space-y-6 bg-gray-800 bg-opacity-80 rounded-lg">
          <h1 className="text-3xl text-center font-bold">Login</h1>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-300"
              >
                Nome de usuário
              </label>
              <input
                ref={usernameRef}  // Associa o useRef ao input de username
                type="text"
                id="username"
                required
                placeholder="Digite seu nome de usuário"
                className="w-full px-4 py-3 mt-1 bg-gray-700 text-white rounded focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Senha
              </label>
              <input
                ref={passwordRef}  // Associa o useRef ao input de password
                type="password"
                id="password"
                required
                placeholder="Digite sua senha"
                className="w-full px-4 py-3 mt-1 bg-gray-700 text-white rounded focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-3 font-semibold text-white bg-light-blue-700 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition duration-200"
            >
              Entrar
            </button>
            <div className="text-center mt-4">
              <p className="text-gray-400">
                Não tem uma conta?{" "}
                <a href="/register" className="text-purple-400 hover:underline">
                  Registre-se
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
