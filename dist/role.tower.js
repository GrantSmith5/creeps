var roleTower = {

    /** @param {Tower, r} tower **/
    run: function(tower, repair) {
        if(repair && !underAttack) {
            var targets = tower.room.find(FIND_STRUCTURES, {
                filter: (structure) => (structure.structureType !== STRUCTURE_ROAD && structure.hits < structure.hitsMax)
            });
            targets.sort(function(a,b){return a.hits - b.hits});
            var lowTargets = [];
            for(var targetID in targets){
                var target = targets[targetID];
                if(targets[targetID].hits === targets[0].hits){
                    lowTargets.push(targets[targetID]);
                }
            }
            var closestDamagedStructure = tower.pos.findClosestByRange(lowTargets);
            if(closestDamagedStructure && tower.energy > 750) {
                tower.repair(closestDamagedStructure);
            }
            
        }   
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
};
    
module.exports = roleTower;