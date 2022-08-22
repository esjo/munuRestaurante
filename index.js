import express from "express";
import session from "express-session";
import router from "./routes/index.js";
import db from "./config/db.js";


const app = express();

db.authenticate()
    .then(() => console.log('Bases de datos conectada'))
    .catch((error) =>console.log(error));


//Definir puerto
const port = process.env.PORT || 4000;

//Habilitando ejs
app.set('view engine', 'ejs');

//sesiones
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}))

//agregar body parser para leer los datos del formulario
app.use(express.urlencoded({extended:true}));

//definir la carpeta publica
app.use(express.static("public"));

app.use("/",router);    



app.listen(port, () =>{
    console.log('Desde el puerto ',port);
})