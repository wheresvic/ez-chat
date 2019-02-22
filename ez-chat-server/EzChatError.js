const EzChatErrorCodes = Object.freeze({
  "DUPLICATE-USER": {
    code: "DUPLICATE-USER",
    message: "duplicate user"
  },
  "MISSING-INPUT-DATA": {
    code: "MISSING-INPUT-DATA",
    message: "missing input data"
  }
});

class EzChatError extends Error {
  constructor({ code }) {
    // Calling parent constructor of base Error class.
    super(code);

    // Saving class name in the property of our custom error as a shortcut.
    this.name = this.constructor.name;
    this.code = code;
  }
}

module.exports.EzChatError = EzChatError;
module.exports.EzChatErrorCodes = EzChatErrorCodes;
