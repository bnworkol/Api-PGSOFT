import express, { Request, Response } from "express"
import helmet from "helmet"
import cors from "cors"
import fs from "fs"
import https from "https"
import http from "http"
import logger from "./logger/index"
import routes from "./routes"
import * as figlet from "figlet"
import path from "path"
import { Server, Socket } from "socket.io"

import allfunctions from "./functions/allfunctions"
import { emitirEventoInterno, adicionarListener } from "./serverEvents"
import "dotenv/config"

const privateKey = fs.readFileSync("server.key", "utf8")
const certificate = fs.readFileSync("server.crt", "utf8")
const credentials = {
   key: privateKey,
   cert: certificate,
}
const app = express()
const httpserver = https.createServer(credentials, app)
const httserver = http.createServer(app)
const io = new Server(httpserver)

console.log(figlet.textSync("API DE JOGOS JOHN"), "\n")

declare module "express-serve-static-core" {
   interface Request {
      io: Server
   }
}
const users = new Map<string, any>()

declare module "express-session" {
   export interface SessionData {
      steps: any
   }
}

io.on("connection", async (socket: Socket) => {
   console.log("Usuário Conectado")

   socket.on("join", async (socket1) => {
      const token: any = socket1.token
      const gameid: any = socket1.gameId

      setInterval(async function () {
         const user = await allfunctions.getuserbytoken(token)

         if (!user[0]) {
            socket.disconnect(true)
            return false
         }

         const retornado = user[0].valorganho
         const valorapostado = user[0].valorapostado

         const rtp = Math.round((retornado / valorapostado) * 100)

         if (isNaN(rtp) === false) {
            await allfunctions.updatertp(token, rtp)
         }
      }, 10000)
   })

   adicionarListener("attganho", async (dados) => {
      users.forEach(async (valor, chave) => {
         let newvalue = parseFloat(users.get(socket.id).aw) + dados.aw
         users.set(socket.id, {
            aw: newvalue,
         })
      })
      emitirEventoInterno("awreceive", {
         aw: users.get(socket.id).aw,
      })
   })

   adicionarListener("att", (dados) => {
      users.forEach((valor, chave) => {
         if (valor.token === dados.token) {
            return false
         } else {
            users.set(socket.id, {
               token: dados.token,
               username: dados.username,
               bet: dados.bet,
               saldo: dados.saldo,
               rtp: dados.rtp,
               agentid: dados.agentid,
               socketid: socket.id,
               gamecode: dados.gamecode,
               aw: 0,
            })
         }
      })

      if (Object.keys(users).length === 0) {
         users.set(socket.id, {
            token: dados.token,
            username: dados.username,
            bet: dados.bet,
            saldo: dados.saldo,
            rtp: dados.rtp,
            agentid: dados.agentid,
            socketid: socket.id,
            gamecode: dados.gamecode,
            aw: 0,
         })
      }
   })

   socket.on("disconnect", (reason) => {
      users.delete(socket.id)

      console.log("Cliente desconectado:", reason)
   })
})

app.use(cors({ credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/", express.static(path.join(__dirname, "public")))

app.use(
   helmet.contentSecurityPolicy({
      useDefaults: false,
      directives: {
         "Access-Control-Allow-Credentials": "true",
         "default-src": ["'none'"],
         "base-uri": "'self'",
         "font-src": ["'self'", "https:", "data:"],
         "frame-ancestors": ["'self'"],
         "img-src": ["'self'", "data:"],
         "object-src": ["'none'"],
         "script-src": ["'self'", "https://cdnjs.cloudflare.com"],
         "script-src-attr": "'none'",
         "style-src": ["'self'", "https://cdnjs.cloudflare.com"],
      },
   }),
)

// Middleware para adicionar o socket.io em cada requisição
app.use((req: Request, res: Response, next) => {
   req.io = io // Adiciona o socket.io ao objeto req
   next()
})

app.use("/status", (req, res) => {
   res.json({ status: "operational" })
})
app.use(routes)

httpserver.listen(443, () => {
   logger.info("SERVIDOR INICIADO JOHNGAMES " + 443)
})
httserver.listen(process.env.PORT, () => {
   logger.info("SERVIDOR INICIADO JOHNGAMES " + process.env.PORT)
})
console.log("Welcome to PGSoft Treasure Aztec Calculator Project!");

// Function to update the iframe src based on the game URL input.
function loadGame() {
  const gameUrlInput = document.getElementById("game-url") as HTMLInputElement;
  const gameFrame = document.getElementById("game-frame") as HTMLIFrameElement;
  if (gameUrlInput && gameFrame) {
    gameFrame.src = gameUrlInput.value;
  }
}

// Simulated function to calculate the win percentage.
// In a production scenario, you may analyze API data from the game.
// Here it uses a random value plus a bonus based on the bet price.
function calculateWinPercentage(bet: number): number {
  const baseChance = Math.random() * 100; // random base chance (0-100%)
  const bonus = bet * 0.1;               // simple bonus multiplier
  return Math.min(baseChance + bonus, 100);
}

// Simulated function to auto-play the game when win percentage exceeds 70%.
// Here, it just displays a message. In reality, you might trigger an API or postMessage.
function autoPlayGame(bet: number): void {
  console.log(`Auto-playing game with bet: ${bet}`);
  const outputEl = document.getElementById("output");
  if (outputEl) {
    outputEl.innerText = "Auto Play Triggered: Game started with bet " + bet;
  }
}

// Set up event listener for the "Start Program" button.
document.getElementById("start-program")?.addEventListener("click", () => {
  // Load the game URL into the iframe.
  loadGame();

  const betInput = document.getElementById("bet-price") as HTMLInputElement;
  const betValue = Number(betInput?.value);

  if (!betValue || betValue <= 0) {
    alert("Please enter a valid bet price");
    return;
  }
  
  console.log("Start Program button clicked with bet:", betValue);
  const outputEl = document.getElementById("output");

  // Start a continuous loop: calculate win percentage every second.
  const intervalId = setInterval(() => {
    const winPercentage = calculateWinPercentage(betValue);
    console.log(`Calculated Win Percentage: ${winPercentage.toFixed(2)}%`);
    if (outputEl) {
      outputEl.innerText = `Win Percentage: ${winPercentage.toFixed(2)}%`;
    }
    
    // If win percentage exceeds 70%, trigger auto-play.
    if (winPercentage > 70) {
      autoPlayGame(betValue);
      // Optionally, if you wish to stop after triggering auto-play once, uncomment the next line.
      // clearInterval(intervalId);
    }
  }, 1000); // Check every second

  // Clear the interval when the page is unloaded.
  window.addEventListener("beforeunload", () => {
    clearInterval(intervalId);
  });
});
