// Roles.
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleScout = require('role.scout');
var roleCombatScout = require('role.combat_scout');
var roleBuilder = require('role.builder');
var roleGuard = require('role.guard');
var roleWarrior = require('role.warrior');
var roleTech = require('role.tech');

var routines = {
    settings: {
        sources: {},
        units: {
            harvester: {
                needed: 2,
                build_on: 1,
            },
            upgrader: {
                needed:  1,
                build_on: 1,
            },
            builder: {
                needed: 2,
                build_on: 1,
            },
            tech: {
                needed:  1,
                build_on: 2,
            },
            //scout: {
            //    needed: 1,
            //    build_on: 1,
            //},
            //guard: {
            //    needed: 0,
            //    build_on: 3,
            //}
        },
        units_combat: {
            //combat_scout: {
            //    needed: 1,
            //    build_on: 3,
            //},
            //warrior: {
            //    needed: 15,
            //    build_on: 3,
            //},
        },
        constructions: {},
        settings: {
          build_roads_on: 1,  
        },
    },
    fn_room_spawn_combat_units: function() {
        if (!(Game.time % 6)) {
            return;
        }
        var rooms = Game.rooms;
        for (room_name in rooms) {
            var room = rooms[room_name];
            var spawns = room.find(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_SPAWN});
            if (spawns.length > 0) {
                for (var spawn_i in spawns) {
                    var spawn = spawns[spawn_i];
                    for (var unit in spawn.memory.units_combat) {
                        var unit_obj = spawn.memory.units_combat[unit];
                        var built = _.filter(Game.creeps, (creep) => creep.memory.role == unit, (room) => spawn.room.name);
                        if (unit_obj.needed > built.length && unit_obj.build_on <= spawn.room.controller.level) {
                            switch(unit) {
                                case "combat_scout":
                                    this.spawn_combat_scout(spawn);
                                break;
                                case "warrior":
                                    this.spawn_warrior(spawn);
                                break;
                            }
                        }
                    }
                }
            }
        }
    },
    fn_unit_settings_to_memory: function() {
        // Save settings to game memory.
        var spawns = _.filter(Game.spawns);
        for (var index_spawns in spawns) { 
            var spawn = spawns[index_spawns];
            this.fn_remove_road_sites(spawn);
            spawn.memory = this.settings;
            if (!spawn.memory.units) {
                spawn.memory = this.settings;
            }
        }
    },
    fn_remove_road_sites: function(spawn) {
        // var csites = spawn.room.find(FIND_CONSTRUCTION_SITES);
        // for (var csite_i in csites) {
        //     if (csites[csite_i].structureType == 'road') {
        //         csites[csite_i].remove();
        //     }
        // }
    },
    fn_controll_units: function() {
        // Contoll creeps.
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (Memory.creeps[name] == false) {
                //console.log("Not legal creep, removing.");
                creep.suicide();
            }
            
            if(creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
            }
            if(creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            }
            if(creep.memory.role == 'scout') {
                // creep.memory.role = 'harvester';
                //  creep.memory.temp_role = 'harvester';
                roleScout.run(creep);
            }
            if(creep.memory.role == 'builder') {
                roleBuilder.run(creep);
            }
            if(creep.memory.role == 'guard') {
                roleGuard.run(creep);
            }
            if(creep.memory.role == 'combat_scout') {
                roleCombatScout.run(creep);
            }
            if(creep.memory.role == 'warrior') {
                roleWarrior.run(creep);
            }
            if(creep.memory.role == 'tech') {
                roleTech.run(creep);
            }
        }
    },
    fn_check_creep_population: function() {
        if (!(Game.time % 5)) {
            return;
        }
        var spawns = _.filter(Game.spawns);
        for (var index_spawns in spawns) {
            var spawn_obj = spawns[index_spawns];
            // Run over the spawns units and controll population.
            var harvesters = _.filter(Game.creeps, (creep) => creep.memory.temp_role == 'harvester', (room) => spawn_obj.room.name);
            var builders = _.filter(Game.creeps, (creep) => creep.memory.temp_role == 'builder', (room) => spawn_obj.room.name);
            // Spawn new creeps if needed,
            for (var unit in spawn_obj.memory.units) {
                var built = _.filter(Game.creeps, (creep) => creep.memory.temp_role == unit, (room) => spawn_obj.room.name);
                var needed = spawn_obj.memory.units[unit].needed;
                var build_on = spawn_obj.memory.units[unit].build_on;
                if (harvesters.length < 3 && harvesters.length < spawn_obj.memory.units['harvester'].needed) {
                    this.spawn_rooter('harvester', spawn_obj);
                } else {
                    if (needed > built.length && build_on <= spawn_obj.room.controller.level) {
                        this.spawn_rooter(unit, spawn_obj);
                    }
                }
            }
        }
    },
    spawn_rooter: function(uname, spawn) {
        switch (uname) {
            case "harvester":
                    this.spawn_harvester(spawn);
                break;
            case "upgrader":
                    this.spawn_upgrader(spawn);
                break;
            case "builder":
                    this.spawn_builder(spawn);
                break;
            case "guard":
                    this.spawn_guard(spawn);
                break;
            case "scout":
                    this.spawn_scout(spawn);
                break;
            case "warrior":
                    this.spawn_warrior(spawn);
                break;
            case "tech":
                    this.spawn_tech(spawn);
                break;
        }
    },
    // Spawn upgrader.
    spawn_tech: function(spawn) {
        var body = this.fn_get_worker_body(spawn);
        var creeps_memory = {
            role: 'tech',
            temp_role: 'tech',
            tid: '',
            tid_room: '',
            home_room: '',
        };
        this.spawn_creep(spawn.name, body, undefined, creeps_memory);
    },
    // Spawn upgrader.
    spawn_upgrader: function(spawn) {
        var body = this.fn_get_worker_body(spawn);
        var creeps_memory = {
            role: 'upgrader', 
            temp_role: 'upgrader', 
            tid: '',
            tid_room: '',
            home_room: '',
        };
        this.spawn_creep(spawn.name, body, undefined, creeps_memory);
    },
    // Spawn builder.
    spawn_builder: function(spawn) {
        var body = this.fn_get_worker_body(spawn);
        var creeps_memory = {
            role: 'builder', 
            temp_role: 'builder', 
            tid: '',
            tid_room: '',
            home_room: '',
        };
        this.spawn_creep(spawn.name, body, undefined, creeps_memory);
    },
     // Spawn guard.
    spawn_guard: function(spawn) {
        var body = [TOUGH, MOVE, ATTACK, MOVE, ATTACK];
        var creeps_memory = {
            role: 'guard', 
            temp_role: 'guard', 
            tid: '',
            tid_room: '',
            home_room: spawn.room.name,
        };
        this.spawn_creep(spawn.name, body, undefined, creeps_memory);
    },

    // Spawn havester.
    spawn_harvester: function(spawn) {
        var body = this.fn_get_worker_body(spawn);
            var creeps_memory = {
            role: 'harvester', 
            temp_role: 'harvester', 
            tid: '',
            tid_room: '',
            home_room: '',
        };
        this.spawn_creep(spawn.name, body, undefined, creeps_memory);
    },

    // Spawn scout.
    spawn_scout: function(spawn) {
        var body = [MOVE,MOVE,MOVE];
        this.spawn_creep(spawn.name, body, undefined, {
            role: 'scout', 
            temp_role: 'scout', 
            tid: '', data: {},
            room: spawn.room.name,
        });
    },

    spawn_combat_scout: function(spawn) {
        var body = [MOVE,MOVE,MOVE];
        this.spawn_creep(spawn.name, body, undefined, {
            role: 'combat_scout', 
            room: spawn.room.name,
            target_room: '',
        });
    },

    spawn_warrior: function(spawn) {
       //   var body = [TOUGH, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK];
        //var body = [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE];
        var body = [
            TOUGH, 
            TOUGH, 
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            RANGED_ATTACK, 
            RANGED_ATTACK, 
            RANGED_ATTACK, 
            RANGED_ATTACK, 
            ];
        var creeps_memory = {
            role: 'warrior', 
            temp_role: 'warrior', 
            tid: '',
            tid_room: '',
            party: '',
            room: spawn.room.name,
        }
        this.spawn_creep(spawn.name, body, undefined, creeps_memory);
    },

    spawn_creep: function(spawn, body, name, options) {
        if(Game.spawns.Spawn1.canCreateCreep(body, name) == OK) {
            var newName = Game.spawns[spawn].createCreep(body, name, options);
            //console.log('Spawning new ' + options.role + ': ' + newName);
        }
    },

    fn_get_worker_body: function(spawn) {
        var body = [];
        switch (spawn.room.controller.level) {
            case 1:
                body = [WORK,CARRY,MOVE];
            break;
            case 2:
                if(spawn.canCreateCreep([WORK, WORK ,WORK, CARRY, MOVE], undefined) == OK) {
                    body = [WORK, WORK ,WORK, CARRY, MOVE];
                }
                else {
                    body = [WORK,CARRY,MOVE];
                }
                break;
            default:
                if(spawn.canCreateCreep([WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], undefined) == OK) {
                   body = [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE];
                }
                else {
                    if(spawn.canCreateCreep([WORK, WORK ,WORK, CARRY, MOVE], undefined) == OK) {
                        body = [WORK, WORK ,WORK, CARRY, MOVE];
                    }
                    else {
                        body = [WORK,CARRY,MOVE];
                    }
                }
        }
       return body;
    },
}
module.exports = routines;