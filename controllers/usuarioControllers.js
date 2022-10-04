import {Usuario} from "../modelos/Usuario.js";
import {generarId} from "../helpers/tokens.js";
import {emailRegistro} from "../helpers/mails.js";
import { Producto } from "../modelos/Productos.js";
import { Orden } from "../modelos/Orden.js";
import { Pagos } from "../modelos/Pagos.js";
import sharp from "sharp";

//para la imagen
const helperImg = (filePath, filename, size = 120) =>{
    return sharp(filePath)
        .resize(size)
        .toFile(`public/uploads/${filename}.png`)
}





function isProductIncart(cart,id){
    for(let i=0;i<cart.length;i++){
        if(cart[i].id == id){
            return true;
        }
    }
    return false;
}

function calcularTotal(cart,req){

    let total=0;
    for(let i=0;i<cart.length;i++){
        if(cart[i].precio){
            total = total + (cart[i].precio*cart[i].cantidad);
        }
    }
    req.session.total = total;
    return total; 
}

const login = (req,res) =>{
    res.render("login");
}

const loginPost = async(req,res) =>{
    const {correo,contraseña} = req.body;
    req.session.login = false;
    req.session.correo = correo;
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
            
           
            if(correo === "admin@admin.com" && contraseña === "admin"){
                req.session.login = true;
                res.redirect("/admin");

            }
            if(usuarios === null){
                errores.push({msg:"Usuario no existe"})
                return res.render("login",{
                    errores
                })

            
            }

            if(!usuarios.confirmado){
                errores.push({msg:"El usuario no ha sido confirmado"})
                return res.render('login',{
                    errores
                })
            }
            
            req.session.login = true;
            res.redirect('/');
            
            //console.log(usuarios)

        } catch (error) {
            console.log(error);
        }
        
    }

}



const registrate = (req,res) =>{
    res.render('registrate')
}

const registratePost = async(req,res)=>{
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
            //console.log(usuarioNuevo)
            if(usuarioNuevo === null){
                const usuarioCreado = await Usuario.create({
                    nombre,
                    correo,
                    contraseña,
                    token:generarId()
                });

                //Enviar email de confirmación

                emailRegistro({
                    nombre:usuarioCreado.nombre,
                    email:usuarioCreado.correo,
                    token:usuarioCreado.token
                })
    
                //Mostrar mensaje de confirmación
                res.render('template/mensaje',{
                    pagina: 'Cuenta creada correctamente',
                    mensaje: 'Hemos enviado un email de confirmación, presiona en el enlace'
                })
                /* res.redirect('/login') */
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
    
}

//función que comprueba una cuenta
const confirmar = async(req,res) =>{
    const {token} = req.params;

    //verificar si el token es valido

    const usuario = await Usuario.findOne({where:{token}});

    if(!usuario){
        return res.render('confirmar-usuario',{
            pagina:'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
            error:true
        })
    }

    //confirmar la cuenta
    usuario.token = null;
    usuario.confirmado = true;

    await usuario.save();

    return res.render('confirmar-usuario',{
        pagina:'Cuenta confirmada',
        mensaje: 'La cuenta se confirmo',
        error:false
    })
}

const menu = async(req,res) =>{
    console.log(req.session)
    if(req.session.login){
        const producto = await Producto.findAll();
        await Orden.destroy({where:{estado:false}})
        res.render("menu",{
            producto,
            
        });
        
    }else{
        res.render('login');
    }
}

const cerrarSesion = (req,res) =>{
    /* req.session.login = "";
    req.session.correo = "";
    req.session.cart = "";
    req.session.total = ""; */

    req.session.destroy((error) => {
        res.redirect("/login")  
    })

    
}

const menupost = (req,res) =>{

    const {id,nombre,precio,imagen,cantidad} = req.body;

    let productoCarrito = {id:id,nombre:nombre,precio:precio,imagen:imagen,cantidad:cantidad};

    if(req.session.cart){
        var cart = req.session.cart;
        if(!isProductIncart(cart,id)){
            cart.push(productoCarrito);
        }

    }else{
        req.session.cart = [productoCarrito];
        var cart = req.session.cart;
    }



    //calcular total
    calcularTotal(cart,req);
    /* req.session.total;
    for(let i=0;i<cart.length;i++){
        if(cart[i].precio){
            req.session.total = req.session.total + (cart[i].precio*cart[i].cantidad);
        }
    } */

    //return to cart page

    res.redirect("/cart");
}


const cart = (req,res) =>{
    let cart = req.session.cart;
    let total = req.session.total;
    
    let correo = req.session.correo;
    console.log(req.session)

    res.render('cart',{
        cart,
        total,
        correo
    })
    
}

const removeProduct = (req,res) =>{
    console.log(req.body)
    console.log(req.session)
    const {id} = req.body;
    let cart = req.session.cart;

    for(let i=0;i<cart.length;i++){
        if(cart[i].id == id){
            cart.splice(cart.indexOf(i),1);
        }
    }

    //recalcular el total
    calcularTotal(cart,req);

    res.redirect('/cart')
}

const editarCantidad = (req,res) =>{

    const {disminuir_cantidad,aumentar_cantidad,cantidad,id} = req.body;

    let cart = req.session.cart;

    if(aumentar_cantidad){
        for(let i=0;i<cart.length;i++){
            if(cart[i].id == id){
                if(cart[i].cantidad >= 0){
                    cart[i].cantidad = parseInt(cart[i].cantidad)+ 1;
                }
            }
        }
    }

    if(disminuir_cantidad){
        for(let i=0;i<cart.length;i++){
            if(cart[i].id == id){
                if(cart[i].cantidad > 1){
                    cart[i].cantidad = parseInt(cart[i].cantidad)- 1;
                }
            }
        }
    }

    calcularTotal(cart,req);
    res.redirect("/cart")
}




const pedido = async(req,res) =>{
    //ver pedido para pagar
    const cart = req.session.cart;
    const total = req.session.total;
    const correo = req.session.correo;
    const usuario = await Usuario.findOne({where:{correo:correo}});
    let totalPago =  total/4500;
    totalPago = totalPago.toFixed(2);

    try {
        for(let i=0;i<cart.length;i++){
            await Orden.create(
                {
                    nombre: cart[i].nombre,
                    cantidad: cart[i].cantidad,
                    precio: cart[i].precio,
                    imagen: cart[i].imagen,
                    estado: false,
                    correo_cliente: correo,
                    nombre_cliente: usuario.nombre,

                }
            ) 
        }

        //orden cliente

        //console.log(usuario);
           
    } catch (error) {
        console.log(error);
    }
   /*  
    ) */
    
    
    //console.log(orden);
    res.render('pedido',{
        cart,
        total,
        totalPago
    });
}



const pagopaypal = async(req,res) => {
    const {status} = req.body.orderData;
    const {correo} = req.session;
    const {id} = req.body.orderData;
    const fecha = req.body.orderData.update_time;

    if(status === "COMPLETED"){
        const orden = await Orden.update(
            {
                estado:true
            },{
                where:{
                    correo_cliente:correo
                }
            }
        )
        
        const pago = await Pagos.create({
            id, 
            total: req.session.total,
            fecha,
            estado: status
        })
    }
}

const pagoCorrecto = (req,res) =>{
    req.session.cart = null;
    req.session.total = null;
    console.log(req.session);

    res.render("pagoCorrecto");
}

const admin = async(req,res) =>{

    const orden = await Orden.findAll({where:{estado:true}})
    console.log(orden);
    res.render("adminPanel",{
        orden
    })
}

const entregado = async(req,res) =>{
    const id = req.body.id;
    await Orden.destroy({
        where:{
            id
        }
    })

    res.redirect('/admin');
    console.log(req.body);
}

const productos = async(req,res) =>{
    const productos = await Producto.findAll();
    res.render('productos',{
        productos
    });
}

const nuevoProducto = (req,res) =>{
    res.render("nuevoProducto");
}

//Crear nuevo producto
const nuevoProductoPost = async(req,res) =>{

    const errores = [];
    const body = JSON.parse(JSON.stringify(req.body)); 
    const {nombreProducto, precio} = body;

    if(nombreProducto.trim() === ""){
        errores.push({msg:"El producto debe tener un nombre"})
    }

    if(precio === ""){
        errores.push({msg:"El producto debe tener un precio"})
    }

    if(!req.file){
        errores.push({msg:"El producto debe tener una imagen"})
    }

    

    if(errores.length > 0){
        res.render("nuevoProducto",{
            errores
        })
    }else{
        //validar si un producto existe 
        const producto = await Producto.findOne({
            where:{
                nombre:nombreProducto
            }
        })

        console.log(producto)
        if(producto){
            const mensaje = "El producto ya existe"
            res.render("nuevoProducto",{
                mensaje
            })
            return;
        }

        
        if(!producto){
            helperImg(req.file.path, req.file.filename,120)

            await Producto.create({
                nombre:nombreProducto,
                precio:precio,
                imagen: `../uploads/${req.file.originalname}.png`
            })
            //console.log("El producto no existe")
            console.log(req.file);
            res.redirect("/productos")
        }
    }
    
    

  

    
    
    //console.log(req.file.originalname);
}



const eliminarProducto = async(req,res) =>{
    const id = req.body.id;
    await Producto.destroy({
        where:{
            id
        }
    })

    res.redirect('/productos');
    console.log(req.body);
}

const modificarProducto = async(req,res) =>{
    const {precio,nombre,id} = req.query;
    const producto = await Producto.findOne({
        where:{
            id
        }
    })
    
    
    res.render('modificarProducto',{
        precio,
        nombre,
        id
    })
}

const modificarProductoPost = async(req,res) =>{
    const {nombre,precio,id} = req.body;

    await Producto.update({nombre,precio},{
        where:{
            id:id
        }
    })

    res.redirect("/productos");
        /* {},{
            where:{
                id:id
            }
        } */
    
}




export {
    registrate,
    login,
    loginPost,
    registratePost,
    confirmar,
    menu,
    menupost,
    cart,
    removeProduct,
    editarCantidad,
    pedido,
    cerrarSesion,
    admin,
    entregado,
    nuevoProducto,
    nuevoProductoPost,
    productos,
    eliminarProducto,
    modificarProducto,
    modificarProductoPost,
    pagopaypal,
    pagoCorrecto
}