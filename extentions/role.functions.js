
var functions = {
	fn_save_room_sources: function(room) {
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
		var room = Game.rooms[creep.memory.room];
		if (!room.memory.military) {
			room.memory.military = {};
		}
			
		var host_spawns = creep.room.find(FIND_HOSTILE_SPAWNS);
		var host_struct = creep.room.find(FIND_HOSTILE_STRUCTURES);
        var host_units = creep.room.find(FIND_HOSTILE_CREEPS);

        if (host_spawns.length > 0 || host_units.length > 0 || host_struct.length > 0) {
           	var waves = 0;
	        if (!room.memory.military[creep.room.name]) {
				room.memory.military[creep.room.name] = {};
			}
			if (room.memory.military[creep.room.name].waves) {
				waves = room.memory.military[creep.room.name].waves;
			}
			room.memory.military[creep.room.name] = {
				units: host_units.length,
				structures: host_struct.length,
				spawn: host_spawns.length,
				waves: waves,
				};
		}
		else {
			delete room.memory.military[creep.room.name];
		}
	},
	// Creep must have creep.memory.room
	fn_join_find_party: function(creep) {
		// Find creeps home.
		var room = Game.rooms[creep.memory.room];
		// Find parties there.
		// But first create parties object ina  room memory if its not exists.
		if (!room.memory.party) {
			room.memory.party = {};
		}
		// If there is no parties - create one and join it.
		if (Object.keys(room.memory.party).length == 0) {
			this.fn_create_party(room);
		}
		if (Object.keys(room.memory.party).length > 0) {
			this.fn_join_first_party(creep, room);
		}
		//console.log(Object.keys(room.memory.party).length)
	},
	fn_create_party: function(room) {
		// Run over the military reports and create party from a first one.
		for (var report_room in room.memory.military) {
			if (!room.memory.party[report_room]) {
					room.memory.party[report_room] = {
					units: {},
					status: 'open',
				}
				break;
			}
		}
	},
	fn_join_first_party: function(creep, room) {
		for (var p_name in room.memory.party) {
			var party = room.memory.party[p_name];
			if (party.status == 'open') {
				room.memory.party[p_name].units[creep.name] = Game.time;
				creep.memory.party = p_name;
				if (Object.keys(room.memory.party[p_name].units).length > 3) {
					room.memory.party[p_name].status = 'closed';
				}
				break;
			}
		}
	}
}
module.exports = functions;