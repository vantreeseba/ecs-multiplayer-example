const System = require('ECSEngine/systems/System');
const MessageTypes = require('ECSEngine/MessageTypes.js');
const ServerEvents = require('../ServerEvents.js');

/**
 * Physics system in ECS.
 * @extends {System}
 */
class NetworkSync extends System {
  /**
   * constructor
   */
  constructor({engine, primus}) {
    super(['networksync'], 15);

    this.primus = primus;

    primus.on('connection', function connection(spark) {
      Object.keys(MessageTypes).forEach((type) => {
        const fn = ServerEvents[type] || function(){};
        spark.on(MessageTypes[type], fn.bind({engine, spark}));
      });
    });

    primus.on('disconnection', function connection(spark){
      ServerEvents.PLAYER_DISCONNECT().bind({engine, spark})();
    });
  }

  /**
   * Run the system on the entities.
   * @param {Array} entities
   */
  update(entities) {
    this.primus.forEach((spark) => {
      spark.emit(MessageTypes.ENTITY_SYNC, entities);
    });
  }
}

module.exports = NetworkSync;
