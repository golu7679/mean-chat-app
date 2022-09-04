const socket = require("socket.io");
const Message = require("../models/message");
const config = require("../config");

const users = [];
const connections = [];

const initialize = server => {
  const io = socket(server, { path: config.chatPath, cors: { origin: "*" } });

  io.on("connection", socket => {
    connections.push(socket);
    socket.join("chat-room");

    socket.emit("welcome", {
      msg: "Welcome to the chat server!",
    });

    socket.on("email", data => {
      if (data.email) {
        socket.email = data.email;
        let user = { email: socket.email, id: socket.id };
        let existing = searchUser(user.email);
        if (existing === false) {
          users.push(user);
        }

        io.emit("active", users);
        console.log("[%s] connected", socket.email);
        console.log("<users>:", users);
      }
    });

    socket.on("getactive", () => {
      socket.emit("active", users);
    });

    socket.on("message", data => {
      if (data.to === "") {
        socket.broadcast.to("chat-room").emit("message", data.message);
      } else {
        let user = searchUser(data.to);
        if (user !== false) {
          let instances = searchConnections(data.to);
          if (instances.length > 0) {
            for (let instance of instances) {
              socket.broadcast.to(instance.id).emit("message", data.message);
            }
            let myOtherInstances = searchConnections(socket.email);
            if (myOtherInstances.length > 1) {
              for (let conn of myOtherInstances) {
                // exclude me
                if (conn !== socket) {
                  socket.broadcast.to(conn.id).emit("message", data.message);
                }
              }
            }
          }
        }
      }
      console.log("[%s].to(%s)<< %s", data.message.from, data.to, data.message.text);

      // save the message to the database
      let message = new Message(data.message);
      Message.addMessage(message, (err, newMsg) => {});
    });

    socket.on("disconnect", () => {
      let instances = searchConnections(socket.email);
      if (instances.length === 1) {
        let user = searchUser(socket.email);
        if (user !== false) {
          users.splice(users.indexOf(user), 1);
        }
      }

      io.emit("active", users);
      console.log("[%s] disconnected", socket.email);
      console.log("<users>:", users);

      let connIndex = connections.indexOf(socket);
      if (connIndex > -1) {
        connections.splice(connIndex, 1);
      }
    });
  });
};

const searchUser = email => {
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email) {
      return users[i];
    }
  }
  return false;
};

const searchConnections = email => {
  let found = [];
  for (let conn of connections) {
    if (conn.email === email) {
      found.push(conn);
    }
  }

  if (found.length > 0) {
    return found;
  } else {
    return false;
  }
};

module.exports = initialize;
