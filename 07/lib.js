
class Directory {
    constructor(parent, name) {
        this.parent = parent;
        this.name  = name;
        this.dirs  = [];
        this.files = [];
    }

    subdir(name) {
        const d = this.dirs.find(d => d.name === name);
        if( d !== undefined ) {
            return d;
        }

        const nd = new Directory(this, name);
        this.dirs.push(nd);
        return nd;
    }

    adddir(name) {
        this.dirs.push(
            new Directory(this, name)
        );
    }

    addfile(name, size) {
        this.files.push(
            { name: name, size: size }
        );
    }

    get size() {
        return this.files.reduce((a, s) => a + s.size, 0) + this.dirs.reduce((a, s) => a + s.size, 0)
    }

    get leaf() {
        return this.dirs.length === 0;
    }
}


module.exports.Directory = Directory;

module.exports.parse_tree = function(input) {
    const lines = input.split(/\r?\n/);

    let root = new Directory(null, '/');

    let cd = root;

    for( const line of lines ) {
        const cmd = line.match(/\$ cd (.+)/)

        if( cmd ) {
            switch(cmd[1]) {
                case '/': cd = root; break;
                case '..': cd = cd.parent; break;
                default: cd = cd.subdir(cmd[1]); break;
            }

            continue;
        }

        const dir = line.match(/dir (.+)/)

        if( dir ) {
            cd.adddir(dir[1]);
            continue;
        }

        const file = line.match(/([0-9]+) (.+)/)

        if( file ) {
            cd.addfile(file[2], parseInt(file[1]));
            continue;
        }
    }

    return root;
}

function walk_tree(d, f) {
    f(d);
    for(const sd of d.dirs) {
        walk_tree(sd, f);
    }
}

module.exports.walk_tree = walk_tree;

module.exports.print_tree = function(d, indent) {
    console.log(`${indent} - ${d.name} (dir) ${d.size}`)
    for(const sd of d.dirs) {
        print_tree(sd, indent + '  ');
    }
    for(const f of d.files) {
        console.log(`${indent}   - ${f.name} ${f.size}`)
    }
}