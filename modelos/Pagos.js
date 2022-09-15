import sequelize from "sequelize";
import Sequelize from "sequelize";
import db from "../config/db.js";

export const Pagos = db.define('pagos', {
    id:{
        type: sequelize.STRING,
        primaryKey: true,
        required:true
    },
    total:{
        type: Sequelize.INTEGER,
        required:true
    },
    fecha:{
        type:Sequelize.DATE,   
        defaultValue: Sequelize.NOW
    },
    estado:{
        type:Sequelize.STRING,
        required:true
    },
});