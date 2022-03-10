import mongoose from "mongoose"

const {
    Schema
} = mongoose;


const cartSchema = new Schema({
     shopName:String,
     uid:String,
     products:[Object],
     seller:String, 

}, {
timestamps : true
});

export const CartModel = mongoose.model('carts', cartSchema);