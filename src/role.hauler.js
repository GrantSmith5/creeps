const roleHauler = {

    /** @param {Creep} creep * */
    run(creep) {
        const worthContainers = creep.room.find(FIND_STRUCTURES, {
            filter: structure => (structure.structureType === STRUCTURE_CONTAINER
                    && structure.store.energy > creep.carryCapacity),
        });

        if (creep.memory.hauling && creep.carry.energy == 0) {
            creep.memory.hauling = false;
            creep.say('🔄 pickup');
        }
        if (!creep.memory.hauling && (creep.carry.energy === creep.carryCapacity || (creep.carry.energy > 0 && worthContainers.length === 0))) {
            creep.memory.hauling = true;
            creep.say('🚧 haul');
        }

        if (creep.memory.hauling) {
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: structure => ((structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN)
                        && structure.energy < structure.energyCapacity),
            });
            const secondaryTargets = creep.room.find(FIND_STRUCTURES, {
                filter: structure => (structure.structureType === STRUCTURE_TOWER
                        && structure.energy < structure.energyCapacity),
            });

            if (targets.length > 0) {
                if (creep.transfer(creep.pos.findClosestByRange(targets), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.pos.findClosestByRange(targets), { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else if (secondaryTargets.length > 0) {
                if (creep.transfer(creep.pos.findClosestByRange(secondaryTargets), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.pos.findClosestByRange(secondaryTargets), { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
                creep.moveTo(Game.flags.Flag2);
            }
        } else {
            var freeStuff = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            if (creep.pickup(freeStuff) === ERR_NOT_IN_RANGE) {
                creep.moveTo(freeStuff, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
            const idealContainers = creep.room.find(FIND_STRUCTURES, {
                filter: structure => ((structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE)
                        && structure.store.energy >= creep.carryCapacity),
            });
            if (idealContainers.length > 0) {
                var sTarget = creep.pos.findClosestByRange(idealContainers);
            } else {
                const containers = creep.room.find(FIND_STRUCTURES, {
                    filter: structure => (structure.structureType === STRUCTURE_CONTAINER
                            && structure.store.energy > 0),
                });
                var sTarget = creep.pos.findClosestByRange(containers);
            }
            if (creep.withdraw(sTarget, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sTarget, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
            var freeStuff = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            if (creep.pickup(freeStuff) === ERR_NOT_IN_RANGE) {
                creep.moveTo(freeStuff, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    },
};

module.exports = roleHauler;
