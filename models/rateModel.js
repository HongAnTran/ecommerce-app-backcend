import mongoose from "mongoose"

const {
    Schema
} = mongoose;


const rateSchema = new Schema({
         user:Object,
        productId:String,
        productType:String,
        imgRate: String,
        likeRate:{
            default:0,
            type:Number,
        },
        responSeller:String,
        star:Number,
        comment:String,
        dateCreated:String,
        usersLike:{
            type:[String],
            default:[],
        },





}, {
timestamps : true
});

export const RateModel = mongoose.model('rate', rateSchema);