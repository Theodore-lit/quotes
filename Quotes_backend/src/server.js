import app from "./app.js"
import {connectDb} from "./db/connect.js"

const PORT = process.env.PORT ?? 4000
await connectDb()

app.listen(PORT, ()=> {
    console.log(`Serveur démarré sur http://localhost:${PORT}`)
})