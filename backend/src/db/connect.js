import { connect, disconnect} from "mongoose";

const MONGOOSE_URL = process.env.MONGOOSE_URL;
const DB_Name = process.env.DB_Name;
export async function connectDb(){
    try {
        await connect(MONGOOSE_URL); // Ajout de await
    } catch (err) {
    }
}

export async function disconnectDb(){
    disconnect(MONGOOSE_URL)
}