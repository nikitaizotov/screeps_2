var creepFunctions = require('role.functions');
var scout = {
    run: function(creep) {
        // Refactor needed.
        if (!creep.memory.target && creep.room.name == creep.memory.room) {
            // Get target.
            this.fn_check_neighbours(creep);
        }
        else {
            // Run to target.
            if (creep.room.name != creep.memory.target) {
                
                if (creep.memory.target == '') {
                    this.fn_check_neighbours(creep);
                }
                // var room_pos_name =  creep.memory.target;
                // var route = Game.map.findRoute(creep.room.name, creep.memory.target);
                // var exit = creep.pos.findClosestByRange(route[0].exit);
                // creep.moveTo(exit);
                console.log(room_pos_name);
            }
            else {
                creepFunctions.fn_save_rooms_data(creep);
                creep.memory.target = '';
                
                var room_pos_name =  creep.memory.home_room;
                var route = Game.map.findRoute(creep.room.name, creep.memory.room);
                var exit = creep.pos.findClosestByRange(route[0].exit);
                creep.moveTo(exit);
            }
        }
    },
    fn_check_neighbours: function(creep) {
        // Get current room name.
	    var current_room = creep.room.name;
	    // Get all availible exits from this room
	    var current_room_connecions = Game.map.describeExits(current_room);
	   // var exit_i = parseInt(Math.random() * (current_room_connecions.length - 0) + 0);
	   // creep.memory.target = current_room_connecions[this.fn_rand_key(current_room_connecions)];
	   var smallest = {
	       room: '',
	       time: 0,
	   };
	   for (var i in current_room_connecions) {
	       var room_name = current_room_connecions[i];
	       if (!Memory.logistics.rooms[room_name] || !Memory.logistics.rooms[room_name].info || !Memory.logistics.rooms[room_name].info.visited) {
	           creep.memory.target = current_room_connecions[i];
	           break;
	       }
	       else {
	           if (smallest.time == 0) {
	               smallest.time = Memory.logistics.rooms[room_name].info.visited;
	               smallest.room = room_name;
	           }
	           else {
	               if (Memory.logistics.rooms[room_name].info.visited < smallest.time) {
	                   smallest.time = Memory.logistics.rooms[room_name].info.visited;
	                   smallest.room = room_name;
	               }
	           }
	       }
	   }
	   if (smallest.time != 0) {
	       creep.memory.target = smallest.room;
	   }
    },
}

module.exports = scout;