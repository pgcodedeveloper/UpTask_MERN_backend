import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";
import Usuario from "../models/Usuario.js";

const obtenerProyectos = async (req,res) =>{
    try {
        const proyectos = await Proyecto.find({
            '$or' : [
                {colaboradores : {$in: req.usuario}},
                {creador : {$in: req.usuario}},
            ],
        });

        res.json(proyectos);
    } catch (error) {
        console.log(error);
    }
}

const nuevoProyecto = async (req,res) =>{
    const proyecto = new Proyecto(req.body);
    proyecto.creador = req.usuario._id;
    try {
        const proyectoAlmacenado = await proyecto.save();
        res.json(proyectoAlmacenado);
    } catch (error) {
        console.log(error);
    }
}

const obtenerProyecto = async (req,res) =>{
    const { id } = req.params;
    try {
        const proyecto = await Proyecto.findById(id).populate({path: "tareas", populate: {path: "completado", select: "nombre"}}).populate('colaboradores',"nombre email");
        if(!proyecto){
            const error = new Error('No encontrado');
           return res.status(404).json({msg: error.message});
        }

        if(proyecto.creador.toString() !== req.usuario._id.toString() && !proyecto.colaboradores.some(colab => colab._id.toString() === req.usuario._id.toString())){
            const error = new Error('Acción no válida');
            return res.status(401).json({msg: error.message});
        }
        res.json(proyecto);
    } catch (error) {
        console.log(error);
    }
}

const editarProyecto = async (req,res) =>{
    const { id } = req.params;
    try {
        const proyecto = await Proyecto.findById(id);
        if(!proyecto){
            const error = new Error('No encontrado');
            return res.status(404).json({msg: error.message});
        }

        if(proyecto.creador.toString() !== req.usuario._id.toString()){
            const error = new Error('Acción no válida');
            return res.status(401).json({msg: error.message});
        }
        
        proyecto.nombre = req.body.nombre || proyecto.nombre;
        proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
        proyecto.cliente = req.body.cliente || proyecto.cliente;
        proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;

        const proyectoAlmacenado = await proyecto.save();
        res.json(proyectoAlmacenado);
    } catch (error) {
        console.log(error);
    }
}

const eliminarProyecto = async (req,res) =>{
    const { id } = req.params;
    try {
        const proyecto = await Proyecto.findById(id);

        if(!proyecto){
            const error = new Error('No encontrado');
            return res.status(404).json({msg: error.message});
        }

        if(proyecto.creador.toString() !== req.usuario._id.toString()){
            const error = new Error('Acción no válida');
            return res.status(401).json({msg: error.message});
        }
        
        await Tarea.deleteMany().where("proyecto").equals(id);
        await proyecto.deleteOne();
        res.json({msg: "Proyecto eliminado correctamente"});
        
    } catch (error) {
        console.log(error);
    }
}

const buscarColaborador = async (req, res) => {
    const { email } = req.body;

    const usuario = await Usuario.findOne({email}).select('-password -confirmado -token -createdAt -updatedAt -__v');

    if(!usuario) {
        const error = new Error('Usuario no encontrado');
        return res.status(404).json({msg: error.message});
    }

    res.json(usuario);
}

const agregarColaborador = async (req,res) =>{
    const proyecto = await Proyecto.findById(req.params.id);
    if(!proyecto){
        const error = new Error("Proyecto No Encontrado");
        return res.status(404).json({msg: error.message});
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Acción no válida");
        return res.status(402).json({msg: error.message});
    }

    const { email } = req.body;

    const usuario = await Usuario.findOne({email}).select('-password -confirmado -token -createdAt -updatedAt -__v');

    if(!usuario) {
        const error = new Error('Usuario no encontrado');
        return res.status(404).json({msg: error.message});
    }

    if(proyecto.creador.toString() === usuario._id.toString()){
        const error = new Error("El creador del proyecto no puede ser Colaborador");
        return res.status(402).json({msg: error.message});
    }

    if(proyecto.colaboradores.includes(usuario._id)){
        const error = new Error("El usuario ya es colaborador del proyecto");
        return res.status(402).json({msg: error.message});
    }

    try {
        proyecto.colaboradores.push(usuario._id);
        await proyecto.save();
        res.json({msg: "Colaborador Agregado correctamente"});
    } catch (error) {
        console.log(error);
    }
}

const eliminarColaborador = async (req,res) =>{
    const proyecto = await Proyecto.findById(req.params.id);
    if(!proyecto){
        const error = new Error("Proyecto No Encontrado");
        return res.status(404).json({msg: error.message});
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Acción no válida");
        return res.status(402).json({msg: error.message});
    }

    try {
        proyecto.colaboradores.pull(req.body.id);
        await proyecto.save();
        res.json({msg: "Colaborador Eliminado Correctamente"});
    } catch (error) {
        console.log(error);
    }
}


export {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    agregarColaborador,
    eliminarColaborador,
    buscarColaborador
};