import express from "express";
import { admin, cart, cerrarSesion, editarCantidad, entregado, login, loginPost, menu,menupost,nuevoProducto,nuevoProductoPost,pedido,registrate, registratePost,removeProduct,productos, eliminarProducto, modificarProducto, modificarProductoPost,pagopaypal,pagoCorrecto } from "../controllers/usuarioControllers.js";
import multer from "multer";


const router = express.Router(); 



const storage =  multer.diskStorage({
    destination: "public/img",
    filename: (req,file,cb) =>{
        cb(null, file.originalname)
    }
})



const subir = multer({
    storage: storage ,
    dest: `public/img`
}).single('imagen')




router.get("/login", login);
router.post("/login", loginPost)

router.get("/registrate", registrate)
router.post("/registrate", registratePost)
router.post("/cerrarSesion",cerrarSesion)

router.get("/", menu)
router.post("/addcart",menupost)

router.get("/cart",cart)
router.post("/remove_product",removeProduct)
router.post("/editar_cantidad",editarCantidad)

router.get("/pedido",pedido);
/* router.get("/pagos", pagos); */
router.post("/pagos",pagopaypal)
router.get("/pagoCorrecto", pagoCorrecto);



//rutas del admin
router.get("/admin",admin)
router.post("/entregado", entregado)

router.get("/nuevoProducto", nuevoProducto);
router.post("/nuevoProductoPost",subir,nuevoProductoPost)

router.get("/productos", productos);
router.get("/modificarProducto",modificarProducto)
router.post("/eliminarProducto",eliminarProducto)
router.post("/modificarProductoPost", modificarProductoPost)



export default router;