const roleFatHarvester = {

    /** @param {Creep} creep * */
    run(creep) {
        if (creep.memory.inPosition) {
            const source = creep.pos.findClosestByRange(FIND_SOURCES);
            if (source.energy > 0 && creep.carry.energy < creep.carryCapacity) {
                creep.harvest(source);
            }
            const containers = creep.room.find(FIND_STRUCTURES, {
                filter: structure => (structure.structureType == STRUCTURE_STORAGE),
            });
            if (creep.transfer(creep.pos.findClosestByRange(containers), RESOURCE_ENERGY) !== 0) {
                const tower = creep.pos.findInRange(FIND_STRUCTURES, {
                    filter: structure => (structure.structureType == STRUCTURE_TOWER),
                }, 1);
                if (tower) {
                    creep.transfer(tower);
                }
            }
        } else {
            const viablePositions = [[28, 39], [30, 39]];
            var targetPosition = viablePositions[0];
            for (const name in Game.creeps) {
                const ocreep = Game.creeps[name];
                if (ocreep !== creep) {
                    if (ocreep.pos.x === viablePositions[0][0] && ocreep.pos.y === viablePositions[0][1]) {
                        var targetPosition = viablePositions[1];
                    }
                }
            }
            creep.moveTo(targetPosition[0], targetPosition[1]);
            if (creep.pos.x === targetPosition[0] && creep.pos.y === targetPosition[1]) {
                creep.memory.inPosition = true;
            }
        }
    },
};

module.exports = roleFatHarvester;
