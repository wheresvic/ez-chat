// const chance = require("chance").Chance();

const ezChatSocket = (io, db) => {
  const authUserResultSocketKey = "auth-user-result";

  const socketKeys = {
    authUserResultSocketKey
  };

  io.on("connection", function(socket) {
    const socketId = socket.handshake.headers.host + "-" + socket.handshake.headers["user-agent"];
    console.log(socketId);

    socket.on("chat-message", async function(msg) {
      const savedMsg = await db.addChatMessage(msg);
      io.emit("chat-message", msg);
    });

    socket.on("get-chat-message-history", async function(msg) {
      const history = await db.getChatMessageHistory(msg);
      socket.emit("chat-message-history", history);
    });

    socket.on("auth-user", async function({ username, password }) {
      const user = await db.findUser(username);
      if (user) {
        const isValid = await db.checkPassword(password, user.passwordHash);
        socket.emit(authUserResultSocketKey, { type: "AUTH-RESULT", value: isValid });
        return;
      }

      const userAdded = await db.addUser({ username, password });
      socket.emit(authUserResultSocketKey, { type: "USER-ADD", value: userAdded });
    });
  });

  return socketKeys;
};

module.exports = ezChatSocket;
