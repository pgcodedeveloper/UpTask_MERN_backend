import express from 'express';
import { 
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    agregarColaborador,
    eliminarColaborador,
    buscarColaborador
} from './../controllers/proyectoController.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.get('/',checkAuth,obtenerProyectos);
router.post('/',checkAuth,nuevoProyecto);

//CRUD del proyecto 
router.get('/:id',checkAuth,obtenerProyecto);
router.put('/:id',checkAuth,editarProyecto);
router.delete('/:id',checkAuth,eliminarProyecto);

//Obtener las tares

//Buscar, Agregar y eliminar un colaborador
router.post('/colaboradores', checkAuth, buscarColaborador);
router.post('/colaboradores/:id',checkAuth,agregarColaborador);
router.post('/eliminar-colaborador/:id',checkAuth,eliminarColaborador);
export default router;