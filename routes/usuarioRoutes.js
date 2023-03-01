import express from "express";
const router = express.Router();
import { registrar, autenticar, confirmar, olvide,comprobarToken,nuevoPassword,perfil } from "../controllers/usuarioController.js";
import checkAuth from "../middleware/checkAuth.js";


//Auth, Registro y Confirmación de Usuarios
router.post('/',registrar); //Registro de un nuevo usuario
router.post('/login',autenticar); // Login del usuario
router.get('/confirmar/:token',confirmar); //Confirmar la cuenta
router.post('/olvide-password',olvide); //Resetear el password de usuario
router.get('/olvide-password/:token',comprobarToken); //Comprobar el token de usuario
router.post('/olvide-password/:token',nuevoPassword); //Cambiar el password de usuario

//Area privada
router.get('/perfil', checkAuth, perfil);
export default router;