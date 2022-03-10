import mongoose from "mongoose"

const {
    Schema
} = mongoose;


const orderSchema = new Schema({
        uid:String,
        seller: String,
        shopName: String,
        totalOrder: Number,
        productsOrder:[Object],
        addressShip: Object,
        status: String,
        tempCost:Number,
        totalCost:Number,
        shipPrice:Number,
        shipPriceOld:Number,
        methodPay:String,
        rate:{
            type:Boolean,
            default: false,
        },
        dayShip:String,
        shipSuccess:{
            type:Boolean,
            default:false,
        }






}, {
timestamps : true
});

export const OrderModel = mongoose.model('order', orderSchema);