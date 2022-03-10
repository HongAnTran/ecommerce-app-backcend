import  express  from "express";




const customerRouter = express.Router()

customerRouter.get('/',(req, res) => {

    console.log(req.query)
})


export default customerRouter