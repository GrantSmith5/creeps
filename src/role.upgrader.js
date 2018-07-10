var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var worthContainers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_CONTAINER &&
                    structure.store.energy > creep.carryCapacity)
            }
        });

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.upgrading && (creep.carry.energy === creep.carryCapacity || (creep.carry.energy > 0 && worthContainers.length === 0))) {
	        creep.memory.upgrading = true;
	        creep.say('⚡ upgrade');
	    }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            var idealContainers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE) &&
                        structure.store.energy >= creep.carryCapacity)
                }
            });
            var containers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_CONTAINER &&
                        structure.store.energy > 0)
                }
            });
            if(idealContainers.length > 0){
                var sTarget = creep.pos.findClosestByRange(idealContainers);
            }
            else{
                var sTarget = creep.pos.findClosestByRange(containers);
            }
            if(creep.withdraw(sTarget,RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sTarget, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            /*
            var idealContainers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_CONTAINER &&
                        structure.store.energy >= creep.carryCapacity)
                }
            });
            var containers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_CONTAINER &&
                        structure.store.energy > 0)
                }
            });
            if(idealContainers.length > 0){
                var sTarget = creep.pos.findClosestByRange(idealContainers);
            }
            else{
                var sTarget = creep.pos.findClosestByRange(containers);
            }
            if(creep.withdraw(sTarget,RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sTarget, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            */
        }
	}
};

module.exports = roleUpgrader;