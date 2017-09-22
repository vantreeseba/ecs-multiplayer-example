// const systems = require('ECSEngine/systems');
const systems = [];
systems.push(require('./DebugRender'));
systems.push(require('./PlayerControl'));

module.exports = systems;
