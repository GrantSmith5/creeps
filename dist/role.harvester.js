var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.carry.energy < creep.carryCapacity) {
            var source = creep.room.find(FIND_SOURCES);
            var sTarget = source[0];
            for(var name in Game.creeps) {
                var ocreep = Game.creeps[name];
                if(ocreep !== creep) {
                    if(ocreep.pos.x === 30 && ocreep.pos.y === 39) {
                        sTarget = source[1];
                    }
                }
            }
            if(creep.harvest(sTarget) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sTarget, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN ||
                            structure.structureType === STRUCTURE_TOWER) &&
                            structure.energy < structure.energyCapacity)
                    }
            });
            var secondaryTargets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_STORAGE &&
                        structure.energy < structure.energyCapacity)
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(creep.pos.findClosestByRange(targets), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.pos.findClosestByRange(targets), {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else if(secondaryTargets.length > 0){
                if(creep.transfer(creep.pos.findClosestByRange(secondaryTargets), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.pos.findClosestByRange(secondaryTargets), {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else{
                creep.moveTo(Game.flags['Flag2']);
            }
        }
	}
};

module.exports = roleHarvester;