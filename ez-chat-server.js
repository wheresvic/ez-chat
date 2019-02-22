const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const fse = require("fs-extra");

const http = require("http");
const socketIo = require("socket.io");

const ezChatSocket = require("./ez-chat-server/ez-chat-socket");
const ezChatDb = require("./ez-chat-server/ez-chat-db");

const port = process.env.EZ_CHAT_PORT || 9876;
const env = process.env.NODE_ENV || "development";

const wrap = fn => {
  return async function(req, res, next) {
    let e = null;
    try {
      await fn(req, res, next);
    } catch (err) {
      e = err;
      next(err);
    }

    if (!e) {
      next();
    }
  };
};

const logger = {
  info: msg => {
    console.log(msg);
  }
};

const main = async () => {
  const app = express();
  const httpServer = http.Server(app);

  const dbPath = path.join(__dirname, "db");
  fse.ensureDirSync(dbPath);
  const db = await ezChatDb({ dbPath });

  initIo(httpServer, db);

  // api.use(morgan("combined", { stream: LogService.stream }));
  app.use(morgan("combined"));

  /*
   * Helmet is actually just a collection of nine smaller middleware functions that set security-related HTTP headers:
   * - `csp` sets the Content-Security-Policy header to help prevent cross-site scripting attacks and other cross-site injections.
   * - `hidePoweredBy` removes the X-Powered-By header.
   * - `hpkp` Adds Public Key Pinning headers to prevent man-in-the-middle attacks with forged certificates.
   * - `hsts` sets Strict-Transport-Security header that enforces secure (HTTP over SSL/TLS) connections to the server.
   * - `ieNoOpen` sets X-Download-Options for IE8+.
   * - `noCache` sets Cache-Control and Pragma headers to disable client-side caching.
   * - `noSniff` sets X-Content-Type-Options to prevent browsers from MIME-sniffing a response away from the declared content-type.
   * - `frameguard` sets the X-Frame-Options header to provide clickjacking protection.
   * - `xssFilter` sets X-XSS-Protection to enable the Cross-site scripting (XSS) filter in most recent web browsers.
   */
  app.use(helmet());

  app.use(express.static("build"));

  app.use((req, res) => {
    res.status(404).send();
  });

  httpServer.listen(port, () => {
    logger.info(`Ez-chat running in ${env} listening on ${port}`);
  });
};

const initIo = (httpServer, db) => {
  const io = socketIo(httpServer);
  // io.origins(["http://localhost:3000"]);

  ezChatSocket(io, db);
};

main();
