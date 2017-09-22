const Utils = require('ECSEngine/utils');
const MessageTypes = require('ECSEngine/MessageTypes');

const ClientEvents = {
  PLAYER_CONNECT(data) {
  },

  PLAYER_DISCONNECT(data) {
  },

  ENTITY_SYNC(data) {
    this.engine.snapshot = data;
  },
  PONG() {
    let pingTime = (Date.now() - this.engine.pingTime - 100);
    this.engine.pingTime = Date.now();
    this.engine.ping = Utils.calculateRollingAverage(this.engine.ping, pingTime, 10);
    setTimeout(() => {
      this.primus.emit(MessageTypes.PING);
    }, 100);
  },
  PLAYER_INPUT_ACK(data) {
    console.log(data);
  }
};

module.exports = ClientEvents;
