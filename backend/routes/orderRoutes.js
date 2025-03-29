import exprss from 'express';
import { allOrders, placeOrder, placeOrderRazorpay, placeOrderStripe, updateStatus, userOrders, verifyRazorpay, verifyStripe } from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = exprss.Router();

// Admin Features
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

// Payment Feature
orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/stripe', authUser, placeOrderStripe);
orderRouter.post('/razorpay', authUser, placeOrderRazorpay);

// User Feature
orderRouter.post('/userorders', authUser, userOrders);


// Verify Payment
orderRouter.post('/verifyStripe', authUser, verifyStripe);
orderRouter.post('/verifyRazorpay', authUser, verifyRazorpay);

export default orderRouter;