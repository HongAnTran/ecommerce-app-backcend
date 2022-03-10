import express from "express";
import {
  postProduct,
  getProducts,
  getProductsUser,
  deleteProduct,
  getProduct,
  getShop,
  likeProductPage
} from "../controller/product.js";

const productRouter = express.Router();

productRouter.post("/", postProduct);

productRouter.get("/", getProducts);
productRouter.get("/user", getProductsUser);
productRouter.get("/page", getProduct);
productRouter.get("/shop", getShop);

productRouter.delete("/:id", deleteProduct);
productRouter.post("/like", likeProductPage);

export default productRouter;
