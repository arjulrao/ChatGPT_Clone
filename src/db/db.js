const mongoose = require('mongoose');

/* function connectDB(){
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=> {
        console.log("Connect To DB")
    })
    .catch((err)=>{
        console.log(err)
    })
} */

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)

        console.log("Connect to DB")
    } catch (err) {
        console.log("MongoDB is not Connect", err)
    }
    
}

module.exports = connectDB