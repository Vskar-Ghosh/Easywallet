const router = require("express").Router();
const authMiddleware = require("../middlewares/authmiddleware");
const transactionsModel = require("../models/transactionsModel");
const usersModel = require("../models/usersModel");

const stripe = require("stripe")(process.env.stripe_key);
const { v4: uuidv4 } = require("uuid");

//transfer money from on acount to another
router.post("/transfer-funds", authMiddleware, async (req, res) => {
  try {
    //save the transaction
    const newTransacion = new transactionsModel(req.body);
    await newTransacion.save();

    //decress the sender balance
    await usersModel.findByIdAndUpdate(req.body.sender, {
      $inc: { balance: -req.body.amount },
    });

    //incress the receiver balance
    await usersModel.findByIdAndUpdate(req.body.receiver, {
      $inc: { balance: req.body.amount },
    });

    res.send({
      message: "Transaction successful",
      success: true,
      data: newTransacion,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Transaction failed",
      data: error.message,
    });
  }
});

//verify receiver account number
router.post("/verify-account", authMiddleware, async (req, res) => {
  try {
    const user = await usersModel.findOne({ _id: req.body.receiver });
    if (user) {
      res.send({
        message: "Account verified",
        data: user,
        success: true,
      });
    } else {
      res.send({
        message: "Account not found",
        data: null,
        success: false,
      });
    }
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//get all transactions for a user

router.get(
  "/get-all-transactions-by-user",
  authMiddleware,
  async (req, res) => {
    try {
      const transaction = await transactionsModel
        .find({
          $or: [{ sender: req.body.userId }, { receiver: req.body.userId }],
        })
        .sort({ createdAt: -1 })
        .populate("sender")
        .populate("receiver");
      res.send({
        message: "Transactions fetched",
        data: transaction,
        success: true,
      });
    } catch (error) {
      res.send({
        message: error.message,
        success: false,
      });
    }
  }
);

//deposit funds using stripe
router.post("/deposit-funds", authMiddleware, async (req, res) => {
  try {
    const { token, amount } = req.body;

    //create a customer
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    //create a charge
    const charge = await stripe.charges.create(
      {
        amount: amount * 100,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: "deposit to easywalet",
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    //save the transaction

    if (charge.status === "succeeded") {
      const newTransaction = new transactionsModel({
        sender: req.body.userId,
        receiver: req.body.userId,
        amount: amount,
        type: "deposit",
        reference: "stripe deposite",
        status: "success",
      });
      await newTransaction.save();

      //increase the user's balance
      await usersModel.findByIdAndUpdate(req.body.userId, {
        $inc: { balance: amount },
      });
      res.send({
        message: "Transaction successful",
        data: charge,
        success: true,
      });
    } else {
      res.send({
        message: "Transaction failed",
        data: charge,
        success: false,
      });
    }
  } catch (error) {
    res.send({
      message: "Transactions failed",
      data: error.message,
      success: false,
    });
    console.log(error);
  }
});

module.exports = router;
