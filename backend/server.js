import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDatabase from './config/mongobd.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import productRouter from './routes/productRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import orderRouter from './routes/orderRoutes.js';

// App Config
const app = express();
const port = process.env.PORT || 4000;

connectDatabase();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());

// Api Endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

app.get('/',(req,res)=>{
    res.send("Api Working");
});


app.listen(port, ()=> console.log('Server started on PORT : http://localhost:' + port));