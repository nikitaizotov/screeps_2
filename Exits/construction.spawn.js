var creepFunctions = require('role.functions');

Spawn.prototype.fn_build_walls_and_roads = function() {
    if (Game.time % 1000) {
        return;
    }
    // Collect all objects in to array.
    if (!this.room.memory.walls) {
        var errors = false;
        var objects = [];
        for (var y = 2; y < 47; y++) {
           for (var x = 2; x < 47; x++) {
                var obj = this.room.lookAt(x,y);
                switch(obj[0].type) {
                    case 'source':
                    case 'structure':
                    case 'mineral':
                        objects.push([x, y]);
                    break;
                }
            }
        }
    
        var roads = [];
        // Road plan will hold roads construction plan, needed to not to build extra roads when something was wrong
        // on a previeus time.
        if (!this.room.memory.roads_plan) {
            this.room.memory.roads_plan = [];
            for (var i = 0; i < objects.length; i++) {
                var p1 = this.room.getPositionAt(objects[i][0], objects[i][1]);
                if (i == 0) {
                    // Top.
                    roads.push([p1, p1]);
                }
                else {
                    var left = roads[roads.length-1][0];
                    var right = roads[roads.length-1][1];
                    if (p1.x <= left.x) {
                        // Left
                        roads.push([p1, right]);
                        var path = this.room.findPath(p1, left, {ignoreRoads: true, ignoreCreeps:true});
                        this.room.memory.roads_plan.push(path);
                        this.fn_create_construction_sites(path, STRUCTURE_ROAD);
                    }
                    else {
                        // Right
                        roads.push([left, p1]);
                        var path = this.room.findPath(p1, right, {ignoreRoads: true, ignoreCreeps:true});
                        this.room.memory.roads_plan.push(path);
                        this.fn_create_construction_sites(path, STRUCTURE_ROAD);
                    } 
                    if (errors == false) {
                        errors = this.fn_check_csites(path);
                    }
                }
            }
            // Connect bottom.
            var path = this.room.findPath(roads[roads.length-1][0], roads[roads.length-1][1], {ignoreRoads: true, ignoreCreeps:true});
            this.room.memory.roads_plan.push(path);
            this.fn_create_construction_sites(path, STRUCTURE_ROAD);
            if (errors == false) {
                errors = this.fn_check_csites(path);
            }
        }
        else {
            // Get plan and build roads!
            for (var plan_i in this.room.memory.roads_plan) {
                if (errors == false) {
                    var path = this.room.memory.roads_plan[plan_i];
                    this.fn_create_construction_sites(path, STRUCTURE_ROAD);
                    if (errors == false) {
                        errors = this.fn_check_csites(path);
                    }
                }
            }
        }
        if (errors == false) {
            this.room.memory.walls = true;
            console.log("Roads project : done")
        }
        else {
            console.log('There is smth wrong with the room.');
        }
        // var csites = this.room.find(FIND_CONSTRUCTION_SITES);
        //     for (var csite_i in csites) {
        //         if (csites[csite_i].structureType == 'road') {
        //             csites[csite_i].remove();
        //         }
        //     }
       // Memory.junk = objects;
        //console.log(objects);
    }
    else {
        if (this.room.controller.level < 4) {
            return;
        }
        if (!this.room.memory.wall_project) {
            // Create walls.
            var wall_borders = {
                left_x: 0,
                top_y: 0,
                right_x: 0,
                bottom_y: 0,
            }
            // Find top_y
            for (var y = 2; y < 47; y++) {
                for (var x = 2; x < 47; x++) {
                    var obj = this.room.lookAt(x, y);
                    switch (obj[0].type) {
                        case 'source':
                        case 'structure':
                        case 'mineral':
                            wall_borders.top_y = y;
                            break;
                    }
                    if (wall_borders.top_y != 0) {
                        break;
                    }
                }
            }
            // Find bottom_y
            for (var y = 47; y > 2; y--) {
                for (var x = 2; x < 47; x++) {
                    var obj = this.room.lookAt(x, y);
                    switch (obj[0].type) {
                        case 'source':
                        case 'structure':
                        case 'mineral':
                            wall_borders.bottom_y = y;
                            break;
                    }
                    if (wall_borders.bottom_y != 0) {
                        break;
                    }
                }
            }
            // Find left_x
            for (var x = 2; x < 47; x++) {
                for (var y = 2; y < 47; y++) {
                    var obj = this.room.lookAt(x, y);
                    switch (obj[0].type) {
                        case 'source':
                        case 'structure':
                        case 'mineral':
                            wall_borders.left_x = x;
                            break;
                    }
                    if (wall_borders.left_x != 0) {
                        break;
                    }
                }
            }
            // Find left_x
            for (var x = 47; x > 2; x--) {
                for (var y = 2; y < 47; y++) {
                    var obj = this.room.lookAt(x, y);
                    switch (obj[0].type) {
                        case 'source':
                        case 'structure':
                        case 'mineral':
                            wall_borders.right_x = x;
                            break;
                    }
                    if (wall_borders.right_x != 0) {
                        break;
                    }
                }
            }
            var wall_project = [];
            // Top wall.
            wall_project.push(this.fn_wall_from_to_x(this.fn_calculate_posible_path(wall_borders.left_x - 4), this.fn_calculate_posible_path(wall_borders.right_x + 4), this.fn_calculate_posible_path(wall_borders.top_y - 4)));
            // // Bottom wall.
            wall_project.push(this.fn_wall_from_to_x(this.fn_calculate_posible_path(wall_borders.left_x - 4), this.fn_calculate_posible_path(wall_borders.right_x + 4), this.fn_calculate_posible_path(wall_borders.bottom_y + 4)));
            // Left wall.
            wall_project.push(this.fn_wall_from_to_y(this.fn_calculate_posible_path(wall_borders.top_y - 4), this.fn_calculate_posible_path(wall_borders.bottom_y + 4), this.fn_calculate_posible_path(wall_borders.left_x - 4)));
            // // Right wall.
            wall_project.push(this.fn_wall_from_to_y(this.fn_calculate_posible_path(wall_borders.top_y - 4), this.fn_calculate_posible_path(wall_borders.bottom_y + 4), this.fn_calculate_posible_path(wall_borders.right_x + 4)));
            console.log("Walls project : done");
            
            ///
            ///
            wall_project = this.fn_exits_from_box(wall_project);
            ///
            ///
            this.room.memory.wall_project = wall_project;
            console.log('Wall project done.');
        }
        else {
            if (this.room.controller.level >= 4) {
                for (var i in this.room.memory.wall_project) {
                    var wall_p = this.room.memory.wall_project[i];
                    for (var n in wall_p) {
                        var built_roomPosition = this.room.getPositionAt(wall_p[n].x, wall_p[n].y);
                        this.room.createConstructionSite(built_roomPosition, STRUCTURE_WALL);
                    }
                }
            }
        }
    }
        //  var csites = this.room.find(FIND_CONSTRUCTION_SITES);
        //  for (var csite_i in csites) {
        //      if (csites[csite_i].structureType == 'constructedWall') {
        //          csites[csite_i].remove();
        //      }
        //  }
}

// Generate exits from a base box.
Spawn.prototype.fn_exits_from_box = function(wall_project) {
    // Generate path from spawn to any exit. Run over the path from the beginning and found where path is contacting
    // with walls. Remove wall project on that location.
    var current_room_connecions = Game.map.describeExits(this.room.name);
    // Get all keys
    for(var exit in current_room_connecions) {
        var route = Game.map.findRoute(this.room.name, current_room_connecions[exit]);
        var exit_loc = this.pos.findClosestByRange(route[0].exit);
        var path = this.room.findPath(this.pos, exit_loc, {ignoreRoads: true, ignoreCreeps: true});

        // Update borders so they will be correct.
        var wall_borders = {
            left_x: this.fn_calculate_posible_path(wall_borders.left_x - 4),
            top_y: this.fn_calculate_posible_path(wall_borders.top_y - 4),
            right_x: this.fn_calculate_posible_path(wall_borders.right_x + 4),
            bottom_y: this.fn_calculate_posible_path(wall_borders.bottom_y + 4),
        }

        // Run over the path.
        for (var i in path) {
            var connected_x = path[i].x;
            var connected_y = path[i].y;
            if (connected_x == wall_borders.left_x) {
                wall_project[2] = this.fn_clean_wall_elm(wall_project[2], connected_x, connected_y);
                break;
            }
            if (connected_x == wall_borders.right_x) {
                wall_project[3] = this.fn_clean_wall_elm(wall_project[3], connected_x, connected_y);
                break;
            }
            if (connected_y == wall_borders.top_y) {
                wall_project[0] = this.fn_clean_wall_elm(wall_project[0], connected_x, connected_y);
                break;
            }
            if (connected_y == wall_borders.bottom_y) {
                wall_project[1] = this.fn_clean_wall_elm(wall_project[1], connected_x, connected_y);
                break;
            }
        }   
    }
    return wall_project;
}

/**
 * project - wall part object.
 */
Spawn.prototype.fn_clean_wall_elm = function(project, x, y) {
    //console.log("#######")
    //console.log(project.length)
    for (var i in project) {
        if (project[i].x == x && project[i].y == y) {
            ////////
            //f (roomPosition[0].type == 'terrain' && roomPosition[0].terrain != 'wall') {
            var roomPosition = {
                top: this.room.lookAt(x, y-1),
                bottom: this.room.lookAt(x, y+1),
                left: this.room.lookAt(x-1, y),
                right: this.room.lookAt(x+1, y),
            }
            if (roomPosition.top[0].type == 'terrain' && roomPosition.top[0].terrain == 'wall' ||
            roomPosition.bottom[0].type == 'terrain' && roomPosition.bottom[0].terrain == 'wall' ||
            roomPosition.left[0].type == 'terrain' && roomPosition.left[0].terrain == 'wall' ||
            roomPosition.right[0].type == 'terrain' && roomPosition.right[0].terrain == 'wall'
            ) {
                project = this.fn_run_over_prj(project, i);
            }
            else {
                //console.log('removed ' + x + ' ' + y)
                project.splice(i,1);
                break;
            }
            ////////
            // console.log('removed ' + x + ' ' + y)
            // project.splice(i,1);
            // break;
        }
    }
    //console.log(project.length)
    //console.log("#######")
    return project;
}

Spawn.prototype.fn_run_over_prj = function(project, strart_from) {
    for (var i = strart_from; i < project.length; i++) {
        var roomPosition = {
                top: this.room.lookAt(project[i].x, project[i].y-1),
                bottom: this.room.lookAt(project[i].x, project[i].y+1),
                left: this.room.lookAt(project[i].x-1, project[i].y),
                right: this.room.lookAt(project[i].x+1, project[i].y),
            }
        if (roomPosition.top[0].type == 'terrain' && roomPosition.top[0].terrain != 'wall' &&
        roomPosition.bottom[0].type == 'terrain' && roomPosition.bottom[0].terrain != 'wall' &&
        roomPosition.left[0].type == 'terrain' && roomPosition.left[0].terrain != 'wall' &&
        roomPosition.right[0].type == 'terrain' && roomPosition.right[0].terrain != 'wall') {
           // console.log(222);
                project.splice(i,1);
                break;
        }
    }
    return project;
}

// Return array with coordinates of wall project for top and down..
Spawn.prototype.fn_wall_from_to_x = function(start_x, end_x, y) {
    //console.log("PRJ " + start_x + ' ' + end_x + ' ' + y)
    // Array that will be returned.
    var return_arr = [];
    for (var x = start_x; x < end_x + 1; x++) {
        var roomPosition = this.room.lookAt(x, y);
        if (roomPosition[0].type == 'terrain' && roomPosition[0].terrain != 'wall') {
            var roomPosition = this.room.getPositionAt(x, y)
            return_arr.push(roomPosition)
        }
    }
    return return_arr;
}

// Return array with coordinates of wall project for top and down..
Spawn.prototype.fn_wall_from_to_y = function(start_y, end_y, x) {
    //console.log("PRJ " + start_x + ' ' + end_x + ' ' + y)
    // Array that will be returned.
    var return_arr = [];
    for (var y = start_y; y < end_y + 1; y++) {
        var roomPosition = this.room.lookAt(x, y);
        if (roomPosition[0].type == 'terrain' && roomPosition[0].terrain != 'wall') {
            var roomPosition = this.room.getPositionAt(x, y)
            return_arr.push(roomPosition)
        }
    }
    return return_arr;
}

Spawn.prototype.fn_check_csites = function(path) {
    var errors = false;
    for (var i in path) {
        var what = this.room.lookAt(path[i].x, path[i].y);
        if (what[0].type == 'creep' || what[0].type == 'mineral') {
            continue;
        }
        if (what[0].type != 'constructionSite' && what[0].type != 'source' && what[0].type != 'structure') {
            console.log(what[0].type)
            return true;
        }
    }
    return errors;
}

Spawn.prototype.fn_controll_towers = function() {  
    var towers = this.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_TOWER;
                    }
            });
    for (var i in towers) {
        var tower = towers[i];
        
        var my_creeps = tower.room.find(FIND_MY_CREEPS, {
            filter: (s) => s.hits < s.hitsMax});
        if (my_creeps.length > 0) {
            var closest_creep = tower.pos.findClosestByRange(my_creeps);
            tower.heal(closest_creep);
        }
        // var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        //     filter: (structure) => structure.hits < structure.hitsMax
        // });
        
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => s.hits < s.hitsMax &&
            s.structureType != STRUCTURE_WALL &&
            s.structureType != STRUCTURE_RAMPART
            
        });
        
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
}

Spawn.prototype.fn_get_construction_loc = function() {
    var roads = this.room.find(FIND_STRUCTURES, {
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
            var roomPosition = this.room.getPositionAt(new_x, new_y);
            if (this.room.lookForAt('structure', roomPosition).length == 0 && 
                this.room.lookForAt('constructionSite', roomPosition).length == 0) {
                return roomPosition;
            }
        }
    }
    return false;
}

Spawn.prototype.fn_build_towers = function() {
    if (Game.time % 20 == 0) {
        return;
    }
    var towers = this.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_TOWER;
                    }
            });
    var avail = 0;
    switch(this.room.controller.level) {
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
    if (towers.length < avail) {
        var roomPosition = this.fn_get_construction_loc();
        if (roomPosition != false) {
            this.room.createConstructionSite(roomPosition, STRUCTURE_TOWER);
        }
    }
}

Spawn.prototype.fn_build_extentions = function() {
    if (Game.time%15 === 0) {
        return;
    }
    // Get extention plan at first.
    if (!this.room.memory.extention_plan) {
        var plan = {};
        // Search for all sources.
        var sources = this.room.find(FIND_SOURCES);
        // Find source that is closer to the center of the room.
        var closest = this.pos.findClosestByRange(sources);
        // Place from what we'll start the building process.
        var empty_place = false;
        for (var y=-1; y<3; y++){
            for (var x=-1; x<3; x++){
                var new_x = this.fn_calculate_posible_path(closest.pos.x - x);
                var new_y = this.fn_calculate_posible_path(closest.pos.y - y);
                var roomPosition = this.room.lookAt(new_x, new_y);
                if (roomPosition[0].type == 'terrain' && roomPosition[0].terrain != 'wall') {
                    empty_place = {
                        x: new_x,
                        y: new_y,
                    }
                    break;
                }
            }
            if (empty_place !== false) {
                break;
            }
        }
        plan.x = empty_place.x;
        plan.y = empty_place.y;
        plan.directions = {};
        // Find where we'll plan to build things.
        // half of the room is 25, but we can build only on 48 locations.
        // so half will be 24.
        plan.directions.x = 'left';
        if ((48 - plan.x) > 24) {
            plan.directions.x = 'right';
        }
        
        if (plan.y > closest.pos.y) {
            plan.directions.y = 'down';
        }
        else {
            plan.directions.y = 'up';
        }
        this.room.memory.extention_plan = plan;
    }
    if (this.room.memory.extention_plan) {
        var built_roomPosition = false;
        var place_found = false;
        var total_zone = 16;
        var current_step = 0;
        var one_step = 2;
        var build_on_x = 0;
        var build_on_y = 0;
        // Find place for building.
        if (this.room.memory.extention_plan.directions.x == 'left') {
            build_on_x = this.room.memory.extention_plan.x - 1;
        }
        else {
            build_on_x = this.room.memory.extention_plan.x + 1;
        }
        build_on_y = this.room.memory.extention_plan.y - 8;
    
        var exts = this.room.find(STRUCTURE_EXTENSION);
        if (!exts) {
            var exts_built = 0;
        }
        else {
            exts_built = exts.length;
        }
        var csites = this.room.find(FIND_CONSTRUCTION_SITES);
        this.room.memory.extensions = exts.length;
        for (var csite_i in csites) {
            if (csites[csite_i].structureType == 'extension') {
                this.room.memory.extensions += 1;
            }
        }
    
        var extensions_avail = 0;
        switch(this.room.controller.level) {
            case 1:
                extensions_avail = 0;
            break;
            case 2:
                extensions_avail = 5;
            break;
            case 3:
                extensions_avail = 10; 
            break;
            default:
                extensions_avail = this.room.controller.level * 10 - 20;
            break;
        }
        // REFACTOR NEEDED!!!
        if (exts_built < extensions_avail) {
            var found = false;
            var total_len = 10;
            var step = 2;
            var plan = this.room.memory.extention_plan;
            var roomPosition = {};
            if (plan.directions.x == 'right') {
                for (var x = plan.x + 1; x < total_len + plan.x; x+=1) {
                    if (x > 47) {
                        console.log("Buuug")
                        Game.notify('Room ' + this.room.name + " cant build extentions.");
                        this.fn_build_extentions_near_road();
                        break;
                    }
                    var start_y = plan.y - total_len;
                    if (x%2) {
                        start_y++;
                    }
                    for (var y = start_y; y < total_len + plan.y; y+=step) {
                        if (y < 3) {
                            Game.notify('Room ' + this.room.name + " cant build extentions.");
                            this.fn_build_extentions_near_road();
                            break;
                        }
                        if (y > 47) {
                            Game.notify('Room ' + this.room.name + " cant build extentions.");
                            this.fn_build_extentions_near_road();
                            break;
                        }
                        var roomPosition = this.room.lookAt(x, y);
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
                        Game.notify('Room ' + this.room.name + " cant build extentions.");
                        this.fn_build_extentions_near_road();
                        break;
                    }
                    var start_y = plan.y - total_len;
                    if (x%2) {
                        start_y++;
                    }
                    for (var y = start_y; y < total_len + plan.y; y+=step) {
                        if (y < 3) {
                            Game.notify('Room ' + this.room.name + " cant build extentions.");
                            this.fn_build_extentions_near_road();
                            break;
                        }
                        if (y > 47) {
                            Game.notify('Room ' + this.room.name + " cant build extentions.");
                            this.fn_build_extentions_near_road();
                            break;
                        }
                        var roomPosition = this.room.lookAt(x, y);
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
            /*
            	extention_plan		{3}
                    x	:	18
                    y	:	21
                    	directions		{2}
                    x	:	right
                    y	:	down 
            */
                if (found == true) {
                    var built_roomPosition = this.room.getPositionAt(roomPosition.x, roomPosition.y);
                    this.room.createConstructionSite(built_roomPosition, STRUCTURE_EXTENSION);
                }
            //this.room.createConstructionSite(built_roomPosition, STRUCTURE_EXTENSION);
        }
    }
}

Spawn.prototype.fn_build_extentions_near_road = function() {
    var exts = this.room.find(STRUCTURE_EXTENSION);
    if (!exts) {
        var exts_built = 0;
    }
    else {
        exts_built = exts.length;
    }
    var csites = this.room.find(FIND_CONSTRUCTION_SITES);
    this.room.memory.extensions = exts.length;
    for (var csite_i in csites) {
        if (csites[csite_i].structureType == 'extension') {
            this.room.memory.extensions += 1;
        }
    }

    var extensions_avail = 0;
    switch(this.room.controller.level) {
        case 1:
            extensions_avail = 0;
        break;
        case 2:
            extensions_avail = 5;
        break;
        case 3:
            extensions_avail = 10; 
        break;
        default:
            extensions_avail = this.room.controller.level * 10 - 20;
        break;
    }
    // REFACTOR NEEDED!!!
    if (exts_built < extensions_avail) {
        var roomPosition = this.fn_get_construction_loc();
        if (roomPosition != false) {
            this.room.createConstructionSite(roomPosition, STRUCTURE_EXTENSION);
        }
    }
}

Spawn.prototype.fn_calculate_posible_path = function(coordinates) {
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

Spawn.prototype.fn_discover_room = function() {
    if (Game.time % 10 === 0)
    creepFunctions.fn_save_room_sources(this.room);
    //
    //// Order to build walls
    //if (this.room.controller.level > 0) {
    //    if (!this.room.memory.walls) {
    //        var upper_wall = [];
    //        var errors = 0;
    //        for (var x = 2; x < 48; x++) {
    //            var built_roomPosition = this.room.getPositionAt(x, 2);
    //            errors += this.room.createConstructionSite(built_roomPosition, STRUCTURE_EXTENSION);
    //            var built_roomPosition = this.room.getPositionAt(2, x);
    //            errors += this.room.createConstructionSite(built_roomPosition, STRUCTURE_EXTENSION);
    //            var built_roomPosition = this.room.getPositionAt(x, 47);
    //            errors += this.room.createConstructionSite(built_roomPosition, STRUCTURE_EXTENSION);
    //            var built_roomPosition = this.room.getPositionAt(47, x);
    //            errors += this.room.createConstructionSite(built_roomPosition, STRUCTURE_EXTENSION);
    //        }
    //        if (errors == 0) {
    //            this.room.memory.walls = true;
    //        }
    //    }
    //}
}

// This function will build roads and connects all structures in the room.
Spawn.prototype.fn_build_roads = function() {
    // if (this.room.controller.level == 1) {
    //     // Find sources and build roads from them to room controller,
    //     // and from spawn to sources
    //     var sources = this.room.find(FIND_SOURCES);
    //     for (var source_i in sources) {
    //         var source = sources[source_i];
    //         // Road from source to controller.
    //         var path = this.room.findPath(source.pos, this.room.controller.pos, {ignoreRoads: true, ignoreCreeps:true});
    //         this.fn_create_construction_sites(path, STRUCTURE_ROAD);
    //         // Road from Spawn to source.
    //         var path = this.room.findPath(this.pos, source.pos, {ignoreRoads: true, ignoreCreeps:true});
    //         this.fn_create_construction_sites(path, STRUCTURE_ROAD);
    //     }
    //     // Road from spawn to controller.
    //     var path = this.room.findPath(this.pos, this.room.controller.pos, {ignoreRoads: true, ignoreCreeps:true});
    //     this.fn_create_construction_sites(path, STRUCTURE_ROAD);
    // }
}

// This function will create a structure on a given path.
Spawn.prototype.fn_create_construction_sites = function(path, construction) {
    // Run over the path and build something on its locations.
    for (var index in path) {
        var item = path[index];
        var roomPosition = this.room.getPositionAt(item.x, item.y);
        // If there is an empty place.
        if (this.room.lookForAt('structure', roomPosition).length == 0 && 
        this.room.lookForAt('constructionSite', roomPosition).length == 0) {
            // Build for a structure.
            this.room.createConstructionSite(roomPosition, construction);
        }
    }
}