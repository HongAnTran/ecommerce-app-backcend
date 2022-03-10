import mongoose from "mongoose"

const {
    Schema
} = mongoose;

const productSchema = new Schema({
        productId: { type: String,
            required: true,
        },
        name:{ 
            type: String,
            required: true,
        }, 
        uid:{
            type:String,
            required: true,
        },
        images:{
            type:[Object],  
        },
       items: {
           type: String,
           required: true,
       },
       price:{
           type: Number,
           default: 0,
       },
       quantily:{
        type: Number,
       },
       origin:{
        type: String,
       },
       sold:{
        type: Number,
        default: 0,
       },
       description:{
        type: String,
        required: true,
       },
       rateStar:{
           type: [Number],
           default:[]
       },
       brand:String,
       insurence:String,
       status:String,
       distributeProduct:[Object],
       nameGroupProduct:String,
       listLikeProduct:{
           type: [String],
           default: [],
       },
       averageStar:{
           type: Number,
           default: 0,
       }
       
       

}, {
    timestamps : true
});

export const ProductModel = mongoose.model('products', productSchema);