var roleHarvester = require('role.harvester');
var roleFatHarvester = require('role.fat.harvester')
var roleHauler = require('role.hauler')
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleSoldier = require('role.soldier');
var roleTower = require('role.tower');
var alarmSystem = require('alarm.system');
//var spawnSystem = require('auto.spawn.system');


previousStructuresNoDecay = undefined;
previousStructures = undefined;
underAttackTimer = 0;


module.exports.loop = function () {

    console.log('************ Tick# ' + Game.time + ' Start ************');

    //garbage collection
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    //alarm system and auto safemode
    alarmSystem.checkForAttack();
    
    //auto spawn system
    var harvesterMaxIdeal = 3;
    var haulerMaxIdeal = 2;
    var fatHarvesterMaxIdeal = 2;
    var builderMaxIdeal = 2;
    var upgraderMaxIdeal = 1;
    var repairerMaxIdeal = 1
    var soldierMaxIdeal = 0;

    if(Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE)
            }
        }) < 1){
            var harvestersMax = harvesterMaxIdeal;
            var haulersMax = 0;
            var fatHarvestersMax = 0;
    }
    else{
        var harvestersMax = 0;
        var haulersMax = haulerMaxIdeal;
        var fatHarvestersMax = fatHarvesterMaxIdeal;
    }

    
    
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    if(harvesters.length > 0){
        console.log('Harvesters: ' + harvesters.length);
    }
    if(harvesters.length < harvestersMax) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        if (harvesters.length >= 1){
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
                {memory: {role: 'harvester'}});
        }
        else{
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
                {memory: {role: 'harvester'}});
        }
    }

    var fatHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'fatHarvester');
    if(fatHarvesters.length > 0){
        console.log('fatHarvesters: ' + fatHarvesters.length);
    }
    if(fatHarvesters.length < fatHarvestersMax) {
        var newName = 'fatHarvester' + Game.time;
        console.log('Spawning new fatHarvester: ' + newName);
        if (fatHarvesters.length >= 1 || Game.spawns.Spawn1.room.energyAvailable >= 700){
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE], newName, 
                {memory: {role: 'fatHarvester'}});
        }
        else{
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
                {memory: {role: 'fatHarvester'}});
        }
    }

    var haulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler');
    if(haulers.length > 0){
        console.log('Haulers: ' + haulers.length);
    }
    if(haulers.length >= fatHarvesters.length && fatHarvesters.length < fatHarvestersMax){
        haulersMax = 0;
    }
    if(haulers.length < haulersMax) {
        var newName = 'Hauler' + Game.time;
        console.log('Spawning new hauler: ' + newName);
        if (haulers.length >= 1 || Game.spawns.Spawn1.room.energyAvailable >= 300){
            Game.spawns['Spawn1'].spawnCreep([CARRY,CARRY,MOVE], newName, 
                {memory: {role: 'hauler'}});
        }
        
        else{
            Game.spawns['Spawn1'].spawnCreep([CARRY,MOVE], newName, 
                {memory: {role: 'hauler'}});
        }
        
    }

    if(harvesters.length >= harvestersMax && haulers.length >= haulersMax && fatHarvesters.length >= fatHarvestersMax){
        var soldiers = _.filter(Game.creeps, (creep) => creep.memory.role == 'soldier');
        if(soldiers.length > 0){
            console.log('Soldiers: ' + soldiers.length);
        }
        if(soldiers.length < soldierMaxIdeal) {
            var newName = 'Soldier' + Game.time;
            console.log('Spawning new soldier: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([TOUGH,MOVE,TOUGH,MOVE,TOUGH,MOVE,TOUGH,MOVE,TOUGH,MOVE,TOUGH,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,MOVE,ATTACK], newName, 
                {memory: {role: 'soldier'}});        
        }
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        if(builders.length > 0){
            console.log('Builders: ' + builders.length);
        }
        if(builders.length < builderMaxIdeal) {
            var newName = 'Builder' + Game.time;
            console.log('Spawning new builder: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
                {memory: {role: 'builder'}});        
        }

        var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
        if(repairers.length > 0){
            console.log('Repairers: ' + repairers.length);
        }
        if(repairers.length < repairerMaxIdeal) {
            var newName = 'Repairer' + Game.time;
            console.log('Spawning new repairer: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
                {memory: {role: 'repairer'}});
        }
        
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        if(upgraders.length > 0){
            console.log('Upgraders: ' + upgraders.length);
        }
        
        if(upgraders.length < upgraderMaxIdeal) {
            var newName = 'Upgrader' + Game.time;
            console.log('Spawning new upgrader: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
                {memory: {role: 'upgrader'}});        
        }
    }
    //spawn messages
    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }
    
    //tower array
    var towers = Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_TOWER)
        }
    });
    for(name in towers) {
        roleTower.run(towers[name], false);
    }
    
    
    //creep actions
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'fatHarvester') {
            roleFatHarvester.run(creep);
        }
        if(creep.memory.role == 'hauler') {
            roleHauler.run(creep);
        }
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        if(creep.memory.role == 'soldier') {
            roleSoldier.run(creep);
        }
    }
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'fatHarvester') {
            roleFatHarvester.run(creep);
        }
        if(creep.memory.role == 'hauler') {
            roleHauler.run(creep);
        }
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        if(creep.memory.role == 'soldier') {
            roleSoldier.run(creep);
        }
        
    }
}