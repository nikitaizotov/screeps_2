
var functions = {
    fn_get_my_room_names: function() {
        var rooms = [];
        for (var rname in Game.rooms) {
            var room = Game.rooms[rname];
            if (room.controller && room.controller.my) {
                rooms.push(rname);
            }
        }
        return rooms;
    },
    
    fn_assign_to_source: function(creep) {
        var creep_home = creep.memory.room;
        // Get all availible exits from this room
        var current_room_connecions = Game.map.describeExits(creep.room.name);
        
        // Memory.logistics.sources['5873be7b11e3e4361b4dafd4'].push(creep.name);
        // creep.memory.tid = '5873be7b11e3e4361b4dafd4';
        // creep.memory.tid_room = 'E86S59';
        
        for (var i in current_room_connecions) {
            var room = Memory.logistics.rooms[current_room_connecions[i]];
             if (!room.info || 
                room.info.units != 0 || 
                room.info.structures != 0 || 
                room.info.spawn != 0) 
                continue;
                // ///////////////
                //  Memory.logistics.sources[sid].push(creep.name);
                // creep.memory.tid = '';
                // creep.memory.tid_room = '';
                // ///////////////
            for (var sid in room.sources) {
                // If he is here, closest source is busy, find others.
                if (Memory.logistics.sources[sid].length < 3) {
                    console.log("Found")
                    Memory.logistics.sources[sid].push(creep.name);
                    creep.memory.tid = sid;
                    creep.memory.tid_room = current_room_connecions[i];
                    return;
                }
            }
        }
    },
    
    fn_create_room_logistics_str: function(room) {
        if (!Memory.logistics) {
			Memory.logistics = {};
		}

		if (!Memory.logistics.rooms) {
			Memory.logistics.rooms = {};
		}

		// Update room data.
		if (!Memory.logistics.rooms[room.name]) {
			Memory.logistics.rooms[room.name] = {};
		}

		if (!Memory.logistics.rooms[room.name].sources) {
			Memory.logistics.rooms[room.name].sources = {};
		}
    },
    
	fn_save_room_sources: function(room) {
		this.fn_create_room_logistics_str(room);

		var sources = room.find(FIND_SOURCES);
		for (var i in sources) {
			var source = sources[i];
			var sid = source.id;
			if (!Memory.logistics.sources) {
				Memory.logistics.sources = {};
			}
			if (!Memory.logistics.sources[sid]) {
				Memory.logistics.sources[sid] = [];
				Memory.logistics.rooms[room.name].sources[sid] = {
					x: source.pos.x,
					y: source.pos.y,
				};
			}
		}
	},

	// Save data about the room in to creeps home room military memory.
	fn_save_rooms_data: function(creep) {
		var room = creep.room;
		this.fn_create_room_logistics_str(room);
		
		var host_spawns = creep.room.find(FIND_HOSTILE_SPAWNS);
		var host_struct = creep.room.find(FIND_HOSTILE_STRUCTURES);
        var host_units = creep.room.find(FIND_HOSTILE_CREEPS);
        var room_data = {};

        room_data = {
			units: host_units.length,
			structures: host_struct.length,
			spawn: host_spawns.length,
			visited: Game.time
		};
		if (!Memory.logistics.rooms[room.name].info) {
		    Memory.logistics.rooms[room.name].info = {};
		}
		Memory.logistics.rooms[room.name].info = room_data;
	},
	
	// Creep must have creep.memory.room
	fn_join_find_party: function(creep) {
	    // Find creeps home.
		var room = Game.rooms[creep.memory.room];
		// Check if there is parties for this room in memory.
		if (!Memory.party) Memory.party = {};
		
		this.fn_join_first_party(creep, room);
	},
	fn_create_party: function(room) {
	    Memory.party[room.name].push({
					units: {},
					status: 'open',
				});
	},
	fn_join_first_party: function(creep, room) {
// 		if (!Memory.party[room.name] || Memory.party[room.name].length == 0) {
// 		    console.log(111);
// 		    Memory.party[room.name] = [];
// 	        Memory.party[room.name].push({
// 					units: {},
// 					status: 'open',
// 				});
// 	        Memory.party[room.name][0].units[creep.name] = Game.time;
// 	        Memory.party[room.name][0].status = 'open';
// 	        creep.memory.party = {
// 	            room: room.name,
// 	            party: 0,
// 	        }
// 		}
// 		else {
// 		   for (var i in Memory.party[room.name]) {
// 		        console.log(Memory.party[room.name][i]);
// 		        if (Memory.party[room.name][i].status == 'open') {
// 		            Memory.party[room.name][i].units[creep.name] = Game.time;
// 		            creep.memory.party = {
//         	            room: room.name,
//         	            party: i,
//         	        }
//         	        // REFACTOR NEEDED, DOES NOT WORK.
// 		            if (Object.keys(Memory.party[room.name][i].units) == 2) {
// 		                Memory.party[room.name][i].status = 'closed';
// 		            }
// 		            break;
// 		        }
// 		  }
// 		}
	}
}
module.exports = functions;