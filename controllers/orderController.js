const express = require("express");
const router = express.Router();
const orderModel = require("../model/orderModel");
const jwt = require("jsonwebtoken");

/*Get Information about all orders*/
const getOrderInfo = async(req, res, next) => {
    try {
        //Check if user is authenticated
        const authenticatedUser = req.authenticatedUser;
        if (!authenticatedUser) {
            return res.status(403).send({ mesage: Forbidden });
        }
        if (authenticatedUser.role !== "admin") {
            return res.status(401).status({ message: Unauthorized });
        }

        const orders = await orderModel.find({});
        const resObj = {};
        resObj.numberOfOrders = orders.length;
        resObj.states = orders.reduce((obj, x) => {
            if (!obj[x.state]) obj[x.state] = 0;
            obj[x.state]++;
            return obj;
        }, {});
        return res.json({ status: true, data: resObj });
    } catch (err) {
        next(err);
    }
};

/*Get all orders*/
const getAllOrders = async(req, res) => {
    try {
        orderModel
            .find()
            .then((orders) => {
                res.status(200).json(orders);
            })
            .catch((err) => {
                console.log(err);
                res.send(err);
            });
        if (price) {
            const value = price === "asc" ? 1 : price === "desc" ? -1 : false;
            if (value)
                orders = await orderModel.find({}).sort({ total_price: value });
        } else if (date) {
            const value = date === "asc" ? 1 : date === "desc" ? -1 : false;
            console.log(value, "<-- value");
            if (value) orders = await orderModel.find({}).sort({ created_at: value });
        }
        if (!orders) orders = await orderModel.find({});

        return res.json({ status: true, orders });
    } catch (err) {
        res.send(err);
    }
};

/*Get order by id*/
const getOrderById = async(req, res) => {
    try {
        //hash the password
        req.body.password = await bcrypt.hash(req.body.password, 10);
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
        if (!orderId) {
            return res.status(404).send.json({ status: false, order: null });
        }
        return res.status(404).json({ status: true, order });
    } catch (err) {
        res.send(err);
    }
};

/*Create a new order*/
const createOrder = async(req, res) => {
    try {
        const body = req.body;

        const prices = body.items.map((item) => item.price);
        const total_price = prices.reduce((prev, curr) => {
            return prev + curr;
        }, 0);

        const orderObject = {
            items: body.items,
            created_at: new Date(),
            total_price,
        };

        const createOrder = await orderModel.create(orders);
        console.log(createOrder);
        res
            .status(201)
            .json({ message: "order created succesfully", data: createOrder });
    } catch (err) {
        return err;
    }
};

/*Update order state*/
const updateOrder = async(req, res, next) => {
    try {
        const { id } = req.params;
        const { state } = req.body;

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

        const order = await orderModel.findById(id);

        if (!order) {
            return res.status(404).json({ status: false, order: null });
        }
        if (state < order.state) {
            return res
                .status(422)
                .json({ status: false, order: null, message: "Invalid operaton" });
        }
        order.state = state;

        await order.save();

        return res.json({ status: true, order });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

/*Delete order*/
const deleteOrder = async(req, res, next) => {
    try {
        const { id } = req.params;

        // orderModel
        // .findByIdAndRemove(id)
        // .then((order) => {
        //     res.status(200).send(order);
        // })
        // .catch((err) => {
        //     console.log(err);
        //     res.status(500).send(err);
        // });

        const order = await orderModel.findOne({ _id: id });
        const deleted = await order.remove();
        if (deleted) {
            return res.status(204).json({ status: true });
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = {
    getOrderInfo,
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
};