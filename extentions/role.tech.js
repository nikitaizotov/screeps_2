var creepRoleController = require('role.controller');

var roleTech = {
    run: function(creep) {
        if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.charged = true;
        }
        if (creep.carry.energy == 0) {
            creep.memory.charged = false;
        }
        if (!creep.memory.charged) {
            creepRoleController.interact_with_source(creep);
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_ROAD;
                    }
            });

            targets.sort((a,b) => a.hits - b.hits);

            if(targets.length > 0) {
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        }
    }
}

module.exports = roleTech;