import { CartModel } from "../models/cartModel.js";

export const getCarts = async (req, res, next) => {
  try {
    const carts = await CartModel.find();

    res.status(200).json(carts);
  } catch (error) {
    res.status(404).json(error);
  }
};

export const getCartUser = async (req, res, next) => {
  try {
    const uid = req.query.uid;
    const cart = await CartModel.find({ uid }).exec();

    cart.forEach((item) => {
      item.products.forEach((product) => {
        product.intoMoney = product.priceProduct * product.quantilyOder;
      });
    });

    res.status(200).json(cart);
  } catch (error) {
    res.status(404).json(error);
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const product = req.body;
    const uid = req.body.uid;
    const seller = req.body.seller;
    const shopName = req.body.shopName;
    const cartUserCurrent = await CartModel.find({ uid }).exec();

    // check shopname already exist ?
    const checkShop = cartUserCurrent.find(
      (item) => item.shopName === shopName
    );
    if (checkShop) {
      // find index of product
      product.products.forEach((prd) => {
        const indexProduct = checkShop.products.findIndex(
          (item) => item.productId === prd.productId
        );

        const checkType = checkShop.products.some(
          (item) => item.type === prd.type
        );
        if (indexProduct > -1 && checkType) {
          checkShop.products[indexProduct].quantilyOder += prd.quantilyOder;
        } else {
          checkShop.products.push(prd);
        }
      });

    
      await CartModel.findOneAndUpdate(
        {
          _id: checkShop._id,
        },
        checkShop,
        {
          new: true,
        }
      );
    } else {
      const cartNew = await new CartModel(product);
      await cartNew.save();
    }

    const cart = await CartModel.find({ uid }).exec();

    cart.forEach((item) => {
      item.products.forEach((product) => {
        product.intoMoney = product.priceProduct * product.quantilyOder;
      });
    });

    res.status(200).json(cart);
  } catch (error) {
    res.status(404).json(error);
  }
};

export const editQuantilyCart = async (req, res, next) => {
  try {
    const indexProduct = req.body.index;
    const method = req.body.method;
    const uid = req.body.uid;
    const shopName = req.body.shopName;
    const [cartCurrent] = await CartModel.find({ uid, shopName });
    const productEdit = cartCurrent.products[indexProduct];

    if (method === "ADD") {
      productEdit.quantilyOder += 1;
    } else {
      productEdit.quantilyOder -= 1;
    }

    await CartModel.findOneAndUpdate({ uid, shopName }, cartCurrent);

    const cart = await CartModel.find({ uid }).exec();

    cart.forEach((item) => {
      item.products.forEach((product) => {
        product.intoMoney = product.priceProduct * product.quantilyOder;
      });
    });
    productEdit.intoMoney = productEdit.priceProduct * productEdit.quantilyOder;

    res.status(200).json({ cart, productEdit });
  } catch (error) {
    res.status(404).json(error);
  }
};

export const deleteProductInCart = async (req, res, next) => {
  try {
    const indexProduct = req.body.index;
    const uid = req.body.uid;
    const shopName = req.body.shopName;

    const [cartCurrent] = await CartModel.find({ uid, shopName });
    if (cartCurrent.products.length > 1) {
      cartCurrent.products.splice(indexProduct, 1);

      await CartModel.findOneAndUpdate({ uid, shopName }, cartCurrent);
    } else {
      await CartModel.findOneAndDelete({ uid, shopName });
    }

    const cart = await CartModel.find({ uid }).exec();

    cart.forEach((item) => {
      item.products.forEach((product) => {
        product.intoMoney = product.priceProduct * product.quantilyOder;
      });
    });
    res.status(200).json(cart);
  } catch (error) {
    res.status(404).json(error);
  }
};

export const deleteAllProductInCart = async (req, res, next) => {
  try {
    const uid = req.body.uid;

    await CartModel.deleteMany({ uid });

    res.status(200).json([]);
  } catch (error) {
    res.status(404).json(error);
  }
};
