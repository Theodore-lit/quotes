import { connect, disconnect} from "mongoose";

const MONGOOSE_URL = process.env.MONGOOSE_URL;
const DB_Name = process.env.DB_Name;
export async function connectDb(){
    try {
        await connect(MONGOOSE_URL); // Ajout de await
        console.log("Database connected", { dbName: DB_Name });
    } catch (err) {
        console.error("Erreur de connexion DB:", err);
    }
}

export async function disconnectDb(){
    disconnect(MONGOOSE_URL)
}