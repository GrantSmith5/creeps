var roleFatHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.inPosition) {
            var source = creep.pos.findClosestByRange(FIND_SOURCES);
            if(source.energy > 0 && creep.carry.energy < creep.carryCapacity){
                creep.harvest(source);
            }
            var containers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure)  => {
                    return (structure.structureType == STRUCTURE_STORAGE)
                }
            });
            if(creep.transfer(creep.pos.findClosestByRange(containers), RESOURCE_ENERGY) !== 0){
                
                var tower = creep.pos.findInRange(FIND_STRUCTURES, {
                    filter: (structure)  => {
                        return (structure.structureType == STRUCTURE_TOWER)
                    }
                }, 1);
                if(tower){
                    creep.transfer(tower);
                }
            }
            
	    }
	    else{
            var viablePositions = [[28,39],[30,39]];
            var targetPosition = viablePositions[0];
            for(var name in Game.creeps) {
                var ocreep = Game.creeps[name];
                if(ocreep !== creep) {
                    if(ocreep.pos.x === viablePositions[0][0] && ocreep.pos.y === viablePositions[0][1]) {
                        var targetPosition = viablePositions[1];
                    }
                }
            }
            creep.moveTo(targetPosition[0],targetPosition[1]);
            if(creep.pos.x === targetPosition[0] && creep.pos.y === targetPosition[1]){
                creep.memory.inPosition = true;
            }
        }
	}
};

module.exports = roleFatHarvester;