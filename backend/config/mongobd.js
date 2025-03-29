import mongoose from "mongoose";

const connectDatabase = async () => {

    // mongoose.connection.on('connected', ()=>{
    //     console.log("DB Connected");
    // });

    // await mongoose.connect(`${process.env.MONGODB_URI}/FullEcommerce`);

    
    await mongoose.connect("mongodb://localhost:27017/Ecommerce").then((data) => {
        console.log(`Mongodb connected with data server: ${data.connection.host}`);
    })

}

export default connectDatabase;