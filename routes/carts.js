import  express  from "express";
import {getCartUser,getCarts ,addProductToCart, editQuantilyCart ,deleteProductInCart ,deleteAllProductInCart} from "../controller/cart.js"



const cartRouter = express.Router()


cartRouter.get('/user',getCartUser)
cartRouter.get('/',getCarts)

cartRouter.post('/add',addProductToCart)
cartRouter.put('/quantily',editQuantilyCart)

cartRouter.post('/delete',deleteProductInCart)
cartRouter.post('/delete/all',deleteAllProductInCart)






export default cartRouter