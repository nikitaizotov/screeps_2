/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.guard');
 * mod.thing == 'a thing'; // true
 */

var roleGuard = {
    run: function(creep) {
        var targets = creep.room.find(FIND_HOSTILE_CREEPS);
    	if(targets.length > 0 && creep.hits > creep.hitsMax - 500) {
    		var username = targets[0].owner.username;
        	Game.notify(`User ${username} spotted in room ${creep.room.name}`); 	
    		creep.moveTo(targets[0]);
    		creep.attack(targets[0]);
    	} else {
    		if (creep.memory.tid == '') {
    			var roads = creep.room.find(FIND_STRUCTURES, {
		        filter: (structure) => {
		                return structure.structureType == STRUCTURE_ROAD;
		            }
		        });
		        var tid = roads[Math.floor((Math.random() * roads.length) + 0)].id;
		        creep.memory.tid = tid;
    		}
    		else {
    			var target = Game.getObjectById(creep.memory.tid);
    			creep.moveTo(target);
    			if (creep.pos.roomName == target.pos.roomName &&
    				creep.pos.x == target.pos.x &&
    				creep.pos.y == target.pos.y) {
    				creep.memory.tid = '';
    			}
    		}
    		
    	} 
    }
}

module.exports = roleGuard;