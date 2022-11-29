import { ProductModel } from "../models/productModel.js";
import { UserModel } from "../models/userModel.js";

function controllerProduct(products) {
  const productsAdd = products.map((product) => {
    // handle price distribute
    const distribute = product.distributeProduct;
    
    const productPriceMin = distribute.map((dis) =>
      Number(dis.distributeProductPrice)
    );
    const priceDis = productPriceMin.sort(function (a, b) {
      return a - b;
    });

    const distributeProduct = distribute.map((dis) => {
      return {
        ...dis,
        distributeProductPrice: Number(dis.distributeProductPrice),
        distributeProductQuantily: Number(dis.distributeProductQuantily),
      };
    });

    // handle sort images
    const images = product.images;
    images.sort(function (a, b) {
      return a.index - b.index;
    });

    // handle quantily
    const quantily = distribute.reduce((init, product) => {
      return init + Number(product.distributeProductQuantily);
    }, 0);

    if (distribute.length > 0) {
      return {
        ...product._doc,
        priceMin: priceDis[0],
        priceMax: priceDis[priceDis.length - 1],
        images,
        quantily: quantily,
        distributeProduct,
      };
    }

    return {
      ...product._doc,
      images: images,
      price: product.price,
    };
  });

  return productsAdd;
}

export const postProduct = async (req, res, next) => {
  try {
    const productNew = req.body;
    if(productNew?.distributeProduct?.length > 0){
      productNew.quantily = productNew.distributeProduct.reduce((init, product) => {
        return init + Number(product.distributeProductQuantily);
      }, 0);
    }
    const product = new ProductModel(productNew);



     product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json(error); 
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const products = await ProductModel.find().limit(30);

    const productsComplete = controllerProduct(products);

    res.status(200).json(productsComplete);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getProductsUser = async (req, res, next) => {
  try {
    const uid = req.query.uid;
    const productsUser = await ProductModel.find({ uid });

    const productsComplete = controllerProduct(productsUser);
    res.status(200).json(productsComplete);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const productId = req.query.productId;

    const product = await ProductModel.find({ productId });

    const productPage = controllerProduct(product);

    res.status(200).json(productPage);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getShop = async (req, res, next) => {
  try {
    const uid = req.query.uid;

    const owner = await UserModel.find({ uid });

    res.status(200).json(owner);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const productsUser = await ProductModel.findOneAndRemove({ _id: id });
    res.status(200).json(productsUser);
  } catch (error) {
    res.status(400).json(error);
  }
};
export const likeProductPage = async (req, res, next) => {
  try {
    
    const uid = req.body.uid;
    const productId = req.body.productId;
    const [product] = await ProductModel.find({ productId });
    const checkedUser = product.listLikeProduct.includes(uid);
    
    if (!checkedUser) {
      product.listLikeProduct.push(uid);  

    }else{
    product.listLikeProduct =   product.listLikeProduct.filter(item => item !== uid);
    }
   const productNew =  await ProductModel.findOneAndUpdate({ productId }, product,{new:true});
   
     res.status(200).json(productNew);
  } catch (error) {
    res.status(400).json(error);
  }  
};