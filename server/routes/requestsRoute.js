const router = require("express").Router();
const authmiddleware = require("../middlewares/authmiddleware");
const requestsModel = require("../models/requestsModel");
const transactionsModel = require("../models/transactionsModel");
const usersModel = require("../models/usersModel");

//get all request for user

router.post("/get-all-requests-by-user", authmiddleware, async (req, res) => {
  try {
    const requests = await requestsModel
      .find({
        $or: [{ sender: req.body.userId }, { receiver: req.body.userId }],
      })
      .populate("sender")
      .populate("receiver")
      .sort({ createdAt: -1 });

    res.send({
      data: requests,
      message: "Requests fetched successfully",
      success: true,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

//send a request to another user

router.post("/send-request", authmiddleware, async (req, res) => {
  try {
    const { receiver, amount, description } = req.body;
    const request = new requestsModel({
      sender: req.body.userId,
      receiver,
      amount,
      description,
    });

    await request.save();

    res.send({
      data: request,
      message: "Request sent successfully",
      success: true,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

//update a request status

router.post("/update-request-status", authmiddleware, async (req, res) => {
  try {
    if (req.body.status === "accepted") {
      await usersModel.findByIdAndUpdate(req.body.sender._id, {
        $inc: { balance: req.body.amount },
      });

      await usersModel.findByIdAndUpdate(req.body.receiver._id, {
        $inc: { balance: -req.body.amount },
      });

      const transaction = new transactionsModel({
        sender: req.body.receiver._id,
        receiver: req.body.sender._id,
        amount: req.body.amount,
        reference: req.body.description,
        status: "success",
      });
      await transaction.save();
    }
    await requestsModel.findByIdAndUpdate(req.body._id, {
      status: req.body.status,
    });

    res.send({
      data: null,
      message: "Request status update successfully",
      success: true,
    });
  } catch (error) {
    res.send({
      data: error,
      message: "Request status update failed",
      success: false,
    });
  }
});

module.exports = router;
