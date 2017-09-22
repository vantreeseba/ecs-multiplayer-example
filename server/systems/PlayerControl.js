const System = require('ECSEngine/systems/System');
const MessageTypes = require('ECSEngine/MessageTypes');

/**
 * @type {PlayerControl}
 * @extends {System}
 */
class PlayerControl extends System {
  /**
   * constructor
   */
  constructor({engine, primus}) {
    super(['playercontrol', 'position', 'physics']);

    this.inputs = {};
    this.primus = primus;
  }

  /**
   * Set server input state for a player.
   * @param {Number} netId Id of player
   * @param {Object} data Key state delta.
   */
  setInput(netId, data) {
    let input = this.inputs[netId];
    if(!input) {
      this.inputs[netId] = {
        keys: data.keys || {},
        gamepad: data.gamepad || {},
        timeStamp: data.timeStamp,
      };
    } else {
      if(data.keys) {
        input.keys = Object.assign(input.keys, data.keys);
      }
      if(data.gamepad) {
        input.gamepad = Object.assign(input.gamepad, data.gamepad);
      }

      input.timeStamp = data.timeStamp;
    }
  }

  /**
   * Run the system on the entities.
   * @param {Array} entities
   */
  update(entities) {
    let entity;
    let netId;
    let acc;
    let i = 0;
    let input;

    for(; i < entities.length; i++) {
      entity = entities[i];
      netId = entity.networksync.netId;
      acc = entity.physics.acc;
      input = this.inputs[netId];

      if(!input) {
        continue;
      }

      if(input.keys) {
        if(input.keys.a){
          acc.x -=1;
        }
        if(input.keys.d) {
          acc.x +=1;
        }
        if(input.keys.w) {
          acc.y -=1;
        }
        if(input.keys.s) {
          acc.y +=1;
        }
      }

      if(input.gamepad && input.gamepad[1]){
        acc.x += input.gamepad[1].axis_0 || 0;
        acc.y += input.gamepad[1].axis_1 || 0;
      }

      // let player know we did command.
      this.primus.spark(netId).emit(7, input.timeStamp);
    }
  }
}

module.exports = PlayerControl;
