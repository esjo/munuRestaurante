import Sequelize from "sequelize";
import db from "../config/db.js";

export const Usuario = db.define('usuarios', {
    nombre:{
        type: Sequelize.STRING
    },
    correo:{
        type:Sequelize.STRING
    },
    contraseña:{
        type:Sequelize.STRING
    },
    token:{type:Sequelize.STRING},
    confirmado:{type:Sequelize.BOOLEAN}
});