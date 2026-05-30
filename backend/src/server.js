import app from "./app.js";
import { connectDb } from "./db/connect.js";
import http from "http";
import { Server } from "socket.io";
import { listQuotes } from "./services/quotes.service.js";
import { listComments } from "./services/comments.service.js";
import { listLikes } from "./services/likes.service.js";

const PORT = process.env.PORT ?? 4000;
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: frontendUrl,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});

app.set("socketio", io);

await connectDb();

server.listen(PORT, () => {
  console.log(`Serveur et WebSockets demarres sur http://localhost:${PORT}`);
});

io.on("connection", async (socket) => {
  console.log("Client connecté:", socket.id);

  // Ici, on récupère les données initiales
  try {
    const allQuotes = await listQuotes();    
    socket.emit("initial_quotes", allQuotes);
    const allComments = await listComments();
    socket.emit("initial_comments", allComments.items);
    const allLikes = await listLikes();
    socket.emit("initial_likes", allLikes);
  } catch (err) {
    console.error("Erreur chargement initial socket:", err);
  }
});
