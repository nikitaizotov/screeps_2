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
        if (Game.time % 1 === 0)
        for (var rname in Game.rooms) {
            var room = Game.rooms[rname];
            var spawns = room.find(FIND_MY_SPAWNS);
            if (spawns.length > 0) {
                this.build_in_room(room);
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
            if (!room.memory.rampart) {
                this.built_rampart(room);
            }
        }
    },
    built_rampart: function(room) {
        var wall_project = room.memory.wall_project;
        for (var i in wall_project) {
            switch (i) {
                case 0:
                    //top
                     Memory.junk = wall_project[i][wall_project[i].length-1];
                        for (var x = wall_project[i][0].x; x < wall_project[i][wall_project[i].length-1].x; x++) {
                            var loc_x = x;
                            var loc_y =  wall_project[i][0].y;
                            var roomPosition = room.lookAt(loc_x, loc_y);
                            if (roomPosition[0].type == 'terrain' && roomPosition[0].terrain != 'wall') {
                                var built_roomPosition = room.getPositionAt(loc_x, loc_y);
                                room.createConstructionSite(built_roomPosition, STRUCTURE_RAMPART);
                            }
                        }
                    // break;
                case 1:
                    // Bottom.
                        Memory.junk = wall_project[i][wall_project[i].length-1];
                        for (var x = wall_project[i][0].x; x < wall_project[i][wall_project[i].length-1].x; x++) {
                            var loc_x = x;
                            var loc_y =  wall_project[i][wall_project[i].length-1].y;
                            var roomPosition = room.lookAt(loc_x, loc_y);
                            if (roomPosition[0].type == 'terrain' && roomPosition[0].terrain != 'wall') {
                                var built_roomPosition = room.getPositionAt(loc_x, loc_y);
                                room.createConstructionSite(built_roomPosition, STRUCTURE_RAMPART);
                            }
                        }
                    break;
                case 2:
                        // Left.
                        Memory.junk = wall_project[i][wall_project[i].length-1];
                        for (var y = wall_project[i][0].y; y < wall_project[i][wall_project[i].length-1].y; y++) {
                            var loc_x = wall_project[i][0].x;
                            var loc_y =  y;
                            var roomPosition = room.lookAt(loc_x, loc_y);
                            if (roomPosition[0].type == 'terrain' && roomPosition[0].terrain != 'wall') {
                                var built_roomPosition = room.getPositionAt(loc_x, loc_y);
                                room.createConstructionSite(built_roomPosition, STRUCTURE_RAMPART);
                            }
                        }
                    break;
                case '3':
                        // Right.
                        Memory.junk = wall_project[i][wall_project[i].length-1];
                        for (var y = wall_project[i][0].y; y < wall_project[i][wall_project[i].length-1].y; y++) {
                            var loc_x = wall_project[i][wall_project[i].length-1].x;
                            var loc_y =  y;
                            var roomPosition = room.lookAt(loc_x, loc_y);
                            if (roomPosition[0].type == 'terrain' && roomPosition[0].terrain != 'wall') {
                                var built_roomPosition = room.getPositionAt(loc_x, loc_y);
                                room.createConstructionSite(built_roomPosition, STRUCTURE_RAMPART);
                            }
                        }
                    break;
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