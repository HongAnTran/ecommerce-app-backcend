
import express from 'express';
import cors from 'cors'
import  mongoose  from 'mongoose';
import users from './routes/users.js'
import imageRouter from './routes/image.js';
import products from './routes/products.js';
import cartRouter from './routes/carts.js';
import billRouter from './routes/bill.js';
import orderRouter from './routes/order.js'
import customerRouter from './routes/customerRouter.js'
import rateRouter from './routes/rate.js';

import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000


// app.get('', (req, res) => {
//     console.log(req.params)
// })

// middleware
app.use(cors())
app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({extended:true,limit:'50mb'}))



//routers
app.use('/users', users)
app.use('/images',imageRouter)
app.use('/images', express.static('./images'))
app.use('/products',products)
app.use('/cart',cartRouter)
app.use('/bill',billRouter)
app.use('/order',orderRouter)
app.use('/rate',rateRouter)

app.use('/customer/purchase/all',customerRouter)




//connect database
const URL =process.env.URL_DATABASE



mongoose.connect(URL,{useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connect database successfully')
        //listen server
    app.listen(port, () => {
    console.log(` listening at http://localhost:${port}`)
  })

    })
    .catch(err => console.error(err))


export const URLSever = 'http://localhost:5000'