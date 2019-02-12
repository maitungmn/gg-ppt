const readline = require('readline-sync');

function pause() {
    readline.question('BLOCKED, Press any keys to resume!');
}

module.exports = pause;
