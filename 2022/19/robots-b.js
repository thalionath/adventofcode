
const fs = require('fs/promises');

class Blueprint {
    constructor(args) {
        this.id = args[0];

        this.ore = {
            costs: { ore: args[1], clay: 0, obsidian: 0, geode: 0 },
            production: { ore: 1, clay: 0, obsidian: 0, geode: 0 }
        };
        this.clay = {
            costs: { ore: args[2], clay: 0, obsidian: 0, geode: 0 },
            production: { ore: 0, clay: 1, obsidian: 0, geode: 0 }
        };
        this.obsidian = {
            costs: { ore: args[3], clay: args[4], obsidian: 0, geode: 0 },
            production: { ore: 0, clay: 0, obsidian: 1, geode: 0 }
        };
        this.geode = {
            costs: { ore: args[5], clay: 0, obsidian: args[6], geode: 0 },
            production: { ore: 0, clay: 0, obsidian: 0, geode: 1 }
        };

        this.count = 0;
        this.max_geodes = 0;
        this.trace = [];
        this.max_ore = Math.max(
            this.ore.costs.ore,
            this.clay.costs.ore,
            this.obsidian.costs.ore,
            this.geode.costs.ore
        );
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

    B.trace.push(s);

    const inventory = Array(s.left + 1).fill(0).map((_, t) => ({
        ore     : s.inventory.ore      + s.robots.ore      * t,
        clay    : s.inventory.clay     + s.robots.clay     * t,
        obsidian: s.inventory.obsidian + s.robots.obsidian * t,
        geode   : s.inventory.geode    + s.robots.geode    * t,
    }));

    const max_geodes = Math.max(...inventory.map(m => m.geode));

    if( max_geodes > B.max_geodes ) {
        B.max_geodes = max_geodes;
        // console.log(B.max_geodes, 24-s.left, B.trace, inventory);
        // console.log(B.max_geodes);
    }

    // bail out if the the max number of remaining geodes we could crack
    // in the tree is less than the global best
    // we assume that we would create one additional geode miner per minute 
    const max_geodes_tree = s.inventory.geode + s.robots.geode * s.left + gaussian_sum(s.left - 1);

    if( max_geodes_tree > B.max_geodes )
    {
        const build = function(r) {
            const t = inventory.findIndex(t => can_build(t, r.costs))
            const tb = (t + 1);

            if( (t >= 0) && (tb < s.left) ) {
                dfs({
                    left: s.left - tb,
                    robots: {
                        ore     : s.robots.ore      + r.production.ore     ,
                        clay    : s.robots.clay     + r.production.clay    ,
                        obsidian: s.robots.obsidian + r.production.obsidian,
                        geode   : s.robots.geode    + r.production.geode   ,
                    },
                    inventory: {
                        ore     : inventory[tb].ore      - r.costs.ore     ,
                        clay    : inventory[tb].clay     - r.costs.clay    ,
                        obsidian: inventory[tb].obsidian - r.costs.obsidian,
                        geode   : inventory[tb].geode    - r.costs.geode   ,
                    }
                }, B);
            }
        }

        build(B.geode);

        if( s.robots.obsidian < B.geode.costs.obsidian ) {
            build(B.obsidian);
        }

        if( s.robots.clay < B.obsidian.costs.clay ) {
            build(B.clay);
        }

        if( s.robots.ore < B.max_ore ) {
            build(B.ore);
        }
    }

    B.trace.pop();

    return B;
}

async function solver(filename) {
    const input = await fs.readFile(filename, { encoding: 'utf8' });

    const rx = /Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./

    const s = {
        left: 32,
        robots: {
            ore: 1,
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