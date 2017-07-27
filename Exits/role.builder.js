/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */
var creepRoleController = require('role.controller');
var creepFunctions = require('role.functions');
var roleBuilder = {
    fn_mve_back_home: function(creep) {
        creep.memory.tid_room = '';
	    var room_pos_name =  creep.memory.home_room;
        var route = Game.map.findRoute(creep.room.name, room_pos_name);
        var exit = creep.pos.findClosestByRange(route[0].exit);
        creep.moveTo(exit);
    },
    
	fn_builder_routines: function(creep) {
		var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
		if (creep.memory.tid != '') {
			creep.memory.tid = '';
		}
		
	    if (targets.length > 0) {
		    var flag_obj_found = false;
		        
		    //// Search for a targets that will be a tower.
		    //for (var i in targets) {
		    //    // If this is a road change flag to false and move creep to it.
		    //    if (targets[i].structureType == 'road') {
		    //        if(creep.build(targets[i]) == ERR_NOT_IN_RANGE) {
	         //           creep.moveTo(targets[i]);
	         //           flag_obj_found = true;
		    //            break;
	         //       }
		    //    }
		    //}
		        
		    if (flag_obj_found == false) {
	    	    // Search for a targets that will be a tower.
	    	    for (var i in targets) {
	                if (targets[i].structureType == 'tower') {
	    	            // If this is a tower change flag to false and move creep to it.
	    	            if(creep.build(targets[i]) == ERR_NOT_IN_RANGE) {
	                        creep.moveTo(targets[i]);
	                        flag_obj_found = true;
	    	                break;
	                    }
	    	        } 
	    	    }
		    }
		        
		    // If tower was found this code should be not launced.
		    if (flag_obj_found == false) {
	            if(targets.length) {
	            	var closest = creep.pos.findClosestByPath(targets);
	                if(creep.build(closest) == ERR_NOT_IN_RANGE) {
	                    creep.moveTo(closest);
	                }
	            }
		    }
	    }
	    else {
	        var work_found = false;
	        
	        // Move home if here is no work and we are not home.
	        if (creep.room.name != creep.memory.home_room) {
	            this.fn_mve_back_home(creep);
                return;
	        }
	        
	        // Check in connected rooms, if there is something that needs to be buuilt.
	        if (creep.memory.tid_room == '' || creep.memory.tid_room == creep.memory.home_room) {
	            creep.memory.tid_room  = '';
    		    var my_rooms = creepFunctions.fn_get_my_room_names();
    		    var current_room_connecions = Game.map.describeExits(creep.room.name);
    		    for (var i in current_room_connecions) {
    		        var room_name = current_room_connecions[i];
                    var room = Game.rooms[room_name];
                    if (my_rooms.indexOf(room_name) != -1) {
                        var csites = room.find(FIND_CONSTRUCTION_SITES);
                        if (csites.length > 0) {
                            //There is a work.
                            work_found = true;
                            creep.memory.tid_room = room_name;
                        }
                    }
    		    }
	        }
	        
	        if (creep.room.name != creep.memory.tid_room && creep.memory.tid_room != '') {
	            var room_pos_name =  creep.memory.tid_room;
                var route = Game.map.findRoute(creep.room.name,creep.memory.tid_room);
                var exit = creep.pos.findClosestByRange(route[0].exit);
                creep.moveTo(exit);
	        } 
	        
	        if (work_found == false && creep.room.name == creep.memory.home_room &&  creep.memory.tid_room == '') {
	            // Move home if here is no work and we are not home.
    	        if (creep.room.name != creep.memory.home_room) {
    	            this.fn_mve_back_home(creep);
                    return;
    	        }
    	        else {
    	           // if (creep.pos.x == 0 || creep.pos.x == 49 || creep.pos.y == 0 || creep.pos.y == 49) {
    	           //     creep.moveTo(creep.room.controller);
    	           // }
    	            creep.memory.role = 'upgrader';
    			    creep.memory.charging = true;   
    	        }
            }
	    }
	},
    run: function (creep) {
        // var room_pos_name =  'E86S59';
        // var route = Game.map.findRoute(creep.room.name, room_pos_name);
        // var exit = creep.pos.findClosestByRange(route[0].exit);
        // creep.moveTo(exit);
        ////////////
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep = creepRoleController.fn_creem_from_source(creep);
	        creep.memory.building = true;
	    }

	    if(creep.memory.building) {
            this.fn_builder_routines(creep);
	    }
	    else {
	       creep = creepRoleController.interact_with_source(creep);
    	   //creepRoleController.fn_creep_move_to_source(creep);
	    }
    },
}

module.exports = roleBuilder;