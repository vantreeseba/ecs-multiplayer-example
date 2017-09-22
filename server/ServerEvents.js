const MessageTypes = require('ECSEngine/MessageTypes');
const Player = require('ECSEngine/entities/Player');

const ServerEvents = {
  PLAYER_CONNECT() {
    const entity = this.engine.entities.find(x => x.networksync.netId === this.spark.id);
    if(!entity) {
      this.engine.addEntity(new Player(this.spark.id));
    }
  },

  PLAYER_DISCONNECT() {
    let i = this.engine.entities.findIndex(x => x.networksync.netId === this.spark.id);
    this.engine.entities.splice(i, 1);
  },

  PLAYER_INPUT_SYNC(data) {
    this.engine.systems
      .find(x => x.name === 'playercontrol')
      .setInput(this.spark.id, data);
  },
  PING() {
    this.spark.emit(MessageTypes.PONG);
  }
};

module.exports = ServerEvents;
