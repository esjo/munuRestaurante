import nodemailer from "nodemailer";

const emailRegistro = async(datos) =>{
    const transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "e859d92dc3f6c5",
          pass: "be1ed7e981ebdb"
        }
      });

      const {email,nombre,token} = datos;

      await transport.sendMail({
        from: 'jcrestaurantsystem.com',
        to: email,
        subject: `Confirma tu cuenta de jcrestaurantsystem.com`,
        text: `Confirma tu cuenta de jcrestaurantsystem.com`,
        html: `
            <p>Hola ${nombre}, comprueba tu cuenta en bienesRaices.com</p>
            <p>Tu cuenta ya esta lista solo debes confirmarla en el siguiente enlace:
                <a href=http://localhost:4000/confirmar/${token}>Confirmar cuenta</a>
            </p>
            <p>Si tu no creaste esta cuenta puedes ignorar el mensaje</p>

        `
      })
      console.log(datos)

}



export{
    emailRegistro
}