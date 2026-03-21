import { connect, disconnect} from "mongoose";

const MONGOOSE_URL = process.env.MONGOOSE_URL;
const DB_Name = process.env.DB_Name;
export async function connectDb(){
    connect(MONGOOSE_URL)
    console.log("Database connected", {dbName: process.env.DB_Name})
}

export async function disconnectDb(){
    disconnect(MONGOOSE_URL)
    // console.log("Database disconnected", {dbName: DB_Name})
}