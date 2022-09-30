const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "Some Bot";

// Run when client connects
io.on("connection", (socket) => {
  console.log("connected with flutter");
  socket.on("joinRoom", ({ username, room1, room2 }) => {
    console.log("room joined");
    console.log(username);
    console.log(room1);
    console.log(room2);

    // if (Number(room1) < Number(room2)) {

    const user = userJoin(socket.id, username, room1, room2);
    socket.join(user.room1, user.room2);

    // Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to Chat Server"));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room1, user.room2)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room1, user.room2).emit("roomUsers", {
      room1: user.room1,
      room2: user.room2,
      users: getRoomUsers(user.room1, user.room2),
    });
    // } else {
    //   console.log("hello from else part");
    //   let s = room1;
    //   room1 = room2;
    //   room2 = s;
    //   const user = userJoin(socket.id, username, room1, room2);
    //   socket.join(user.room1, user.room2);

    //   // Welcome current user
    //   socket.emit("message", formatMessage(botName, "Welcome to Chat Server"));

    //   // Broadcast when a user connects
    //   socket.broadcast
    //     .to(user.room1, user.room2)
    //     .emit(
    //       "message",
    //       formatMessage(botName, `${user.username} has joined the chat`)
    //     );

    //   // Send users and room info
    //   io.to(user.room1, user.room2).emit("roomUsers", {
    //     room1: user.room1,
    //     room2: user.room2,
    //     users: getRoomUsers(user.room1, user.room2),
    //   });
    // }
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    console.log(msg);
    const user = getCurrentUser(socket.id);

    console.log(user.room1);
    console.log(user.room2);

    //! commented below line because it was sending to both the users........
    // io.to(user.room1, user.room2).emit(
    //   "message",
    //   formatMessage(user.username, msg)
    // );

    io.to(user.room2).emit("message", formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room1, user.room2).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room1, user.room2).emit("roomUsers", {
        room1: user.room1,
        room2: user.room2,
        users: getRoomUsers(user.room1, user.room2),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
