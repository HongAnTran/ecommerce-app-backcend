import { OrderModel } from "../models/orderModel.js";
import { ProductModel } from "../models/productModel.js";
export const createOrder = async function (req, res, next) {
  try {
    const { uid, productsBill, address } = req.body.bill;
    const methodPay = req.body.methodShip;

    for await (const bill of productsBill) {
      const orderItem = {
        uid,
        seller: bill.seller,
        shopName: bill.shopName,
        totalOrder: bill.total,
        productsOrder: bill.products,
        addressShip: address,
        status: "CHỜ XÁC NHẬN",
        tempCost: bill.totalShop,
        totalCost: bill.totalShop + bill.shipPrice,
        shipPrice: bill.shipPrice,
        shipPriceOld: bill.shipPriceOld,
        methodPay,
        rate: false,
      };

      const order = await new OrderModel(orderItem);
      await order.save();
    }

    // const order = await OrderModel.find({ uid, status:'CHỜ XÁC NHẬN' }).exec();

    res.status(200).json({ uid });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getOrder = async (req, res) => {
  try {
    const uid = req.query.uid;
    const seller = req.query.seller;
    const type = req.query.type;
    let status = "";

    switch (type) {
      case "all":
        status = "";
        break;
      case "confirm":
        status = "CHỜ XÁC NHẬN";
        break;
      case "deliver":
        status = "ĐANG GIAO";
        break;
      case "complete":
        status = "ĐÃ GIAO";
        break;
      case "cancel":
        status = "ĐÃ HỦY";
        break;

      default:
        status = "";
    }

    if (status) {
      let orders = [];
      if (uid) {
        orders = await OrderModel.find({ uid, status }).sort({updatedAt:-1}).exec();
      } else if (seller) {
        orders = await OrderModel.find({ seller, status }).sort({updatedAt:-1}).exec();
      }

      res.status(200).json(orders);
    } else {
      let order = [];

      if (uid) {
        order = await OrderModel.find({ uid }).sort({updatedAt:-1}).exec();
      } else if (seller) {
        order = await OrderModel.find({ seller }).sort({updatedAt:-1}).exec();
      }
      res.status(200).json(order);
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

export const confirmOrder = async (req, res) => {
  try {
    const idOrder = req.body.id;
    const dayShip = req.body.dayShip;

    const [orderOld] = await OrderModel.find({ _id: idOrder });

    orderOld.dayShip = dayShip;
    orderOld.status = "ĐANG GIAO";
    await OrderModel.findOneAndUpdate({ _id: idOrder }, orderOld, {
      new: true,
    });

    const orders = await OrderModel.find({
      seller: orderOld.seller,
      status: "CHỜ XÁC NHẬN",
    }).sort({updatedAt:-1}).exec();

    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const recieveOrder = async (req, res) => {
  try {
    const idOrder = req.body.id;
    const productsOrder = req.body.productsOrder;

    for await (const product of productsOrder) {
      const [ productOld ] = await ProductModel.find({
        productId: product.productId,
      });
      // update sold 
      productOld.sold += product.quantilyOder;

      // sub quantily product
      if (product.type) {
        const index = productOld.distributeProduct.findIndex(
          (item) => item.distributeProductName === product.type
        );

        productOld.distributeProduct[index].distributeProductQuantily -=
          product.quantilyOder;
      }else{
        productOld.quantily -= product.quantilyOder;
      }

      await ProductModel.findOneAndUpdate(
        { productId: product.productId },
        productOld,
        { new: true }
      );
    }

    const [orderOld] = await OrderModel.find({ _id: idOrder });

    orderOld.status = "ĐÃ GIAO";
    orderOld.shipSuccess = true;

    await OrderModel.findOneAndUpdate({ _id: idOrder }, orderOld, {
      new: true,
    });

    const orders = await OrderModel.find({
      uid: orderOld.uid,
      status: "ĐÃ GIAO",
    }).sort({updatedAt:-1}).exec();

    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json(error);
  }
};
