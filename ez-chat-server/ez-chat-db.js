const Datastore = require("nedb");
const path = require("path");
const bluebird = require("bluebird");
const uuid = require("uuid/v1");
const bcrypt = require("bcrypt");
const moment = require("moment");
const ezChatError = require("./EzChatError");

const EzChatError = ezChatError.EzChatError;
const EzChatErrorCodes = ezChatError.EzChatErrorCodes;

const mongoSanitize = v => {
  if (v instanceof Object) {
    for (var key in v) {
      if (/^\$/.test(key)) {
        delete v[key];
      }
    }
  }
  return v;
};

const checkPassword = (password, passwordHash) => {
  return bcrypt.compare(password, passwordHash).then(res => {
    return res;
  });
};

module.exports = async config => {
  const dbChatMessages = new Datastore({ filename: path.join(config.dbPath, "chat-messages.json"), autoload: true });
  const dbChatMessagesPromisified = bluebird.promisifyAll(dbChatMessages);

  const dbUsers = new Datastore({ filename: path.join(config.dbPath, "users.json"), autoload: true });
  const dbUsersPromisified = bluebird.promisifyAll(dbUsers);

  try {
    await dbUsersPromisified.ensureIndexAsync({ fieldName: "username", unique: true });
  } catch (err) {
    throw err;
  }

  return {
    addChatMessage: chatMessage => {
      if (!chatMessage.when) {
        chatMessage.when = moment().unix();
      }
      if (!chatMessage.from) {
        chatMessage.from = "anon";
      }
      if (chatMessage.message === null || chatMessage.message === undefined) {
        chatMessage.message = "";
      }

      chatMessage = mongoSanitize(chatMessage);
      chatMessage._id = uuid();
      chatMessage.when = +chatMessage.when;

      return dbChatMessagesPromisified.insertAsync(chatMessage);
    },
    removeAllChatMessages: () => {
      return dbChatMessagesPromisified.removeAsync({}, { multi: true });
    },
    findUser: username => {
      if (!username) {
        return Promise.reject(new EzChatError(EzChatErrorCodes["MISSING-INPUT-DATA"]));
      }

      return dbUsersPromisified.findAsync({ username }).then(docs => {
        if (docs.length) {
          return docs[0];
        }
        return null;
      });
    },
    addUser: user => {
      if (!user.username || !user.password) {
        return Promise.reject(new EzChatError(EzChatErrorCodes["MISSING-INPUT-DATA"]));
      }

      user = mongoSanitize(user);
      user._id = uuid();

      return dbUsersPromisified.findAsync({ username: user.username }).then(docs => {
        if (docs.length) {
          throw new EzChatError(EzChatErrorCodes["DUPLICATE-USER"]);
        }

        return bcrypt.hash(user.password, 5).then(hash => {
          user.passwordHash = hash;
          delete user.password;
          return dbUsersPromisified.insertAsync(user);
        });
      });
    },
    removeAllUsers: () => {
      return dbUsersPromisified.removeAsync({}, { multi: true });
    },
    authUser: (username = "", password = "") => {
      return dbUsers.findAsync({ username }).then(docs => {
        if (!docs.length) {
          return false;
        }
        return checkPassword(password, docs[0].passwordHash);
      });
    },
    checkPassword,
    getChatMessageHistory: ({ fromTime, limit }) => {
      const sanitizedFromTime = +mongoSanitize(fromTime);
      const sanitizedLimit = +mongoSanitize(limit);

      return new Promise((resolve, reject) => {
        try {
          dbChatMessagesPromisified
            .find({ when: { $lt: sanitizedFromTime } })
            // .find({})
            .sort({ when: 1 })
            .limit(sanitizedLimit)
            .exec((err, docs) => {
              if (err) {
                reject(err);
                return;
              }
              resolve(docs);
            });
        } catch (err) {
          reject(err);
        }
      });
    }
  };
};
