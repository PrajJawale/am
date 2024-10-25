import mongoose from "mongoose";
type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log(connection.isConnected)
        console.log("Connected")
        return
    }

    try {

       const db =  await mongoose.connect(process.env.MONGODB_URI || '')
       connection.isConnected = db.connections[0].readyState
       console.log("Connected Successfull")
    } catch (eror) {
       console.log("Connection Failed")
       process.exit()
    }
}

export default dbConnect;