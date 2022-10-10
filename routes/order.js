const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const controller = require("../controllers/orderController");
const orderModel = require("../model/orderModel");
const authenticate = require("../middlewares/authenticate");
const { loginUser } = require("../controllers/userController");
const order = require("../model/orderModel");

const router = express.Router();

const { createOrder, getAllOrders, getOrderById, getOrderInfo } = controller;
router.get("/", (req, res) => {
    orderModel
        .find()
        .then((orders) => {
            res.status(200).json(orders);
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        });
});

router.get("/:id", (req, res) => {
    const id = req.params.id;
    orderModel
        .findById(id)
        .then((orders) => {
            res.status(200).send(orders);
        })
        .catch((err) => {
            console.log(err);
            res.status(404).send(err);
        });
});

router.post("/", (req, res) => {
    const orders = req.body;
    orders.lastUpdateAt = new Date();
    orderModel
        .create(orders)
        .then((orders) => {
            res.status(201).send(orders);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send(err);
        });
});

router.put("/:id", (req, res) => {
    const id = req.params.id;
    const order = req.body;
    order.lastUpdateAt = new Date();
    orderModel
        .findOneAndUpdate(id, order, { new: true })
        .then((newOrder) => {
            res.status(200).send(newOrder);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send(err);
        });
});

router.delete("/:id", (req, res) => {
    const id = req.params.id;
    orderModel
        .findByIdAndRemove(id)
        .then((order) => {
            res.status(200).send(order);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send(err);
        });
});
/* Getting Info about all ordrs */
router.get("/info").get(authenticate, controller.getOrderInfo);

/*Getting all orders
and
Creating new orders
*/
// orderRouter.get("/", authenticate, controller.getAllOrders);

router.post("/", authenticate, createOrder);

/**Get order by id */
// orderRouter.route("/:orderId").get(authenticate, controller.getOrderById);

/*Update order state and Delete order by ID*/

// orderRouter
//     .route("/:id")
// .patch(authenticate, controller.updateOrder)
// .delete(authenticate, controller.deleteOrder);

module.exports = router;