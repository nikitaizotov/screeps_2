// Roles.
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleScout = require('role.scout');
var roleCombatScout = require('role.combat_scout');
var roleBuilder = require('role.builder');
var roleGuard = require('role.guard');
var roleWarrior = require('role.warrior');
var roleTech = require('role.tech');
var lr_harvester = require('role.lr_harvester');
var roleClaim = require('role.claim');

var routines = {
    settings: {
        sources: {},
        units: {
            harvester: {
                needed: 4,
                build_on: 1,
            },
            upgrader: {
                needed:  1,
                build_on: 1,
            },
            builder: {
                needed: 1,
                build_on: 1,
            },
            tech: {
                needed:  1,
                build_on: 2,
            },
            lr_harvester: {
                needed: 1,
                build_on: 4,
            },
            scout: {
                needed: 1,
                build_on: 1,
            },
            // guard: {
            //     needed: 1,
            //     build_on: 3,
            // }
        },
        units_combat: {
            // combat_scout: {
            //     needed: 1,
            //     build_on: 3,
            // },
            // warrior: {
            //     needed: 1,
            //     build_on: 3,
            // },
            claim: {
                needed: 1,
                build_on: 3,
            },
        },
        constructions: {},
        settings: {
          build_roads_on: 1,  
        },
    },
    
    fn_get_my_room_names: function() {
        var rooms = [];
        for (var rname in Game.rooms) {
            var room = Game.rooms[rname];
            
            var my_name = Game.spawns[Object.keys(Game.spawns)[0]].owner.username;
        	if (room.controller.reservation && room.controller.reservation.username == my_name || room.controller.my) {
        	    contr_is_mine = true;
        	}
            
            if (contr_is_mine == true) {
                rooms.push(rname);
            }
        }
        return rooms;
    },
    fn_create_construction_sites: function(path, construction, room) {
        Memory.junk = path;
        // Run over the path and build something on its locations.
        for (var index in path) {
            var item = path[index];
            var roomPosition = room.getPositionAt(item.x, item.y);
            // If there is an empty place.
            if (room.lookForAt('structure', roomPosition).length == 0 && 
            room.lookForAt('constructionSite', roomPosition).length == 0) {
                // Build for a structure.
                room.createConstructionSite(roomPosition, construction);
            }
        }
    },
    fn_room_connect: function(){
        if (Game.time % 100 === 0) {
            return;
        }
        var rooms = this.fn_get_my_room_names();
        for(var i in rooms) {
            var room  = Game.rooms[rooms[i]];
            if (room.storage) {
                var current_room_connecions = Game.map.describeExits(room.name);
                for (var n in current_room_connecions) {
        	       var room_name = current_room_connecions[n];
        	       var connected_room = Game.rooms[room_name];
        	       if (!connected_room) {
        	           continue;
        	       }
        	       
        	       //if (room_name == 'E87S58') {
        	       //    console.log(Game.spawns[Object.keys(Game.spawns)[0]].owner.username);
        	       //    Memory.junk2 = connected_room.controller;
        	       //}
        	       
        	       var contr_is_mine = false;
        	       var my_name = Game.spawns[Object.keys(Game.spawns)[0]].owner.username;
        	      // console.log(connected_room + ' ' + room_name);
        	       if (connected_room.controller.reservation && connected_room.controller.reservation.username == my_name || connected_room.controller.my) {
        	           contr_is_mine = true;
        	       }
        	       
        	       // if (room_name == 'E87S58') {
        	       //   console.log(rooms.indexOf(connected_room.name));
        	       //}
        	       
        	       if (connected_room && rooms.indexOf(connected_room.name) != -1 && contr_is_mine == true) {
        	           
        	       //if (room_name == 'E87S58') {
        	       //   console.log(111);
        	       //}
        	           
        	           var sources = connected_room.find(FIND_SOURCES);
        	           for (var s_i in sources) {
        	                var room_source = sources[s_i];
            	            if (!Memory.rooms[room.name].storage || !Memory.rooms[room.name].storage.connected || !Memory.rooms[room.name].storage.connected[room_source.id]) {
            	                var path = room.findPath(room.storage.pos, room_source.pos, {ignoreRoads: false, ignoreCreeps:true});
            	                if (path.length > 0) {
            	                    if (!Memory.rooms[room.name].storage) {
            	                        Memory.rooms[room.name].storage = {
            	                            connected: {},
            	                        };
            	                    }
            	                    if (!Memory.rooms[room.name].storage.connected) {
            	                        Memory.rooms[room.name].storage.connected = {};
            	                    }
            	                    Memory.rooms[room.name].storage.connected[room_source.id] = path;
            	                }
        	                }
        	                else {
        	                  path = Memory.rooms[room.name].storage.connected[room_source.id];
        	                }
        	                this.fn_create_construction_sites(path, STRUCTURE_ROAD, room);
        	                var path = connected_room.findPath(room_source.pos, room.storage.pos, {ignoreRoads: false, ignoreCreeps:true});
        	                this.fn_create_construction_sites(path, STRUCTURE_ROAD, connected_room);
        	           }
        	           /*
        	           // Road from source to controller.
            var path = this.room.findPath(source.pos, this.room.controller.pos, {ignoreRoads: true, ignoreCreeps:true});
        	           */
        	       }
        	    }
            }
        }
    },
    
    fn_room_spawn_combat_units: function() {
        if (!(Game.time % 6)) {
            return;
        }
        var rooms = Game.rooms;
        for (var room_name in rooms) {
            var room = rooms[room_name];
            
            var hostiles = Game.rooms[room_name].find(FIND_HOSTILE_CREEPS);
            if (hostiles.length > 2) {
                Game.rooms[room_name].controller.activateSafeMode();
            }
            
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
                                case "claim":
                                    this.spawn_claim(spawn);
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
            if(creep.memory.role == 'lr_harvester') {
                lr_harvester.run(creep);
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
            if(creep.memory.role == 'claim') {
                roleClaim.run(creep);
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
                        switch (unit) {
                            case 'lr_harvester':
                                    if(spawn_obj.room.storage) {
                                         this.spawn_lr_harvester(spawn_obj);
                                    }
                                break;
                            default:
                                this.spawn_rooter(unit, spawn_obj);
                        }
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
        var body =  [WORK,CARRY, CARRY, MOVE];
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
        var body = this.fn_get_worker_body_dynamic(spawn);
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
        var body = this.fn_get_worker_body_dynamic(spawn);
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
         // 9 is too much.
        // Around 7 was ok.
        var body = [];
        
        if (spawn.room.energyAvailable > 179) {
            var part_loops = parseInt(spawn.room.energyAvailable / 180);
            for (var i = 0; i < part_loops; i++) {
                body.push(TOUGH);
                // if (i > 10) {
                //     break;
                // }
            }
            for (var i = 0; i < part_loops; i++) {
                body.push(MOVE);
                // if (i > 10) {
                //     break;
                // }
            }
            for (var i = 0; i < part_loops; i++) {
                body.push(ATTACK);
                // if (i > 10) {
                //     break;
                // }
            }
        }
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
        var body = this.fn_get_worker_body_dynamic(spawn);
            var creeps_memory = {
            role: 'harvester', 
            temp_role: 'harvester', 
            tid: '',
            tid_room: '',
            home_room: '',
        };
        this.spawn_creep(spawn.name, body, undefined, creeps_memory);
    },

    spawn_lr_harvester: function(spawn) {
       // var body = this.fn_get_worker_body_dynamic_lr(spawn);
        var body = this.fn_get_worker_body_dynamic_lr(spawn);
            var creeps_memory = {
            role: 'lr_harvester', 
            temp_role: 'lr_harvester', 
            tid: '',
            tid_room: '',
            loops: 0,
            home_room: spawn.room.name,
        };
        this.spawn_creep(spawn.name, body, undefined, creeps_memory);
    },

    // Spawn scout.
    spawn_scout: function(spawn) {
        var body = [MOVE,MOVE,MOVE];
        this.spawn_creep(spawn.name, body, undefined, {
            role: 'scout', 
            temp_role: 'scout', 
            target: '', data: {},
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
    
    spawn_claim: function(spawn) {
       //   var body = [TOUGH, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK];
        //var body = [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE];
        var body = [
            MOVE,
            MOVE,
            // MOVE,
            // MOVE,
            CLAIM,
            CLAIM,
            ];
        var creeps_memory = {
            role: 'claim', 
            temp_role: 'claim', 
            tid: '',
            tid_room: '',
            party: '',
            room: spawn.room.name,
        }
        this.spawn_creep(spawn.name, body, undefined, creeps_memory);
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
            // TOUGH,
            // TOUGH,
            // TOUGH,
            // TOUGH,
            // TOUGH,
            // TOUGH,
            // TOUGH,
            // TOUGH,
            // TOUGH,
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
    fn_get_worker_body_dynamic: function(spawn) {
        // 9 is too much.
        // Around 7 was ok.
        var body = [];
        
        if (spawn.room.energyAvailable > 199) {
            var part_loops = parseInt(spawn.room.energyAvailable / 200);
            for (var i = 0; i < part_loops; i++) {
                body.push(WORK);
                if (i > 7) {
                    break;
                }
            }
            for (var i = 0; i < part_loops; i++) {
                body.push(CARRY);
                if (i > 7) {
                    break;
                }
            }
            for (var i = 0; i < part_loops; i++) {
                body.push(MOVE);
                if (i > 7) {
                    break;
                }
            }
        }
        return body;
    },
    fn_get_worker_body_dynamic_lr: function(spawn) {
        var body = [];
        if (spawn.room.energyAvailable > 199) {
            var part_loops = parseInt(spawn.room.energyAvailable / 200);
            for (var i = 0; i < part_loops; i++) {
                body.push(WORK);
            }
            for (var i = 0; i < part_loops; i++) {
                body.push(CARRY);
            }
            for (var i = 0; i < part_loops; i++) {
                body.push(MOVE);
            }
        }
        return body;
    },
}
module.exports = routines;