import { BillModel } from "../models/billModel.js";

function handleTempPrice(list) {
  if (list.length === 0) return 0;

  const listIntoMoney = list.map((item) => item.intoMoney);

  const tempPrice = listIntoMoney.reduce((init, item) => {
    return init + item;
  }, 0);

  return tempPrice || 0;
}

export const getBill = async (req, res, next) => {
  try {
    const uid = req.query.uid;

    const bill = await BillModel.find({ uid });

    if (bill.length > 0) {
      res.status(200).json(bill);
    } else {
      const createBill = {
        uid,
        discount: 0,
        productsBill: [],
        productsTotal: [],
        address: null,
        tempCost: 0,
        total: 0,
        shipPriceTotal: 0,
      };
      const billNew = await new BillModel(createBill);
      billNew.save();

      res.status(200).json([billNew]);
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

export const addBill = async (req, res, next) => {
  try {
    const uid = req.body.uid;
    const products = req.body.products;
    const [bill] = await BillModel.find({ uid });
    // check user đã có bill hay chưa nếu chưa thì tạo mới
    if (bill.total > 0) {
      // tim shop name chua product cần thêm
      const checkShop = bill.productsBill.some(
        (product) => product.shopName === products.shopName
      );

      if (checkShop) {
        const indexProduct = bill.productsBill.findIndex(
          (product) => product.shopName === products.shopName
        );
        bill.productsBill[indexProduct].products.push(products);
        bill.productsBill[indexProduct].totalShop += products.intoMoney;

        bill.productsTotal.push(products);

        const tempCost = handleTempPrice(bill.productsTotal);
        const total = handleTempPrice(bill.productsTotal) - bill.discount;
        bill.total = total;
        bill.tempCost = tempCost;
        bill.freeShip = false;

        const createBill = {
          ...bill,
        };

        const billNew = await BillModel.findOneAndUpdate({ uid }, createBill, {
          new: true,
        });

        res.status(200).json([billNew]);
      } else {

        bill.productsBill.push({
          shopName: products.shopName,
          seller: products.seller,
          products: [products],
          totalShop: products.intoMoney,
          shipPrice: 30000,
        });
       bill.productsTotal.push(products);
        bill.total = products.intoMoney + bill.total - bill.discount;
        bill.tempCost = products.intoMoney + bill.tempCost;
        bill.shipPriceTotal += 30000;
      
        if(bill.freeShip){
          bill.productsBill = bill.productsBill.map(product => {
            return {
              ...product,
              shipPriceOld: 30000,
              shipPrice: 30000 - 30000 / bill.productsBill.length,
            }
          })
        }



        const createBill = {
          ...bill,
        };

        const billNew = await BillModel.findOneAndUpdate({ uid }, createBill, {
          new: true,
        });

        res.status(200).json([billNew]);
      }
    } else {
      const createBill = {
        uid,
        tempCost: products.intoMoney,
        total: products.intoMoney,
        productsBill: [
          {
            shopName: products.shopName,
            seller: products.seller,
            products: [products],
            totalShop: products.intoMoney,
            shipPrice: 30000,
          },
        ],
        productsTotal: [products],
        shipPriceTotal: 30000,
        freeShip: false,
      };

      const billNew = await BillModel.findOneAndUpdate({ uid }, createBill, {
        new: true,
      });

      res.status(200).json([billNew]);
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

export const subBill = async (req, res, next) => {
  try {
    const uid = req.body.uid;
    const productReq = req.body.products;
    const [bill] = await BillModel.find({ uid });
    const indexProduct = req.body.index;

    const indexProductBill = bill.productsBill.findIndex(
      (product) => product.shopName === productReq.shopName
    );

    const indexProductTotal = bill.productsTotal.findIndex(
      (item) =>
        item.productId === productReq.productId && item.type === productReq.type
    );

    if (bill.productsBill[indexProductBill].products.length > 1) {
      bill.productsBill[indexProductBill].products.splice(indexProduct, 1);

      bill.productsBill[indexProductBill].totalShop -= productReq.intoMoney;
    } else {
      bill.productsBill.splice(indexProductBill, 1);

      bill.shipPriceTotal -= 30000;

      if(bill.freeShip){
        bill.productsBill = bill.productsBill.map(product => {
          return {
            ...product,
            shipPriceOld: 30000,
            shipPrice: 30000 - 30000 / bill.productsBill.length,
          }
        })
      }
    }

    bill.productsTotal.splice(indexProductTotal, 1);

    const tempCost = handleTempPrice(bill.productsTotal);
    const total = handleTempPrice(bill.productsTotal) - bill.discount;

    bill.tempCost = tempCost;
    bill.total = total;

    const billNew = await BillModel.findOneAndUpdate({ uid }, bill, {
      new: true,
    });

    res.status(200).json([billNew]);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const addAllBill = async (req, res, next) => {
  try {
    const uid = req.body.uid;
    const products = req.body.products;
    const cart = req.body.cart;
    const [bill] = await BillModel.find({ uid });

    bill.productsTotal = products;
    const tempCost = handleTempPrice(bill.productsTotal);
    const total = handleTempPrice(bill.productsTotal) - bill.discount;
    bill.tempCost = tempCost;
    bill.total = total;
    bill.freeShip = false;

    const productsBillNew = cart.map((product) => {
      return {
        shopName: product.shopName,
        seller: product.seller,
        products: product.products,
        totalShop: handleTempPrice(product.products),
        shipPrice: 30000,
      };
    });

    bill.productsBill = productsBillNew;
    bill.shipPriceTotal = 30000 * bill.productsBill.length;
    const billNew = await BillModel.findOneAndUpdate({ uid }, bill, {
      new: true,
    });

    res.status(200).json([billNew]);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const removeAllBill = async (req, res, next) => {
  try {
    const uid = req.body.uid;
    const [bill] = await BillModel.find({ uid });
    bill.productsTotal = [];
    bill.productsBill = [];

    bill.tempCost = 0;
    bill.total = 0;
    bill.shipPriceTotal = 0;
    bill.freeShip = false;

    const billNew = await BillModel.findOneAndUpdate({ uid }, bill, {
      new: true,
    });

    res.status(200).json([billNew]);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const addressBill = async (req, res, next) => {
  try {
    const uid = req.body.uid;
    const address = req.body.address;

    const [bill] = await BillModel.find({ uid });
    bill.address = { ...address };

    await BillModel.findOneAndUpdate({ uid }, bill, {
      new: true,
    });

    res.status(200).json(address);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const quantilyBill = async (req, res, next) => {
  try {
    const billUser = req.body.bill;
    const indexTotal = req.body.indexTotal;
    const method = req.body.method;
    const product = req.body.product;

    const indexBill = billUser.productsBill.findIndex(
      (item) => item.shopName === product.shopName
    );

    const indexBillProduct = billUser.productsBill[
      indexBill
    ].products.findIndex(
      (item) =>
        item.productId === product.productId && item.type === product.type
    );

    if (method === "ADD") {
      billUser.productsBill[indexBill].products[
        indexBillProduct
      ].quantilyOder += 1;
      billUser.productsBill[indexBill].totalShop += product.priceProduct;

      billUser.productsTotal[indexTotal].quantilyOder += 1;

      billUser.productsBill[indexBill].products[indexBillProduct].intoMoney +=
        product.priceProduct;
      billUser.productsTotal[indexTotal].intoMoney += product.priceProduct;
    } else if (method === "SUB") {
      billUser.productsBill[indexBill].products[
        indexBillProduct
      ].quantilyOder -= 1;
      billUser.productsTotal[indexTotal].quantilyOder -= 1;

      billUser.productsBill[indexBill].totalShop -= product.priceProduct;

      billUser.productsBill[indexBill].products[indexBillProduct].intoMoney -=
        product.priceProduct;
      billUser.productsTotal[indexTotal].intoMoney -= product.priceProduct;
    }

    const tempCost = handleTempPrice(billUser.productsTotal);
    const total = handleTempPrice(billUser.productsTotal) - billUser.discount;
    billUser.total = total;
    billUser.tempCost = tempCost;

    await BillModel.findOneAndUpdate({ _id: billUser._id }, billUser, {
      new: true,
    });

    const [bill] = await BillModel.find({ _id: billUser._id });

    res.status(200).json(bill);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const freeShipBill = async (req, res, next) => {
  try {
    const bill = req.body.bill;
    const checked = req.body.checked;
    if (checked) {
      bill.freeShip = true;
      bill.shipPriceTotal -= 30000;

      const productsBillNew = bill.productsBill.map((product) => {
        return {
          ...product,
          shipPriceOld: product.shipPrice,
          shipPrice: product.shipPrice - 30000 / bill.productsBill.length,
        };
      });

      bill.productsBill = productsBillNew;
    } else {
      bill.freeShip = false;
      bill.shipPriceTotal += 30000;

      const productsBillNew = bill.productsBill.map((product) => {
        return {
          ...product,
          shipPrice: 30000,
        };
      });

      bill.productsBill = productsBillNew;
    }

    const billNew = await BillModel.findOneAndUpdate({ _id: bill._id }, bill, {
      new: true,
    });

    res.status(200).json(billNew);
  } catch (error) {
    res.status(400).json(error);
  }
};
