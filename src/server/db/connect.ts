import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {};

export async function connect(): Promise<void> {
    if (connection.isConnected) {
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI ?? '');

        connection.isConnected = db.connections[0].readyState;

    } catch (error) {
        console.log("Error connecting to database: ", error);
        process.exit(1);
    }
}

export default connection;