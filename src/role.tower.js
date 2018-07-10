const roleTower = {

    /** @param {Tower, r} tower * */
    run(tower, repair) {
        if (repair && !underAttack) {
            const targets = tower.room.find(FIND_STRUCTURES, {
                filter: structure => (structure.structureType !== STRUCTURE_ROAD && structure.hits < structure.hitsMax),
            });
            targets.sort((a, b) => a.hits - b.hits);
            const lowTargets = [];
            for (const targetID in targets) {
                const target = targets[targetID];
                if (targets[targetID].hits === targets[0].hits) {
                    lowTargets.push(targets[targetID]);
                }
            }
            const closestDamagedStructure = tower.pos.findClosestByRange(lowTargets);
            if (closestDamagedStructure && tower.energy > 750) {
                tower.repair(closestDamagedStructure);
            }
        }
        const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    },
};

module.exports = roleTower;
