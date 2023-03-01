import Tarea from "../models/Tarea.js";
import Proyecto from "../models/Proyecto.js";

const agregarTarea = async (req,res) =>{
    const { proyecto } = req.body;
    const existeProy = await Proyecto.findById(proyecto);

    if(!existeProy){
        const error = new Error("Proyecto no encontrado");
        return res.status(404).json({msg: error.message});
    }
    if(existeProy.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Acción no válida');
        return res.status(401).json({msg: error.message});
    }

    try {
        const tareaAlmacenada = await Tarea.create(req.body);

        existeProy.tareas.push(tareaAlmacenada._id);
        await existeProy.save();
        res.json(tareaAlmacenada);
    } catch (error) {
        console.log(error);
    }
};

const obtenerTarea = async (req,res) =>{
    const {id} = req.params;
    const tarea = await Tarea.findById(id).populate("proyecto");

    if(!tarea){
        const error = new Error("Tarea no encontrada");
        return res.status(404).json({msg: error.message});
    }

    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Acción no válida');
        return res.status(403).json({msg: error.message});
    }
    
    res.json(tarea);
};

const actualizarTarea = async (req,res) =>{
    const {id} = req.params;
    const tarea = await Tarea.findById(id).populate("proyecto");

    if(!tarea){
        const error = new Error("Tarea no encontrada");
        return res.status(404).json({msg: error.message});
    }

    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Acción no válida');
        return res.status(403).json({msg: error.message});
    }

    tarea.nombre = req.body.nombre || tarea.nombre;
    tarea.descripcion = req.body.descripcion || tarea.descripcion;
    tarea.prioridad = req.body.prioridad || tarea.prioridad;
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;

    try {
        const tareaAlmacenada = await tarea.save();
        res.json(tareaAlmacenada);
    } catch (error) {
        console.log(error);
    }
};

const eliminarTarea = async (req,res) =>{
    const {id} = req.params;
    const tarea = await Tarea.findById(id).populate("proyecto");

    if(!tarea){
        const error = new Error("Tarea no encontrada");
        return res.status(404).json({msg: error.message});
    }

    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Acción no válida');
        return res.status(403).json({msg: error.message});
    }

    try {
        const proyecto = await Proyecto.findById(tarea.proyecto);
        proyecto.tareas.pull(tarea._id);

        await Promise.allSettled([ await proyecto.save(), await tarea.deleteOne()]);

        res.json({msg: "Tarea eliminada correctamente"});
    } catch (error) {
        console.log(error);
    }
};

const cambiarEstado = async (req,res) =>{
    const {id} = req.params;
    const tarea = await Tarea.findById(id).populate("proyecto");

    if(!tarea){
        const error = new Error("Tarea no encontrada");
        return res.status(404).json({msg: error.message});
    }

    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString() && !tarea.proyecto.colaboradores.some(colab => colab._id.toString() === req.usuario._id.toString())){
        const error = new Error('Acción no válida');
        return res.status(403).json({msg: error.message});
    }

    try {
        tarea.estado = !tarea.estado;
        tarea.completado = req.usuario._id;
        await tarea.save();

        const tareaAlmacenada = await Tarea.findById(id).populate("proyecto").populate("completado");
        res.json(tareaAlmacenada);
    } catch (error) {
        console.log(error);
    }
};

export {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado
}