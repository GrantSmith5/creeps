const alarmSystem = (function() {
    let underAttackTimer = 0;
    let underAttack = false;
    let previousStructures;
    let previousStructuresNoDecay;

    return {
        /** @param {} * */
        raiseAlarm() {
            underAttackTimer = 100;
        },

        /** @param {} * */
        falseAlarm() {
            underAttackTimer = 0;
        },

        /** @param {spawn} string * */
        safeMode(spawn) {
            let where = spawn || 0;
            if (where === 0) {
                Game.spawns.Spawn1.room.controller.activateSafeMode();
            } else {
                Game.spawns[where].room.controller.activateSafeMode();
            }
        },

        /** @param {} * */
        checkForAttack() {
            const currentStructuresNoDecay = Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {
                filter: structure => (structure.structureType !== STRUCTURE_ROAD && structure.structureType !== STRUCTURE_CONTAINER
                        && structure.structureType !== STRUCTURE_RAMPART)
                        && structure.hits < structure.hitsMax,
            });
            const currentStructures = Game.spawns.Spawn1.room.find(FIND_STRUCTURES);

            if (Game.spawns.Spawn1.room.find(FIND_HOSTILE_CREEPS)) {
                if (previousStructures !== undefined && previousStructures.length > currentStructures.length) {
                    underAttackTimer = 100;
                    Game.spawns.Spawn1.room.controller.activateSafeMode();
                } else if (previousStructuresNoDecay !== undefined) {
                    for (let name of previousStructuresNoDecay.keys) {
                        if (previousStructuresNoDecay[name].hits > currentStructuresNoDecay[name].hits) {
                            underAttackTimer = 100;
                        }
                    }
                }
            }

            if (underAttackTimer > 0) {
                underAttack = true;
                underAttackTimer -= 1;
            } else {
                underAttack = false;
            }

            if ((underAttack && Game.time % 2 === 0) || underAttackTimer === 99) {
                console.log('ALERT!!! SPAWN1 IS UNDER ATTACK! ... SPAWN1 IS UNDER ATTACK!');
            }

            previousStructures = currentStructures;
            previousStructuresNoDecay = currentStructuresNoDecay;
        }
    };
})();

module.exports = alarmSystem;
