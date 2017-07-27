;var creepRoleController = require('role.controller');
var roleHarvester = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.role == 'harvester') {
            //////////////////
            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.charged = true;
                creep.memory.skip_tower = Math.random() >= 0.5;;
            }
            if (creep.carry.energy == 0) {
                creep.memory.charged = false;
            }
            if (!creep.memory.charged) {
                var energy_needed = creep.carryCapacity - creep.carry.energy;
                if (creep.room.storage && creep.room.storage.store.energy && creep.room.storage.store.energy > energy_needed) {
                    if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    	creep.moveTo(creep.room.storage);    
                    }
                }
                else {
                    creepRoleController.interact_with_source(creep);
                }
            }
            else {
                // if (creep.room.name != creep.memory.room) {
                //     var room_pos_name =  creep.memory.room;
                //     var route = Game.map.findRoute(creep.room.name, room_pos_name);
                //     var exit = creep.pos.findClosestByRange(route[0].exit);
                //     creep.moveTo(exit);
                // }
                // else {
                    var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION ||
                                    structure.structureType == STRUCTURE_SPAWN ||
                                    structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                            }
                        });

                    creep = creepRoleController.checkIfHarvesterIsFree(creep, targets);
                    if (creep.memory.role != 'harvester') {
                        return;
                    }
                    var flag_tower_found = false;
        	        if (creep.memory.skip_tower == false) {
            	    // Search for a targets that will be a tower.
                	    for (var i in targets) {
                	        // If this is tower change flag to false and move creep to it.
                	        if (targets[i].structureType == 'tower') {
                	            if (targets[i].energy == targets[i].energyCapacity) {
                	                creep.memory.skip_tower = true;
                	                flag_tower_found = false;
                	                break;
                	            }
                                if(creep.transfer(targets[i], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(targets[i]);
                                    flag_tower_found = true;
                	                break;
                                }
                	        } 
                	    }
        	        }
                    
                    // If tower was not found find closest extension or spawn.
                    if (flag_tower_found == false && creep.memory.skip_tower == true) {
                        if(targets.length > 0) {
                            var closest = creep.pos.findClosestByPath(targets);
                            creep = creepRoleController.fn_creem_from_source(creep);
                            if(creep && creep.transfer(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(closest);
                            }
                        }
                        else {
                            creep.memory.skip_tower = false;
                        }
                    }
                //}
            }
            //////////////////
            
            // if (creep.carry.energy < creep.carryCapacity) {
            //     creep = creepRoleController.interact_with_source(creep);
    	       // //creepRoleController.fn_creep_move_to_source(creep);
            // }
            // else {
                
            // }
        }
	}
};

module.exports = roleHarvester;