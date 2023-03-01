import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailOlvide, emailRegistro } from "../helpers/email.js";

const registrar = async (req,res) =>{

    //Evitar registro duplicados
    const { email } = req.body;
    const existeUsuario = await Usuario.findOne({ email });
    
    if(existeUsuario){
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({msg: error.message});
    }

    try {
        const usuario = new Usuario(req.body);
        usuario.token = generarId();
        await usuario.save();

        //Enviar el email de confirmacion 
        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        });
        
        res.json({msg: 'Usuario Creado correctamente, Revista tu Email y confirma tu cuenta'});
    } catch (error) {
        console.log(error);
    }
    
}

const autenticar = async (req,res) => {
    const {email , password} = req.body;
    //Evaluar que el usuario existe
    const usuario = await Usuario.findOne({email});

    if(!usuario){
        const error = new Error("El Usuario no existe");
        return res.status(404).json({msg: error.message});
    }
    //Evaluar que este confirmado
    if(!usuario.confirmado){
        const error = new Error("Tu Cuenta no ha sido confirmada");
        return res.status(403).json({msg: error.message});
    }
    //Evaluar el password
    if(await usuario.comprobarPassword(password)){
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        });
    }
    else{
        const error = new Error("El Password es incorrecto");
        return res.status(403).json({msg: error.message});
    }
}

const confirmar = async (req,res) =>{
    const {token} = req.params;
    const usuarioConfirm = await Usuario.findOne({token});

    if(!usuarioConfirm){
        const error = new Error("El token no es válido");
        return res.status(403).json({msg: error.message});
    }

    try {
        usuarioConfirm.confirmado = true;
        usuarioConfirm.token = '';
        await usuarioConfirm.save();
        res.json({msg: 'Usuario Confirmado correctamente'});
    } catch (error) {
        console.log(error);
    }
}

const olvide = async (req,res) => {
    const { email } = req.body;
    const usuario = await Usuario.findOne({email});

    if(!usuario){
        const error = new Error("El Usuario no existe");
        return res.status(404).json({msg: error.message});
    }

    try {
        usuario.token = generarId();
        await usuario.save();
        
        //Enviar el email de confirmacion 
        emailOlvide({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        });
        res.json({msg: 'Hemos enviado un email con las instrucciones'});
    } catch (error) {
        console.log(error);
    }
}

const comprobarToken = async (req, res) =>{
    const { token } = req.params;
    const usuarioToken = await Usuario.findOne({token});

    if(!usuarioToken){
        const error = new Error("El token no es válido");
        return res.status(403).json({msg: error.message});
    }
    else{
        res.json({msg: 'Token válido y Usuario existe'});
    }
}

const nuevoPassword = async (req,res) =>{
    const { token } = req.params;
    const { password } = req.body;

    const usuario = await Usuario.findOne({token});
    if(usuario){
        try {
            usuario.password = password;
            usuario.token = '';
            await usuario.save();
            res.json({msg: 'Password modificado correctamente'});
        } catch (error) {
            console.log(error);
        }
    }
    else{
        const error = new Error("El token no es válido");
        return res.status(403).json({msg: error.message});
        
    }
}

const perfil = async (req, res) =>{
    const { usuario } = req;
    res.json(usuario);
}

export {
    registrar,
    autenticar,
    confirmar,
    olvide,
    comprobarToken,
    nuevoPassword,
    perfil
}