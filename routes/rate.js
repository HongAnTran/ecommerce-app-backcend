import  express  from "express";

import { createRate,getAllRate ,getRatesProduct ,filterRatesProduct ,likeRateProduct} from "../controller/rate.js";


const rateRouter = express.Router()


rateRouter.post('/create',createRate)
rateRouter.get('/',getAllRate)
rateRouter.get('/product',getRatesProduct)
rateRouter.get('/filter',filterRatesProduct)
rateRouter.post('/like',likeRateProduct)
export default rateRouter;