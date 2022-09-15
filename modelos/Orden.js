import Sequelize from "sequelize";
import { DATE } from "sequelize";
import db from "../config/db.js";

export const Orden = db.define('ordenes', {
    nombre:{
        type: Sequelize.STRING,
        required:true
    },
    cantidad:{
        type:Sequelize.INTEGER,
        required:true
    },
    precio:{
        type:Sequelize.INTEGER,
        required:true
    },
    imagen:{
        type:Sequelize.STRING,
        required:true
    },
    estado:{
        type:Sequelize.BOOLEAN
    },
    correo_cliente:{
        type:Sequelize.STRING
    },
    nombre_cliente:{
        type:Sequelize.STRING
    },
    fecha:{
        type:Sequelize.DATE,   
        defaultValue: Sequelize.NOW
    }
});