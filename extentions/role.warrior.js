var creepFunctions = require('role.functions');
// creep.memory.party
var WarriorRole = {
	run: function(creep) {
		if (creep.room.name != creep.memory.room) {
			creepFunctions.fn_save_rooms_data(creep);
		}
		var targets = creep.room.find(FIND_HOSTILE_CREEPS);
    	if(targets.length > 0) {
    		var closest = creep.pos.findClosestByPath(targets);
    		var username = closest.owner.username;
        	//
        	var enimies = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
			if(enimies.length > 0) {
			    creep.rangedAttack(enimies[0]);
			}
			else {
				creep.moveTo(closest);
			}
    	}
    	else {
    		// Move back to home of needed.
    		if (creep.room.name != creep.memory.room && creep.memory.party == '') {
				var room_pos_name =  creep.memory.party;
                var route = Game.map.findRoute(creep.room.name, creep.memory.room);
                var exit = creep.pos.findClosestByRange(route[0].exit);
                creep.moveTo(exit);
                return;
			}
			// If empty, find friends.
			if (!creep.memory.party || creep.memory.party == '') {
				creepFunctions.fn_join_find_party(creep);
			}
			// If not empty, do something.
			if (creep.memory.party != '') {
				var home_room = Game.rooms[creep.memory.room];
				if (!home_room.memory.military[creep.memory.party]) {
					// Run over the creeps and check their party to '' and remove party.
				}
				// Check party if closed.
				if (home_room.memory.party[creep.memory.party].status == 'closed') {
					if (creep.memory.tid) {
						creep.memory  .tid = '';
					}
					var room_pos_name =  creep.memory.party;
                    var route = Game.map.findRoute(creep.room.name, room_pos_name);
                    var exit = creep.pos.findClosestByRange(route[0].exit);
                    creep.moveTo(exit);
				}
				else {
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
	},
}
module.exports = WarriorRole;