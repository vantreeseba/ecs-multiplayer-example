class Network {
  constructor(primus) {
    this.primus = primus;
  }

  broadcast(type, data) {
  }

  send(playerId, type, data) {
    this.spark.emit(MessageTypes.PONG);
  }
}
