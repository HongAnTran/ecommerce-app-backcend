import  express  from "express";
import { createOrder ,getOrder ,confirmOrder ,recieveOrder} from "../controller/order.js";
const orderRouter = express.Router()



orderRouter.post('/create',createOrder);
orderRouter.get('/get',getOrder);
orderRouter.post('/confirm',confirmOrder);
orderRouter.post('/recieve',recieveOrder);


export default orderRouter