var creepFunctions = require('role.functions');
var creepRoleController = require('role.controller');

var lr_harvester = {
    run: function(creep) {
        if (creep.carry.energy == creep.carryCapacity) {
            if (creep.memory.charged == false) {
                creep = creepRoleController.fn_creem_from_source(creep);
                creep.memory.loops++;
            }
            creep.memory.charged = true;
            //creep.memory.skip_tower = Math.random() >= 0.5;;
        }
        if (creep.carry.energy == 0) {
            creep.memory.charged = false;
            // Find source.
            if (creep.memory.tid == '') {
                creepFunctions.fn_assign_to_source(creep);
            }
        }
        if (!creep.memory.charged) {
            if (creep.memory.tid_room == '') {
                 creepFunctions.fn_assign_to_source(creep);
            } else {
                if (creep.room.name != creep.memory.tid_room) {
                    var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: object => object.hits < object.hitsMax
                    });
                    
                    targets.sort((a,b) => a.hits - b.hits);
                    
                    if(targets.length > 0) {
                        var broken_percentage = targets[0].hits * 100 / targets[0].hitsMax;
                       // console.log('>>> ' + broken_percentage);
                        if(broken_percentage < 30 && creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0]);    
                        }
                    }
                    
                    var route = Game.map.findRoute(creep.room.name, creep.memory.tid_room);
                    var exit = creep.pos.findClosestByPath(route[0].exit);
                    creep.moveTo(exit);
                }
                else {
                    
                    var source = Game.getObjectById(creep.memory.tid);
                    //console.log(creep.harvest(source));
                    //if (source) {
                        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(source);
                        }
                  // }
                }
            }
        }
        else {
            creep.memory.tid = '';
            if (creep.room.name != creep.memory.home_room) {
                var route = Game.map.findRoute(creep.room.name, creep.memory.home_room);
                var exit = creep.pos.findClosestByPath(route[0].exit);
                creep.moveTo(exit);
            }
            else {
                if(creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                	creep.moveTo(creep.room.storage);    
                }
            }
        }
    },
}

module.exports = lr_harvester;