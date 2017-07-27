/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */
var creepRoleController = require('role.controller');
var roleBuilder = {
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
			creep.memory.role = 'upgrader';
			creep.memory.charging = true;
	    }
	},
    run: function (creep) {
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep = creepRoleController.fn_creem_from_source(creep);
	        creep.memory.building = true;
	        creep.say('building');
	    }

	    if(creep.memory.building) {
	    	if (creep.room.name != creep.memory.home_room) {
                var room_pos_name =  creep.memory.home_room;
                var route = Game.map.findRoute(creep.room.name, room_pos_name);
                var exit = creep.pos.findClosestByRange(route[0].exit);
                creep.moveTo(exit);
            }
            else {
            	this.fn_builder_routines(creep);
            }
	    }
	    else {
	       creep = creepRoleController.interact_with_source(creep);
    	   //creepRoleController.fn_creep_move_to_source(creep);
	    }
    },
}

module.exports = roleBuilder;