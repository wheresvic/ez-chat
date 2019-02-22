const expect = require("chai").expect;
const path = require("path");

const ezChatDb = require("./ez-chat-db");
const ezChatError = require("./EzChatError");
// const EzChatError = ezChatError.EzChatError;
const EzChatErrorCodes = ezChatError.EzChatErrorCodes;

const testDbPath = path.join(__dirname, "..", "test-db");

describe("ezChatDb", function() {
  let sut = null;

  beforeEach(async function() {
    sut = await ezChatDb({ dbPath: testDbPath });
    await sut.removeAllChatMessages();
    await sut.removeAllUsers();
  });

  it("should add a chat message", async function() {
    // when
    const chatMessage = { from: "test", when: new Date().getTime() / 1000, message: "bla bla" };
    const result = await sut.addChatMessage(chatMessage);

    // then
    // console.log(result);
    expect(result._id.length).to.be.above(0);
    expect(result.from).to.equal(chatMessage.from);
    expect(result.when).to.equal(chatMessage.when);
    expect(result.message).to.equal(chatMessage.message);
  });

  it("should get chat message history", async function() {
    // given
    const chatMessages = [
      { from: "test", when: 101, message: "bla bla" },
      { from: "test", when: 201, message: "bla bla" },
      { from: "test", when: 301, message: "bla bla" },
      { from: "test", when: 401, message: "bla bla" }
    ];

    for (const cm of chatMessages) {
      await sut.addChatMessage(cm);
    }

    // when
    const result = await sut.getChatMessageHistory({ fromTime: 301, limit: 2 });

    // then
    expect(result.length).to.equal(2);
    expect(result[0].when).to.equal(101);
    expect(result[1].when).to.equal(201);
  });

  describe("user", function() {
    it("should add a user", async function() {
      // given
      const user = {
        username: "abc",
        password: "123"
      };

      // when
      const result = await sut.addUser(user);

      // then
      expect(result._id.length).to.be.above(0);
      expect(result.passwordHash.length).to.be.above(0);
      expect(result.password).to.be.undefined;
    });

    it("should not add a user with duplicate username", async function() {
      // given
      const user1 = {
        username: "abc",
        password: "123"
      };
      const user2 = {
        username: "abc",
        password: "1234"
      };
      await sut.addUser(user1);

      // when
      try {
        await sut.addUser(user2);
      } catch (err) {
        // then
        if (err.name === "EzChatError" && err.code === EzChatErrorCodes["DUPLICATE-USER"].code) {
          return;
        }
      }

      expect.fail("Should not have succeeded in adding a user!");
    });

    it("should not add a user with missing username", async function() {
      // given
      const user = {
        password: "123"
      };

      // when
      try {
        await sut.addUser(user);
      } catch (err) {
        // then
        if (err.name === "EzChatError" && err.code && err.code === EzChatErrorCodes["MISSING-INPUT-DATA"].code) {
          return;
        }
      }

      expect.fail("Should not have succeeded in adding a user!");
    });

    it("should not add a user with missing password", async function() {
      // given
      const user = {
        username: "abc"
      };

      // when
      try {
        await sut.addUser(user);
      } catch (err) {
        // then
        if (err.name === "EzChatError" && err.code && err.code === EzChatErrorCodes["MISSING-INPUT-DATA"].code) {
          return;
        }
      }

      expect.fail("Should not have succeeded in adding a user!");
    });

    it("should authenticate user when password correct", async function() {
      // given
      const user = {
        username: "abc",
        password: "123"
      };
      await sut.addUser(user);

      // when
      const result = await sut.authUser("abc", "123");

      // then
      expect(result).to.be.true;
    });

    it("should not authenticate user when password incorrect", async function() {
      // given
      const user = {
        username: "abc",
        password: "123"
      };
      await sut.addUser(user);

      // when
      const result = await sut.authUser("abc", "1234");

      // then
      expect(result).to.be.false;
    });

    it("should not authenticate user for missing username", async function() {
      // given
      const user = {
        username: "abc",
        password: "123"
      };
      await sut.addUser(user);

      // when
      const result = await sut.authUser("abcd", "1234");

      // then
      expect(result).to.be.false;
    });
  });
});
