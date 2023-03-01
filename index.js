import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import usuarioRoutes from './routes/usuarioRoutes.js';
import proyectoRoutes from './routes/proyectoRoutes.js';
import tareaRoutes from './routes/tareaRoutes.js';
import conectarDB from './config/db.js';

const app = express();
app.use(express.json());

dotenv.config();

conectarDB();

//Configurar CORS
const whiteList = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function(origin, callback){
        if(whiteList.includes(origin)){
            //Puede consultar la API
            callback(null, true);
        }
        else{
            //No puede consultar
            callback(new Error("Error de Cors"));
        }
    },
};

app.use(cors(corsOptions));

//Routing

app.use('/api/usuarios',usuarioRoutes);
app.use('/api/proyectos',proyectoRoutes);
app.use('/api/tareas',tareaRoutes);

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () =>{
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})


//Socket.io

import { Server } from 'socket.io';
const io = new Server(server,{
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL,
    },
});

io.on('connection',(socket) => {
    socket.on('abrir proyecto', (proyecto) =>{
        socket.join(proyecto);

        socket.emit("respuesta",{});
    });

    socket.on('nueva tarea', (tarea) =>{
        socket.to(tarea.proyecto).emit('tarea agregada',tarea);
    });

    socket.on('eliminar tarea', (tarea) =>{
        socket.to(tarea.proyecto).emit('tarea eliminada', tarea);
    });

    socket.on('editar tarea', tarea =>{
        socket.to(tarea.proyecto._id).emit('tarea editada', tarea);
    });

    socket.on('completar tarea', tarea => {
        socket.to(tarea.proyecto._id).emit('tarea completa', tarea);
    });
});