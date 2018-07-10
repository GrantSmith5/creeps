const roleHarvester = require('role.harvester');
const roleFatHarvester = require('role.fat.harvester');
const roleHauler = require('role.hauler');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRepairer = require('role.repairer');
const roleSoldier = require('role.soldier');
const roleTower = require('role.tower');
const alarmSystem = require('alarm.system');
// var spawnSystem = require('auto.spawn.system');

module.exports.loop = function () {
    console.log(`************ Tick# ${Game.time} Start ************`);

    // garbage collection
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // alarm system and auto safemode
    alarmSystem.checkForAttack();

    // auto spawn system
    const harvesterMaxIdeal = 3;
    const haulerMaxIdeal = 2;
    const fatHarvesterMaxIdeal = 2;
    const builderMaxIdeal = 2;
    const upgraderMaxIdeal = 1;
    const repairerMaxIdeal = 1;
    const soldierMaxIdeal = 0;

    let harvestersMax, haulersMax, fatHarvestersMax;
    if (Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {
        filter: structure => (structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE),
    }) < 1) {
        harvestersMax = harvesterMaxIdeal;
        haulersMax = 0;
        fatHarvestersMax = 0;
    } else {
        harvestersMax = 0;
        haulersMax = haulerMaxIdeal;
        fatHarvestersMax = fatHarvesterMaxIdeal;
    }


    const harvesters = _.filter(Game.creeps, creep => creep.memory.role == 'harvester');
    if (harvesters.length > 0) {
        console.log(`Harvesters: ${harvesters.length}`);
    }
    if (harvesters.length < harvestersMax) {
        let newName = `Harvester${Game.time}`;
        console.log(`Spawning new harvester: ${newName}`);
        if (harvesters.length >= 1) {
            Game.spawns.Spawn1.spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
                { memory: { role: 'harvester' } });
        } else {
            Game.spawns.Spawn1.spawnCreep([WORK, CARRY, MOVE], newName,
                { memory: { role: 'harvester' } });
        }
    }

    const fatHarvesters = _.filter(Game.creeps, creep => creep.memory.role == 'fatHarvester');
    if (fatHarvesters.length > 0) {
        console.log(`fatHarvesters: ${fatHarvesters.length}`);
    }
    if (fatHarvesters.length < fatHarvestersMax) {
        let newName = `fatHarvester${Game.time}`;
        console.log(`Spawning new fatHarvester: ${newName}`);
        if (fatHarvesters.length >= 1 || Game.spawns.Spawn1.room.energyAvailable >= 700) {
            Game.spawns.Spawn1.spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE], newName,
                { memory: { role: 'fatHarvester' } });
        } else {
            Game.spawns.Spawn1.spawnCreep([WORK, CARRY, MOVE], newName,
                { memory: { role: 'fatHarvester' } });
        }
    }

    const haulers = _.filter(Game.creeps, creep => creep.memory.role == 'hauler');
    if (haulers.length > 0) {
        console.log(`Haulers: ${haulers.length}`);
    }
    if (haulers.length >= fatHarvesters.length && fatHarvesters.length < fatHarvestersMax) {
        haulersMax = 0;
    }
    if (haulers.length < haulersMax) {
        let newName = `Hauler${Game.time}`;
        console.log(`Spawning new hauler: ${newName}`);
        if (haulers.length >= 1 || Game.spawns.Spawn1.room.energyAvailable >= 300) {
            Game.spawns.Spawn1.spawnCreep([CARRY, CARRY, MOVE], newName,
                { memory: { role: 'hauler' } });
        } else {
            Game.spawns.Spawn1.spawnCreep([CARRY, MOVE], newName,
                { memory: { role: 'hauler' } });
        }
    }

    if (harvesters.length >= harvestersMax && haulers.length >= haulersMax && fatHarvesters.length >= fatHarvestersMax) {
        const soldiers = _.filter(Game.creeps, creep => creep.memory.role == 'soldier');
        if (soldiers.length > 0) {
            console.log(`Soldiers: ${soldiers.length}`);
        }
        if (soldiers.length < soldierMaxIdeal) {
            var newName = `Soldier${Game.time}`;
            console.log(`Spawning new soldier: ${newName}`);
            Game.spawns.Spawn1.spawnCreep([TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, MOVE, ATTACK], newName,
                { memory: { role: 'soldier' } });
        }
        const builders = _.filter(Game.creeps, creep => creep.memory.role == 'builder');
        if (builders.length > 0) {
            console.log(`Builders: ${builders.length}`);
        }
        if (builders.length < builderMaxIdeal) {
            let newName = `Builder${Game.time}`;
            console.log(`Spawning new builder: ${newName}`);
            Game.spawns.Spawn1.spawnCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
                { memory: { role: 'builder' } });
        }

        const repairers = _.filter(Game.creeps, creep => creep.memory.role == 'repairer');
        if (repairers.length > 0) {
            console.log(`Repairers: ${repairers.length}`);
        }
        if (repairers.length < repairerMaxIdeal) {
            let newName = `Repairer${Game.time}`;
            console.log(`Spawning new repairer: ${newName}`);
            Game.spawns.Spawn1.spawnCreep([WORK, CARRY, MOVE], newName,
                { memory: { role: 'repairer' } });
        }

        const upgraders = _.filter(Game.creeps, creep => creep.memory.role == 'upgrader');
        if (upgraders.length > 0) {
            console.log(`Upgraders: ${upgraders.length}`);
        }

        if (upgraders.length < upgraderMaxIdeal) {
            let newName = `Upgrader${Game.time}`;
            console.log(`Spawning new upgrader: ${newName}`);
            Game.spawns.Spawn1.spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
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

    // tower array
    const towers = Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {
        filter: structure => (structure.structureType === STRUCTURE_TOWER),
    });
    for (name in towers) {
        roleTower.run(towers[name], false);
    }


    // creep actions
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        if (creep.memory.role == 'fatHarvester') {
            roleFatHarvester.run(creep);
        }
        if (creep.memory.role == 'hauler') {
            roleHauler.run(creep);
        }
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        if (creep.memory.role == 'soldier') {
            roleSoldier.run(creep);
        }
    }
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        if (creep.memory.role == 'fatHarvester') {
            roleFatHarvester.run(creep);
        }
        if (creep.memory.role == 'hauler') {
            roleHauler.run(creep);
        }
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        if (creep.memory.role == 'soldier') {
            roleSoldier.run(creep);
        }
    }
};
