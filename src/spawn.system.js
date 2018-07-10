const spawnSystem = {

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
        where = spawn || 0;
        if (where === 0) {
            Game.spawns.Spawn1.room.controller.activateSafeMode();
        } else {
            Game.spawns[where].room.controller.activateSafeMode();
        }
    },

    /** @param {spawn} string * */
    autoSpawn(spawn) {
        const harvesters = _.filter(Game.creeps, creep => creep.memory.role == 'harvester');
        console.log(`Harvesters: ${harvesters.length}`);

        const harvestersMax = 3;
        if (harvesters.length < harvestersMax) {
            var newName = `Harvester${Game.time}`;
            console.log(`Spawning new harvester: ${newName}`);
            if (harvesters.length >= 1) {
                Game.spawns[spawn].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
                    { memory: { role: 'harvester' } });
            } else {
                Game.spawns.Spawn1.spawnCreep([WORK, CARRY, MOVE], newName,
                    { memory: { role: 'harvester' } });
            }
        }

        if (harvesters.length === harvestersMax) {
            const soldiers = _.filter(Game.creeps, creep => creep.memory.role == 'soldier');
            console.log(`Soldiers: ${soldiers.length}`);

            if (soldiers.length < 0) {
                var newName = `Soldier${Game.time}`;
                console.log(`Spawning new soldier: ${newName}`);
                Game.spawns.Spawn1.spawnCreep([TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, MOVE, ATTACK], newName,
                    { memory: { role: 'soldier' } });
            }
            const builders = _.filter(Game.creeps, creep => creep.memory.role == 'builder');
            console.log(`Builders: ${builders.length}`);

            if (builders.length < 0) {
                var newName = `Builder${Game.time}`;
                console.log(`Spawning new builder: ${newName}`);
                Game.spawns.Spawn1.spawnCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName,
                    { memory: { role: 'builder' } });
            }

            const repairers = _.filter(Game.creeps, creep => creep.memory.role == 'repairer');
            console.log(`Repairers: ${repairers.length}`);

            if (repairers.length < 1) {
                var newName = `Repairer${Game.time}`;
                console.log(`Spawning new repairer: ${newName}`);
                Game.spawns.Spawn1.spawnCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE], newName,
                    { memory: { role: 'repairer' } });
            }

            const upgraders = _.filter(Game.creeps, creep => creep.memory.role == 'upgrader');
            console.log(`Upgraders: ${upgraders.length}`);

            if (upgraders.length < 3) {
                var newName = `Upgrader${Game.time}`;
                console.log(`Spawning new upgrader: ${newName}`);
                Game.spawns.Spawn1.spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
                    { memory: { role: 'upgrader' } });
            }
        }
        // spawn messages
        if (Game.spawns.Spawn1.spawning) {
            const spawningCreep = Game.creeps[Game.spawns.Spawn1.spawning.name];
            Game.spawns.Spawn1.room.visual.text(
                `🛠️${spawningCreep.memory.role}`,
                Game.spawns.Spawn1.pos.x + 1,
                Game.spawns.Spawn1.pos.y,
                { align: 'left', opacity: 0.8 }
            );
        }
    },
};

module.exports = spawnSystem;
