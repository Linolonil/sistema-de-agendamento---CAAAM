import AppRouter from "./router";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <>
      <AppRouter />
      <ToastContainer
        position="top-left" 
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false} // Desativa pausa ao passar o mouse
      />    </>
  );
}

export default App;
