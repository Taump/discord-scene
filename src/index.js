// index.js (библиотека)

const Stage = require('./stage');
const Scene = require('./scene');

const { MemorySessionStore } = require('./sessionStore');

module.exports = {
  Stage,
  Scene,
  MemorySessionStore,
};
