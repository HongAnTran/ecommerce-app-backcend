import { RateModel } from "../models/rateModel.js";
import { UserModel } from "../models/userModel.js";
import { OrderModel } from "../models/orderModel.js";
import { ProductModel } from "../models/productModel.js";
import moment from "moment";
export const getAllRate = async (req, res) => {
  try {
    const rate = await RateModel.find();
    res.status(200).json(rate);
  } catch (error) {
    res.status(400).json(error);
  }
};
export const getRatesProduct = async (req, res) => {
  try {
    const productId = req.query.productId;
    const rates = await RateModel.find({ productId: productId }).exec();

    res.status(200).json(rates);
  } catch (error) {
    res.status(400).json(error);
  }
};
export const createRate = async (req, res, next) => {
  try {
    const rate = req.body;
    const productsRate = rate.productsRate;
    const [user] = await UserModel.find({ uid: rate.uid });
    const date = new Date();
    const dateNow = moment(date).format("DD-MM-YYYY HH:mm");
    for await (const product of productsRate) {
      const newRate = {
        comment: rate.comment,
        star: rate.star,
        user: {
          uid: rate.uid,
          imgUser: user.photoURL,
          nameUser: user.name,
        },
        productId: product.productId,
        productType: product.type,
        imgRate: rate?.imgRate?.path,
        dateCreated: dateNow,
      };

      const newRateModel = await new RateModel(newRate);
      newRateModel.save();

      const [productRate] = await ProductModel.find({
        productId: product.productId,
      });
      const newRateStar = [...productRate.rateStar, rate.star];
      const newRateStarAverage =
        newRateStar.reduce((a, b) => a + b, 0) / newRateStar.length;
      await ProductModel.findOneAndUpdate(
        { productId: product.productId },
        { $set: { rateStar: newRateStar, averageStar: newRateStarAverage } }
      );
    }

    await OrderModel.findOneAndUpdate(
      { _id: rate.orderId },
      { $set: { rate: true } }
    );
    // checking give a gift
    if (rate.conditionGift) {
      const coinNew = user.coin + 100;
      await UserModel.findOneAndUpdate(
        { uid: rate.uid },
        { $set: { coin: coinNew } }
      );
    }

    const allRate = await RateModel.find();
    res.status(200).json(allRate);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const filterRatesProduct = async (req, res) => {
  try {
    const option = req.query.option;
    const productId = req.query.productId;
    let rates = await RateModel.find({ productId: productId }).exec();

 
  const ratesResponse =   handleFilterRates(rates,option);
    res.status(200).json(ratesResponse);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const likeRateProduct = async (req, res) => {
  try {
    const rate = req.body.rate;
    const selectedFilterRate = req.body.selectedFilterRate;
    const checkLike = req.body.checkLike;

    const [rateOld] = await RateModel.find({ _id: rate._id });
    if(!checkLike) {
      rateOld.likeRate += 1;
      rateOld.usersLike.push(rate.user.uid);
    }else {
      rateOld.likeRate -= 1;
      rateOld.usersLike = rateOld.usersLike.filter(user => user !== rate.user.uid);
    }
 
    await RateModel.findOneAndUpdate({ _id: rate._id }, rateOld);

    let rates = await RateModel.find({ productId: rate.productId }).exec();
   
  const ratesResponse =  handleFilterRates(rates,selectedFilterRate);

    res.status(200).json(ratesResponse);
  } catch (error) {
    res.status(400).json(error);
  }
};

function handleFilterRates(rates,option) {


  switch (option) {
    case "5 Sao": {
      rates = rates.filter((rate) => rate.star === 5);
      return rates
    }
    case "4 Sao": {
      rates = rates.filter((rate) => rate.star === 4);

      return rates
    }
    case "3 Sao": {
      rates = rates.filter((rate) => rate.star === 3);

      return rates
    }
    case "2 Sao": {
      rates = rates.filter((rate) => rate.star === 2);

      return rates
    }
    case "1 Sao": {
      rates = rates.filter((rate) => rate.star === 1);

      return rates
    }
    case "Có Bình Luận": {
      rates = rates.filter((rate) => rate.comment.length > 0);

      return rates
    }
    case "Có Hình Ảnh/Video": {
      rates = rates.filter((rate) => rate.imgrate);

      return rates
    }
    case "Tất Cả": {
      rates = [...rates];
      return rates
    }

    default:
      return rates;
  }


}