import nodemailer from 'nodemailer';

export const emailRegistro = async (datos) => {
    const { nombre, email, token } = datos;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const info = await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "UpTask - Confirma tu cuenta",
        text: "Comprueba tu cuenta en UpTask",
        html: `
            <p>Hola: ${nombre} comprueba tu cuenta en UpTask</p>
            <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace: 
                <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
            </p>
            <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        
        `
    });
}

export const emailOlvide = async(datos) => {
    const { nombre, email, token } = datos;
    
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const info = await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "UpTask - Reestablece tu Cuenta",
        text: "Recupera tu cuenta en UpTask",
        html: `
            <p>Hola: ${nombre} has solicitado recuperar tu cuenta de UpTask</p>
            <p>Solo debes crear un nuevo password en el siguiente enlace: 
                <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a>
            </p>
            <p>Si tu no solicitaste esto, puedes ignorar el mensaje</p>
        
        `
    });
}