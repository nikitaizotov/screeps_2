var creepRoleController = require('role.controller');

var roleTech = {
    run: function(creep) {
        if (creep.carry.energy == creep.carryCapacity) {
            creep = creepRoleController.fn_creem_from_source(creep);
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
                filter: object => object.hits < object.hitsMax
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