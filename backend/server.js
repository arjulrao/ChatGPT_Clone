require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/db/db");
const initSocketSever = require("./src/sockets/socket.server");

const httpServer = require("http").createServer(app);

connectDB();
initSocketSever(httpServer);


httpServer.listen(3000, () =>{
    console.log("Server is running at port 3000");
})

/* app.listen(3000, ()=> {
    console.log("Server is live on port 3000")
}); */
