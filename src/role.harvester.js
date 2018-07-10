const roleHarvester = {

    /** @param {Creep} creep * */
    run(creep) {
        if (creep.carry.energy < creep.carryCapacity) {
            const source = creep.room.find(FIND_SOURCES);
            let sTarget = source[0];
            for (const name in Game.creeps) {
                const ocreep = Game.creeps[name];
                if (ocreep !== creep) {
                    if (ocreep.pos.x === 30 && ocreep.pos.y === 39) {
                        sTarget = source[1];
                    }
                }
            }
            if (creep.harvest(sTarget) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sTarget, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        } else {
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: structure => ((structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN
                            || structure.structureType === STRUCTURE_TOWER)
                            && structure.energy < structure.energyCapacity),
            });
            const secondaryTargets = creep.room.find(FIND_STRUCTURES, {
                filter: structure => (structure.structureType === STRUCTURE_STORAGE
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
        }
    },
};

module.exports = roleHarvester;
