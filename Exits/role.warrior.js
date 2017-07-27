var creepFunctions = require('role.functions');
// creep.memory.party
var WarriorRole = {
	run: function(creep) {
	    var targets_creeps = creep.room.find(FIND_HOSTILE_CREEPS);
	    var targets_structs = creep.room.find(FIND_HOSTILE_STRUCTURES);
	    var targets_spawns = creep.room.find(FIND_HOSTILE_SPAWNS);
	    var targets = [];
	    var targets = targets_creeps.concat(targets_structs);
	    
	    creep.memory.junk = targets;
	    for (var i in targets) {
	        if (targets[i].structureType && targets[i].structureType == 'controller') {
	           targets.splice(i, 1);
	        }
	    }
	   
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
    	   // var obj = creep.room.lookAt(48,21);
    	   // creep.rangedAttack(obj);
    	    
    	    
    	   // var route = Game.map.findRoute(creep.room.name, 'E85S59');
        //         var exit = creep.pos.findClosestByPath(route[0].exit);
        //         creep.moveTo(exit);
    	     if (Game.flags.Flag1){
			            creep.moveTo(Game.flags.Flag1);
			        }
    // 	    // Check if creeps is having party, if not join.
    // 	    if (creep.memory.party == '') {
    // 	        creepFunctions.fn_join_find_party(creep);
    // 	    }
    // 	    else {
    // 	        var party = creep.memory.party;
    // 	        if (Memory.party[party.room][party.party].status == 'closed') {
			 //       if (Game.flags.Flag1){
			 //           creep.moveTo(Game.flags.Flag1);
			 //       }
			 //   }
    // 	    }
    	}
	},
}
module.exports = WarriorRole;