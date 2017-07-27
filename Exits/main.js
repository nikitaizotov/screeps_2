// Basic functions.
var Routines = require('routines');
// Memory cleaning functions.
var Cleaner = require('cleaner');
// Extend spawn class.
require('construction.spawn');
var buildingsPlan = require('plan.buildings');

module.exports.loop = function () {
    
    if (!Memory.order_queue) {
        Memory.order_queue = [];
    }
    
    // ////
    // var target_flag = Game.flags.Flag1;
    // console.log(target_flag);
    // ////
    // Clean not existed creeps from sources.
    Cleaner.fn_clean_sources();
    // Remove not existed creeps from game.
    Cleaner.fn_clean_creeps();
    // Clean parties.
    Cleaner.fn_clean_parties();
    // Settings to memory.
    Routines.fn_unit_settings_to_memory();
    buildingsPlan.build_struct();
    
    var spawns = _.filter(Game.spawns);
    for (var index_spawns in spawns) {
        var spawn_obj = spawns[index_spawns];
        spawn_obj.fn_discover_room();
        spawn_obj.fn_build_extentions();
        spawn_obj.fn_build_towers();
        spawn_obj.fn_controll_towers();
        spawn_obj.fn_build_walls_and_roads();
        
        ///
        // var csites = spawn_obj.room.find(FIND_CONSTRUCTION_SITES);
        //     for (var csite_i in csites) {
        //         if (csites[csite_i].structureType == 'rampart') {
        //             csites[csite_i].remove();
        //         }
        //     }
        ///
    }
    Routines.fn_controll_units();
    Routines.fn_check_creep_population();
    Routines.fn_room_spawn_combat_units();
    Routines.fn_room_connect();
}
