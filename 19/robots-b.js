
const fs = require('fs/promises');

class Blueprint {
    constructor(args) {
        this.id = args[0];
        this.costs = {
            geode    : { type: 'geode'   , ore: args[5], clay: 0      , obsidian: args[6] },
            obsidian : { type: 'obsidian', ore: args[3], clay: args[4], obsidian: 0 },
            clay     : { type: 'clay'    , ore: args[2], clay: 0      , obsidian: 0 },
            ore      : { type: 'ore'     , ore: args[1], clay: 0      , obsidian: 0 },
        }
        this.count = 0;
        this.max_geodes = 0;
        this.earliest_geode = 32;
    }
};

function can_build(inventory, costs) {
    return (inventory.ore      >= costs.ore)
        && (inventory.clay     >= costs.clay)
        && (inventory.obsidian >= costs.obsidian)
        ;
}

function gaussian_sum(n) {
    return (n*n + n) / 2;
}

function dfs(s, B) {

    B.count += 1;

    const max_minutes = 32;

    const minute = s.minute + 1;

    if( s.inventory.geode === 0 && s.production.geode && minute > B.earliest_geode) {
        return;
    }

    const inventory = {
        ore: s.inventory.ore + s.robots.ore,
        clay: s.inventory.clay + s.robots.clay,
        obsidian: s.inventory.obsidian + s.robots.obsidian,
        geode: s.inventory.geode + s.robots.geode,
    };

    const robots = {
        ore: s.production.ore + s.robots.ore,
        clay: s.production.clay + s.robots.clay,
        obsidian: s.production.obsidian + s.robots.obsidian,
        geode: s.production.geode + s.robots.geode,
    };

    if( inventory.geode > B.max_geodes ) {
        B.max_geodes = inventory.geode;
        B.max_geode_minute = minute;
        
        if( minute < B.earliest_geode ) {
            console.log('e', minute);
            B.earliest_geode = minute;
        }

        console.log(minute, B.max_geodes, B.count)
    }

    if( minute === max_minutes ) {
        return;
    }

    const left = max_minutes - minute;

    if( left < 1 ) {
        throw `left ${left}`;
    }

    // the max number of remaining geodes we could crack 
    const max_geodes = inventory.geode + robots.geode * left + gaussian_sum(left - 1);

    if( max_geodes <= B.max_geodes ) {
        return;
    }

    const copy = function() {
        return {
            minute: minute,
            inventory: Object.assign({}, inventory),
            robots: Object.assign({}, robots),
            production: {
                ore: 0,
                clay: 0,
                obsidian: 0,
                geode: 0,
            }
        };
    }

    function build(c) {
        let n = copy();
        n.production[c.type] = 1;
        n.inventory.ore -= c.ore;
        n.inventory.clay -= c.clay;
        n.inventory.obsidian -= c.obsidian;

        dfs(n, B);
    }

    // it makes no sense to build more robots than
    // resources that we need to produce one geode robot
    // per minute
    if( can_build(inventory, B.costs.geode) ) {
        build(B.costs.geode);
    }

    if( can_build(inventory, B.costs.obsidian) ) {
        if( robots.obsidian < B.costs.geode.obsidian )
        {
            build(B.costs.obsidian);
        }
    }

    if( can_build(inventory, B.costs.clay) ) {
        if( robots.clay < B.costs.obsidian.clay )
        {
            build(B.costs.clay);
        }
    }

    const max_ore = Math.max(
          B.costs.ore.ore
        , B.costs.clay.ore
        , B.costs.obsidian.ore
        , B.costs.geode.ore
    );

    if( can_build(inventory, B.costs.ore) ) {
        if( robots.ore < max_ore )
        {
            build(B.costs.ore);
        }
    }

    dfs(copy(), B);

    return B;
}

async function solver(filename) {
    const input = await fs.readFile(filename, { encoding: 'utf8' });

    const rx = /Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./

    const s = {
        minute: 0,
        trace: [],
        robots: {
            ore: 1,
            clay: 0,
            obsidian: 0,
            geode: 0,
        },
        production: {
            ore: 0,
            clay: 0,
            obsidian: 0,
            geode: 0,
        },
        inventory: {
            ore: 0,
            clay: 0,
            obsidian: 0,
            geode: 0,
        }
    }

    const blueprints = input
        .split(/\r?\n/)
        .slice(0, 3)
        .map(line => line.match(rx).slice(1).map(s => parseInt(s)))
        .map(args => new Blueprint(args))
        .map(b => dfs(s, b).max_geodes )
        ;

    console.log(blueprints);

    return blueprints;
}

async function main() {
    try {
        test = await solver('input-test.txt');

        if( test[0] !== 56 || test[1] !== 62 ) {
            throw new Error(`test failed ${test}`);
        }

        const geodes = await solver('input.txt');

        console.log(
            geodes, geodes.reduce((a, s) => a * s)
        );
    } catch (err) {
        console.log(err);
    }
}

main();