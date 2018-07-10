var roleSoldier = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var chaaarge = true;
        var stageInvasion = false;
        var specialTargets = [];
        var specialTarget = Game.getObjectById('5b3b6c552814d977f694cff8');

        if(stageInvasion === true){
            creep.moveTo(Game.flags['Flag1']);
        }

        if(chaaarge === true){
            
            if(specialTarget){
                if(creep.attack(specialTarget) == ERR_NOT_IN_RANGE){
                    creep.moveTo(specialTarget);
                }
            }
                /*
                if(creep.attack(specialTargets[0] === -7)){
                    specialTargets.shift();
                }
                else{
                    if(creep.attack(specialTargets[0]) == ERR_NOT_IN_RANGE){
                        creep.moveTo(specialTargets[0]);
                    }
                }
                
            }
            else{
                */
               /*
                const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    if(target) {
                        if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);
                        }
                    }
                    */
                
        }
	}
};

module.exports = roleSoldier;