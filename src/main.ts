import "dotenv/config"
import express from "express"
import cors from "cors"
import helmet from "helmet"
import http from "http"
import socketio from "socket.io"

import routes from "./routes"
import { PORT, WEB_APP_URL } from "./config"
import { RaidStreamStart, initializeRules } from "./lib/RaidStream"

const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(routes)

const server = http.createServer(app)
const io = new socketio.Server(server, {
  cors: {
    origin: WEB_APP_URL
  }
})

io.on("connection", async () => {
  console.info("Socket connected")

  await initializeRules()
  await RaidStreamStart(io)
  /* const raidStream = new RaidStream(io)

  await raidStream.start() */
})

server.listen(PORT, () => {
  console.info("API running on port " + PORT)
})