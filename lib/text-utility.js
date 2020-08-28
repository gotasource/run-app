const chalk = require("chalk");
const boxen = require("boxen");

function writeMarkText(text){
    const greeting = chalk.white.bold(text || '');

    const boxenOptions = {
        padding: 1,
        margin: 0,
        borderStyle: "round",
        borderColor: "green",
    };
    const msgBox = boxen( greeting, boxenOptions );

    console.log(msgBox);
}

module.exports = {
    writeMarkText
}