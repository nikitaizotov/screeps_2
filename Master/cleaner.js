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
        if (Game.time % 10 === 0) {
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
        if (Game.time % 30 === 0 || !Memory.party) {
            return;
        }
        for (var i in Memory.party) {
            var room = Memory.party[i];
            for (var unit_party in room) {
                var party = room[unit_party];
                if (!party) {
                    break;
                }
                for (var unit_name in party.units) {
                    if(!Game.creeps[unit_name]) {
                        delete Memory.party[i][unit_party].units[unit_name];
                    }
                }
                if (party.status == 'closed' && Object.keys(party.units) == 0) {
                    delete Memory.party[i][unit_party];
                    break;
                }
            }
        }
    },
    fn_clean_sources: function () {
        if (Game.time % 15 === 0) {
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