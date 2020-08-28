#!/usr/bin/env node
const yargs = require('yargs');
const {writeMarkText} = require('./lib/text-utility');
const {startApp, listApps, stopApp} = require('./lib/run-script')


const command = yargs
    .command({
        command: 'start [arg]',
         aliases: ['st'],
        desc: 'start app => ex: gota start --source /dev/index.js --port 3000',
        builder: (yargs) => {
            yargs.usage("Usage: -s <source> -p <port>")
                .option("s", {
                    alias: "source",
                    describe: "main script of app=> ex: /dev/index.js",
                    type: "string",
                    demandOption: true
                })
                .option("p", {
                    alias: "port",
                    describe: "listener port => ex: 3000",
                    type: "number",
                    demandOption: true
                }).version(false);
        },
        handler: (argv) => {
            try {
                let childProcess = startApp(argv.source, argv.port);
                writeMarkText( `App is started =>  id: ${childProcess.pid}, port: ${argv.port}, script: '${argv.source}'`);
            }catch (err) {
                writeMarkText( err.message);
            }
            process.exit();
        }
    })
    .command({
        command: 'stop [arg]',
        aliases: ['sp'],
        desc: 'stop app => ex: gota stop --id 1234',
        builder: (yargs) => {
            yargs.usage("Usage: --id <id>")
                .option("i", {
                    alias: "id",
                    describe: "id of app=> ex: 1234",
                    type: "number"
                }).version(false);
        },
        handler: async (argv) => {
            try {
                let app = await stopApp(argv.id);
                writeMarkText(`App (id: ${app.id}) is stopped.`);
            } catch (err) {
                writeMarkText(err.message);
            }

        }
    })
    .command({
        command: 'list',
        aliases: ['ls'],
        desc: 'list information of apps',
        handler: (argv) => {
            const list = listApps();
            if(Array.isArray(list) && list.length >0){
                console.table(list)
            }else {
                writeMarkText( `There isn't running or stopped process.`);
            }

        }
    })
    .demandCommand(1, 'You need at least one command before moving on').argv;