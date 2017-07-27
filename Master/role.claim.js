/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.claim');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function(creep) {
        if (!Game.flags.Flag1) return;
        
         if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
        //Memory.junk = Game.FLAGS_LIMIT
        if (Game.flags.Flag1.pos.roomName != creep.room.name) {
            creep.moveTo(Game.flags.Flag1);
        }
        else {
           
            if(creep.room.controller) {
                if(creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);    
                }
            }
        }
        //if (Game.flags.Flag1){
		 //   creep.moveTo(Game.flags.Flag1);
		//}
// 		if(creep.room.controller && !creep.room.controller.my) {
//             if(creep.attackController(creep.room.controller) == ERR_NOT_IN_RANGE) {
//                 creep.moveTo(creep.room.controller);
//             }
//         }
        
    }
};