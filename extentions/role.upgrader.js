var creepRoleController = require('role.controller');

var roleUpgrader = {
    /** @param {Creep} creep **/
    run: function(creep) {
        // Set role back if creep has other role before.
        if (creep.memory.role != creep.memory.temp_role) {
            var creep = creepRoleController.checkBack(creep);
        }
        // Only for creeps with upgrader role.
        if (creep.memory.role == 'upgrader') {
            if (creep.memory.charging == true) {
                creep = creepRoleController.interact_with_source(creep);
                if (creep.memory.charging == true && creep.carryCapacity == creep.carry.energy) {
                    creep = creepRoleController.fn_creem_from_source(creep);
                    creep.memory.charging  = false;
                    creep.memory.near_source = true;
                }
            }
            else {
                if (creep.memory.home_room != creep.room.name) {
                    var room_pos_name =  creep.memory.home_room;
                    var route = Game.map.findRoute(creep.room.name, room_pos_name);
                    if (route.length > 0) {
                        var exit = creep.pos.findClosestByRange(route[0].exit);
                        creep.moveTo(exit);
                    }
                }
                else {
                    if (creep.memory.near_source == true) {
                        creep.moveTo(creep.room.controller);
                         creep.memory.near_source = false;
                    }
                    else {
                        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(creep.room.controller);
                        }
                    }
                }

                if(creep.carry.energy == 0) {
                    creep.memory.charging = true;
                }
            }
        }
    }
};

module.exports = roleUpgrader;