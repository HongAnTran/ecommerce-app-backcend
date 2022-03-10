import  express  from "express";

import { getBill ,addBill ,subBill , addAllBill , removeAllBill , addressBill , quantilyBill ,freeShipBill} from "../controller/bill.js"


const billRouter = express.Router()

billRouter.get('/user',getBill)
billRouter.post('/add',addBill)
billRouter.post('/sub',subBill)

billRouter.post('/all',addAllBill)
billRouter.post('/remove',removeAllBill)
billRouter.post('/address',addressBill)

billRouter.put('/quantily',quantilyBill)
billRouter.post('/freeShip',freeShipBill)


export default billRouter