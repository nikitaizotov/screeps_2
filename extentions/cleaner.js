/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('cleaner');
 * mod.thing == 'a thing'; // true
 */
var cleaner = {
    fn_clean_creeps: function() {
        if (!(Game.time % 10)) {
            return;
        }
        // Clean not existed creeps.
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    },
    fn_clean_parties: function() {
        if (!(Game.time % 30)) {
            return;
        }
        for (var room_name in Game.rooms) {
            var room = Game.rooms[room_name];
            if (room.memory.party) {
                for(var party_name in room.memory.party) {
                    // Run over the units.
                    for (var unit_name in room.memory.party[party_name].units) {
                        if(!Game.creeps[unit_name]) {
                            delete room.memory.party[party_name].units[unit_name];
                            console.log('Removing unexisted creep ' + unit_name + ' from a party ' + party_name +' in ' + room.name);
                        }
                    }
                    // Delete closed party if empty.
                    if (Object.keys(room.memory.party[party_name].units).length == 0 && room.memory.party[party_name].status == 'closed') {
                        delete room.memory.party[party_name];
                        console.log('Removing empty closed party ' + party_name +' in ' + room.name)
                    }
                }
            }
        }
    },
    fn_clean_sources: function () {
        if (!(Game.time % 15)) {
            return;
        }
        for (var i in Memory.logistics.sources) {
            var source_list =  Memory.logistics.sources[i];
            for (var screep_i in source_list) {
                var creep_name = source_list[screep_i];
                if(!Game.creeps[creep_name]) {
                    Memory.logistics.sources[i].splice(screep_i,1);
                }
            }
        }
    }
}
module.exports = cleaner;