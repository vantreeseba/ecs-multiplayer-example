const System = require('ECSEngine/systems/System');
const MessageTypes = require('ECSEngine/MessageTypes');
const Keys = require('../Keys');
const Gamepad = require('../GamepadManager');

/**
 * @type {PlayerControl}
 * @extends {System}
 */
class PlayerControl extends System {
  /**
   * constructor
   */
  constructor({primus}) {
    super(['playercontrol']);

    this.keys = new Keys();
    this.gamepad = new Gamepad();

    this.keys.update();
    this.gamepad.update();

    this.primus = primus;
  }

  /**
   * Run the system on the entities.
   * @param {Array} entities
   */
  update(entities) {
    this.keys.update();
    this.gamepad.update();

    let delta = {};
    if(this.keys.hasDelta()) {
      delta.keys = this.keys.delta;
    }
    if(this.gamepad.hasDelta()) {
      delta.gamepad = this.gamepad.delta;
    }

    if(delta.keys || delta.gamepad) {
      delta.timeStamp = Date.now();
      this.primus.emit(MessageTypes.PLAYER_INPUT_SYNC, delta);
    }
  }

}

module.exports = PlayerControl;
