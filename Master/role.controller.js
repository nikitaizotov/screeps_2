/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.controller');
 * mod.thing == 'a thing'; // true
 */

// // Save settings to game memory.
// var spawns = _.filter(Game.spawns);
// var spawn = spawns[0];

// // Clean spurces.
// for (var sid in spawn.memory.sources) {
//     for (var n in spawn.memory.sources[sid]) {
//         var creep_name = spawn.memory.sources[sid][n];
//         var flag_found = false;
//         for(var name in Memory.creeps) {
//             if (creep_name == name) {
//                 flag_found = true;
//             }
//         }
//         if (flag_found == false) {
//             delete spawn.memory.sources[sid].splice(n,1);
//         }
//     }
// }

var roleController = {
    fn_creep_move_to_source: function(creep) {
        if (creep.memory.tid) {
            var source = Game.getObjectById(creep.memory.tid);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }  
    },
    // Will not getObjectById
    fn_creem_from_source: function(creep) {
        var sid = creep.memory.tid;
        if (Memory.logistics.sources[sid]) {
            var index = Memory.logistics.sources[sid].indexOf(creep.name);
            Memory.logistics.sources[sid].splice(index, 1);
        }
        creep.memory.tid = '';
        return creep;
    },
    // Check if creep is in the given souce list.
    // Will return true if found or false.
    check_creep_sources: function(creep, sid) {
        if (creep.room.memory.sources[sid]) {
            var list = creep.room.memory.sources[sid];
            // Run over the elements and search for a name.
            for (var index in list) {
               if (list[index] == creep_name) {
                   return true;
               }
            }
        }
        return false;
    },
    interact_with_source: function(creep) {
        // If creep is having something inside of tid - he have his source.
        if (creep.memory.tid == '') {
            var sources = creep.room.find(FIND_SOURCES);
            var closest = creep.pos.findClosestByPath(sources);
            // Junp to closest source.
            if (closest && Memory.logistics.sources[closest.id].length < 3) {
                Memory.logistics.sources[closest.id].push(creep.name);
                creep.memory.tid = closest.id;
                creep.memory.tid_room = creep.room.name;
                creep.memory.home_room = creep.room.name;
            }
            else {
                for (var sid in Memory.logistics.rooms[creep.room.name].sources) {
                    // If he is here, closest source is busy, find others.
                    if (Memory.logistics.sources[sid].length < 3) {
                        Memory.logistics.sources[sid].push(creep.name);
                        creep.memory.tid = sid;
                        creep.memory.tid_room = creep.room.name;
                        //creep.memory.home_room = creep.room.name;
                        break;
                    }
                }
            }
            //if (creep.memory.tid == '') {
            //    var flag_found = false;
            //    for (var room in creep.room.memory.connected) {
            //        if (creep.room.memory.connected[room].danger != 0) {
            //            continue;
            //        }
            //        for (var sid in creep.room.memory.connected[room].sources) {
            //            if (creep.room.memory.connected[room].sources[sid].length < 1) {
            //                creep.room.memory.connected[room].sources[sid].push(creep.name);
            //                creep.memory.tid = sid;
            //                creep.memory.tid_room = room;
            //                creep.memory.home_room = creep.room.name;
            //                flag_found = true;
            //                break;
            //            }
            //        }
            //        if (flag_found == true) {
            //            break;
            //        }
            //    }
            //}
        }
        else {
            // Move to source.
            if (creep.room.name == creep.memory.tid_room) {
                var source = Game.getObjectById(creep.memory.tid);
                if (source) {
                    if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source);
                    }
                }
            }
            //else {
            //    ///creep.memory.
            //    //var end_room_pos = new RoomPosition(10, 25, 'sim');
            //    ////////////////
            //    var home_room
            //    var end_room_pos = new RoomPosition(10, 25, 'sim');
            //    /////////
            //    //var room_pos_name =  creep.memory.tid_room;
            //    //var route = Game.map.findRoute(creep.room.name, room_pos_name);
            //    //var exit = creep.pos.findClosestByRange(route[0].exit);
            //    //creep.moveTo(exit);
            //}
        }
        return creep;
    },
    checkIfHarvesterIsFree: function(creep, targets) {
        if (targets.length == 0) {
            console.log('Role switched to upgrader for ' + creep.name);
            creep.memory.role = "upgrader";
            creep.memory.charging = true;
        }
        return creep;
    },
    checkBack: function(creep) {
        // Switch back to original role.
        var target = this.checkCap(creep);
        if (creep.carry.energy == 0) {
            if (target && creep.memory.temp_role != creep.role) {
                //console.log(creep.name + ' role switched from [' + creep.memory.temp_role + '] back to original [' + creep.memory.role + ']');
                creep.memory.role = creep.memory.temp_role;
                return creep;
            }
        }
        return creep;
    },
    checkCap: function(creep) {
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && 
                                structure.energy < structure.energyCapacity;
                    }
            });
        return target;
    }
}

module.exports = roleController;