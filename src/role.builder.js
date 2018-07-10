var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var worthContainers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_CONTAINER &&
                    structure.store.energy > creep.carryCapacity)
            }
        });

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && (creep.carry.energy === creep.carryCapacity || (creep.carry.energy > 0 && worthContainers.length === 0))) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else{
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => structure.structureType !== STRUCTURE_ROAD && structure.hits < structure.hitsMax
                });
                targets.sort(function(a,b){return a.hits - b.hits});
                var lowTargets = [];
                for(var targetID in targets){
                    if(targets[targetID].hits <= targets[0].hits + 10000){
                        lowTargets.push(targets[targetID]);
                    }
                }
                var priorityTarget = creep.pos.findClosestByRange(lowTargets);
                if(priorityTarget) {
                    if(creep.repair(priorityTarget) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(priorityTarget, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                else{
                    creep.moveTo(Game.flags['Flag2']);
                }
            }
	    }
	    else {
	        var freeStuff = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            if(creep.pickup(freeStuff) === ERR_NOT_IN_RANGE) {
                creep.moveTo(freeStuff, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
	        var idealContainers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE)&&
                        structure.store.energy >= creep.carryCapacity)
                }
            });
            if(idealContainers.length > 0){
                var sTarget = creep.pos.findClosestByRange(idealContainers);
            }
            else{
                var containers = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType === STRUCTURE_CONTAINER &&
                            structure.store.energy > 0)
                    }
                });
                var sTarget = creep.pos.findClosestByRange(containers);
            }
            if(creep.withdraw(sTarget,RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sTarget, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
	    }
	}
};

module.exports = roleBuilder;