import Sequelize from "sequelize";
import db from "../config/db.js";

export const Producto = db.define('productos', {
    nombre:{
        type: Sequelize.STRING
    },
    precio:{
        type:Sequelize.INTEGER
    },
    imagen:{
        type:Sequelize.STRING
    }
});