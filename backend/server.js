import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import * as pty from "node-pty";
import cors from "cors";

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("user connected:", socket.id);
  
  // ساخت ترمینال لینوکس واقعی برای هر کاربر
  const ptyProcess = pty.spawn("bash", [], {
    name: "xterm-color",
    cols: 80,
    rows: 24,
    cwd: process.env.HOME,
    env: process.env
  });

  // خروجی سرور -> مرورگر
  ptyProcess.onData((data) => {
    socket.emit("output", data);
  });

  // ورودی مرورگر -> سرور
  socket.on("input", (data) => {
    ptyProcess.write(data);
  });

  socket.on("resize", ({ cols, rows }) => {
    ptyProcess.resize(cols, rows);
  });

  socket.on("disconnect", () => {
    ptyProcess.kill();
    console.log("user disconnected");
  });
});

httpServer.listen(3000, () => console.log("Terminal server on 3000"));
