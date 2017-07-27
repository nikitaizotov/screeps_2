// Basic functions.
var Routines = require('routines');
// Memory cleaning functions.
var Cleaner = require('cleaner');
// Extend spawn class.
require('construction.spawn');

module.exports.loop = function () {
     // Clean not existed creeps from sources.
     Cleaner.fn_clean_sources();
     // Remove not existed creeps from game.
     Cleaner.fn_clean_creeps();
     // Clean parties.
     Cleaner.fn_clean_parties();
     // Settings to memory.
     Routines.fn_unit_settings_to_memory();
    
    var spawns = _.filter(Game.spawns);
    for (var index_spawns in spawns) {
        var spawn_obj = spawns[index_spawns];
        spawn_obj.fn_discover_room();
        spawn_obj.fn_build_extentions();
        spawn_obj.fn_build_towers();
        spawn_obj.fn_controll_towers();
        spawn_obj.fn_build_walls_and_roads();
    }
     Routines.fn_controll_units();
     Routines.fn_check_creep_population();
    // Routines.fn_room_spawn_combat_units();
}
