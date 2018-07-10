var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.repairing = true;
	        creep.say('🚧 repair');
	    }

	    if(creep.memory.repairing) {
	        var targets = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => structure.hits < structure.hitsMax && structure.structureType === STRUCTURE_ROAD
			});
			targets.sort(function(a,b){return a.hits - b.hits});
			var lowTargets = [];
			for(var targetID in targets){
				if(targets[targetID].hits <= targets[0].hits){
					lowTargets.push(targets[targetID]);
				}
			}
			var priorityTarget = creep.pos.findClosestByRange(lowTargets);
            if(targets.length > 0) {
                if(creep.repair(priorityTarget) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(priorityTarget, {visualizePathStyle: {stroke: '#ffffff'}});
                }
			}
			else{
				creep.moveTo(Game.flags['Flag2']);
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

module.exports = roleRepairer;