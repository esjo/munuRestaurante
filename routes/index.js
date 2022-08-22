import express from "express";
import {Usuario} from "../modelos/Usuario.js";

const router = express.Router();



router.get("/login", (req,res)=>{
    res.render("login");
});

router.get("/registrate",(req,res) =>{
    res.render('registrate')
})


router.post("/registrate", async(req,res)=>{
    /* const nombre = req.body.nombre;
    const correo = req.body.correo;
    const contraseña = req.body.contraseña; */

    //validar 
    const errores = [];

    const {nombre,correo,contraseña} = req.body;

    if(nombre.trim() === ""){
        errores.push({msg: "nombre vacio"});
    }

    if(correo.trim() === ""){
        errores.push({msg:"El correo esta vacio"});
    }

    if(contraseña.trim() === ""){
        errores.push({msg:"La contraseña esta vacia"});
    }

    if(errores.length > 0){
        //vista con errores
        res.render('registrate', {
            errores
        });
    }else{
        try {
            const usuarioNuevo = await Usuario.findOne({where:{correo:correo}});
            console.log(usuarioNuevo)
            if(usuarioNuevo === null){
                await Usuario.create({
                    nombre,
                    correo,
                    contraseña
                });
    
                res.redirect('/login')
            }else{
                errores.push({msg:"Usuario ya existe"})
                res.render('registrate',{
                    errores
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    //console.log(req.body);
    //const consulta = await Usuario.create({nombre,correo,contraseña})
    
})

router.post("/login", async(req,res) =>{
    const {correo,contraseña} = req.body;
    req.session.login = false;

    const errores = [];

    if(correo.trim() === ""){
        errores.push({msg:"El correo esta vacio"});
    }

    if(contraseña.trim() === ""){
        errores.push({msg:"La contraseña esta vacia"});
    }

    if(errores.length > 0){
        res.render("login",{
            errores
        })
    }else{
        try {
            const usuarios = await Usuario.findOne({
                where:{
                    correo:correo,
                    contraseña:contraseña
                }
            })
            req.session.login = true;
            if(usuarios === null){
                errores.push({msg:"Usuario no existe"})
                res.render("login",{
                    errores
                })
            }else{
                req.session.login = true;
                res.redirect('/');
            }
            console.log(usuarios)

        } catch (error) {
            console.log(error);
        }
        
    }

})

router.get("/", (req,res) =>{
    if(req.session.login){
        res.send("hola");
    }else{
        res.render('/login');
    }
})

export default router;