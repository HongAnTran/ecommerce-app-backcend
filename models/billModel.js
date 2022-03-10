import mongoose from "mongoose"

const {
    Schema
} = mongoose;


const billSchema = new Schema({
         uid:String,
         discount:{
             type:Number,
             default: 0,
         },
         productsBill:[Object],
         productsTotal:[Object],
         total:Number,
         tempCost:Number,
         shipPriceTotal:{
             type:Number,
             default: 0,
         },
         address:Object,
         freeShip:{
             type:Boolean,
             default: false,
         }




}, {
timestamps : true
});

export const BillModel = mongoose.model('bill', billSchema);