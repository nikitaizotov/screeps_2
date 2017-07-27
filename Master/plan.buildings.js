/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('plan.buildings');
 * mod.thing == 'a thing'; // true
 */

var buildings_plan = {
    // Detect all my rooms and send them to other function that will build
    // structures in to it.
    build_struct: function() {
        if (Game.time % 3 === 0)
        for (var rname in Game.rooms) {
            var room = Game.rooms[rname];
            var spawns = room.find(FIND_MY_SPAWNS);
            if (spawns.length > 0) {
                this.build_in_room(room);
            }
        }
    },
    build_towers: function(room) {
        if (Game.time % 20 == 0) {
            return;
        }
       
        var avail = 0;
        switch(room.controller.level) {
            case 1:
            case 2:
                avail = 0;
            break;
            case 3:
            case 4:
                avail = 1;
            break;
            case 5:
            case 6:
                avail = 2;
            break;
            case 7:
                avail = 3;
            break;
            default:
                avail = 6;
            break;
        }
        
        if (avail > 0) {
            var towers = room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_TOWER;
                }
            });
            if (towers.length < avail) {
                var plan = this.get_ext_plan(room);
                var build_pos = this.get_build_position(room, plan);
                if (build_pos !== false) {
                    room.createConstructionSite(build_pos, STRUCTURE_TOWER);
                }
                // var roomPosition = this.fn_get_construction_loc();
                // if (roomPosition != false) {
                //     this.room.createConstructionSite(roomPosition, STRUCTURE_TOWER);
                // }
            }
        }
    },
    // This function will work with room and detect what structure must be 
    // built.
    build_in_room: function(room) {
        if (room.controller.level > 3) {
            // Build storage.
            if (!room.storage) {
                var plan = this.get_ext_plan(room);
                var build_pos = this.get_build_position(room, plan);
                if (build_pos !== false) {
                    room.createConstructionSite(build_pos, STRUCTURE_STORAGE);
                }
            }
            // Check if entrance is not existed.
            //if (!room.memory.rampart) {
                this.built_rampart(room);
           // }
        }
        // Order room to build a towers.
        this.build_towers(room);
    },
    built_rampart: function(room) {
        if (Game.time % 100 == 0) {
            return;
        }
         ///
            // var csites = room.find(FIND_CONSTRUCTION_SITES);
            // for (var csite_i in csites) {
            //     if (csites[csite_i].structureType == 'rampart') {
            //         csites[csite_i].remove();
            //     }
            // }
        ///
        
        var project_done = true;
        var wall_project = room.memory.wall_project;
        for (var i in wall_project) {
            for (var n in wall_project[i]) {
                var loc_x = wall_project[i][n].x;
                var loc_y = wall_project[i][n].y;
                var roomPosition = room.lookAt(loc_x, loc_y);
                if (roomPosition[0].type != 'structure') {
                    project_done = false;
                    break;
                } 
                else {
                    if (roomPosition[0].structure.structureType != 'constructedWall') {
                        project_done = false;
                        break;
                    }
                }
            }
        }
        // If walls is constructed, construct ramparts.
        if (project_done === true) {
            var wall_borders = {
                left: [],
                top: [],
                right: [],
                bottom: [],
            }
            // Collect all positions.
            if (wall_project[0].length > 0) {
                wall_borders.top.push([wall_project[0][0]]);
                wall_borders.top.push([wall_project[0][wall_project[0].length-1]]);
            }
            if (wall_project[1].length > 0) {
                wall_borders.bottom.push([wall_project[1][0]]);
                wall_borders.bottom.push([wall_project[1][wall_project[1].length-1]]);
            }
            if (wall_project[2].length > 0) {
                wall_borders.left.push([wall_project[2][0]]);
                wall_borders.left.push([wall_project[2][wall_project[2].length-1]]);
            }
            if (wall_project[3].length > 0) {
                wall_borders.right.push([wall_project[3][0]]);
                wall_borders.right.push([wall_project[3][wall_project[3].length-1]]);
            }
            // run over them and construct ramparts everywhere where it is needed.
            Memory.junk = wall_borders;
            // For left.
            if (wall_borders.left.length > 0) {
                var start_y = wall_borders.left[0][0].y;
                var end_y = wall_borders.left[wall_borders.left.length - 1][0].y;
                var x = wall_borders.left[0][0].x;
                for (var y = start_y; y < end_y + 1; y++) {
                    this.fn_built_rampart_if_needed(x, y, room);
                }
            }
            // For right.
            if (wall_borders.right.length > 0) {
                var start_y = wall_borders.right[0][0].y;
                var end_y = wall_borders.right[wall_borders.right.length - 1][0].y;
                var x = wall_borders.right[0][0].x;
                for (var y = start_y; y < end_y + 1; y++) {
                    this.fn_built_rampart_if_needed(x, y, room);
                }
            }
            // // For top.
            if (wall_borders.top.length > 0) {
                var start = wall_borders.top[0][0].x;
                var end = wall_borders.top[wall_borders.top.length - 1][0].x;
                var y = wall_borders.top[0][0].y;
                for (var x = start; x < end + 1; x++) {
                    this.fn_built_rampart_if_needed(x, y, room);
                }
            }
            // // For bottom.
            if (wall_borders.bottom.length > 0) {
                var start = wall_borders.bottom[0][0].x;
                var end = wall_borders.bottom[wall_borders.bottom.length - 1][0].x;
                var y = wall_borders.bottom[0][0].y;
                for (var x = start; x < end + 1; x++) {
                    this.fn_built_rampart_if_needed(x, y, room);
                }
            }
        }
    },
    fn_built_rampart_if_needed: function(x, y, room) {
        var roomPosition = room.lookAt(x, y);
     //   console.log(JSON.stringify(roomPosition));
     
        if (roomPosition[0].type == 'structure') {
            if (roomPosition[0].structure.structureType == 'road') {
                var built_roomPosition = room.getPositionAt(x,y);
                room.createConstructionSite(built_roomPosition, STRUCTURE_RAMPART);
            }
        }
        else {
            if (roomPosition[0].type == 'terrain' && roomPosition[0].terrain == 'plain') {
                var built_roomPosition = room.getPositionAt(x,y);
                room.createConstructionSite(built_roomPosition, STRUCTURE_RAMPART);
            }
        }
    },
    
    get_ext_plan: function(room) {
        if (room.memory.extention_plan) {
            return room.memory.extention_plan;
        }
        return false;
    },
    get_build_position: function(room, plan) {
        var step = 2;
        var total_len = 10;
        var found = false;
        var roomPosition = {};
        if (plan.directions.x == 'right') {
                for (var x = plan.x + 1; x < total_len + plan.x; x+=1) {
                    if (x > 47) {
                        fn_build_extentions_near_road();
                        break;
                    }
                    var start_y = plan.y - total_len;
                    if (x%2) {
                        start_y++;
                    }
                    for (var y = start_y; y < total_len + plan.y; y+=step) {
                        if (y < 3) {
                            fn_build_extentions_near_road();
                            break;
                        }
                        if (y > 47) {
                            fn_build_extentions_near_road();
                            break;
                        }
                        var roomPosition = room.lookAt(x, y);
                        if (roomPosition[0].type == 'terrain' && roomPosition[0].terrain != 'wall') {
                            var roomPosition = {
                                x: x,
                                y: y,
                            }
                            found = true;
                            break;
                        }
                    }
                    if (found == true) {
                        break;
                    }
                }
            }
        else {
            for (var x = plan.x - 1; x > plan.x - total_len; x-=1) {
                if (x < 3) {
                    this.fn_build_extentions_near_road();
                    break;
                }
                var start_y = plan.y - total_len;
                if (x%2) {
                    start_y++;
                }
                for (var y = start_y; y < total_len + plan.y; y+=step) {
                    if (y < 3) {
                        this.fn_build_extentions_near_road();
                        break;
                    }
                    if (y > 47) {
                        this.fn_build_extentions_near_road();
                        break;
                    }
                    var roomPosition = room.lookAt(x, y);
                    if (roomPosition[0].type == 'terrain' && roomPosition[0].terrain != 'wall') {
                        var roomPosition = {
                            x: x,
                            y: y,
                        }
                        found = true;
                        break;
                    }
                }
                if (found == true) {
                    break;
                }
            }
        }
        
        if (found == true) {
            var built_roomPosition = room.getPositionAt(roomPosition.x, roomPosition.y);
            return built_roomPosition;
        }
        return false;
    },
    fn_build_extentions_near_road: function(room) {
        var roads = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                    return structure.structureType == STRUCTURE_ROAD;
                }
            });
        if (roads.length == 0) {
            return;
        }
        var road_elm = parseInt(Math.random() * (roads.length - 0) + 0);
        for (var y=-1; y<3; y++){
            for (var x=-1; x<3; x++){
                var new_x = this.fn_calculate_posible_path(roads[road_elm].pos.x - x);
                var new_y = this.fn_calculate_posible_path(roads[road_elm].pos.y - y);
                var roomPosition = room.getPositionAt(new_x, new_y);
                if (room.lookForAt('structure', roomPosition).length == 0 && 
                    room.lookForAt('constructionSite', roomPosition).length == 0) {
                    return roomPosition;
                }
            }
        }
        return false;
    },
    fn_calculate_posible_path: function(coordinates) {
        var min = 3;
        var max = 46;
        if (coordinates > max) {
            coordinates = max;
        }
        if (coordinates < min) {
            coordinates = min;
        }
        return coordinates;
    }
}

module.exports = buildings_plan;