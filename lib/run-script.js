const path = require('path');
const fs = require('fs')
const exec = require('child_process').exec;

const configPath = path.join(__dirname, '../config/config.json');
let config = require(configPath);

const addConfig = (id, script, port) => {
    config.processes = [
        ...(config.processes.filter(p => p.script !== script || p.port !== port)),
        {
            id, port,
            status: 'running',
            script
        }
    ];
    updateConfig();
}

const updateConfig = () => {
    fs.writeFileSync(configPath, JSON.stringify(config, null, '\t'));
}

const startApp = (scriptPath, port) => {
    try {
        let realScriptPath = scriptPath;
        if (scriptPath.startsWith('~/')) {
            realScriptPath = path.join(scriptPath);
        } else if (scriptPath.startsWith('./') || scriptPath.startsWith('../')) {
            realScriptPath = path.join(process.cwd(), scriptPath);
        } else if (scriptPath.startsWith('/')) {
            realScriptPath = scriptPath;
        } else {
            realScriptPath = path.join(process.cwd(), './' + scriptPath);
        }
        if (config.processes.some(p => p.script === realScriptPath && p.port === port && p.status === 'running')) {
            throw new Error(`Script '${scriptPath}' is running`);
        } else {
            if (fs.existsSync(realScriptPath)) {
                const childProcess = exec(`node ${realScriptPath} ${port}`);
                addConfig(+childProcess.pid, realScriptPath, +port);
                return childProcess;
            } else {
                throw new Error(`Script '${scriptPath}' is not found`);
            }
        }
    } catch (err) {
        throw err;
    }
}


const listApps = () => {
    return config.processes;
}

const stopApp = async (id) => {
    let runningProcesses = config.processes.filter(p => p.status === 'running');
    if (runningProcesses.length === 0) {
        throw new Error('There is no running app to stop.')
    }else{
        let info = runningProcesses.find(p => p.id === id);
        if (!info) {
            const {Select} = require('./cli-select-opts/index');
            const jsFrameworkSel = new Select({
                question: "Which of processes is your selected?",
                // options: ["Angular", "React", "Vue", "Svelte", "Svelte1"],
                // answers: [{fff:11}, "react", "vue", "svelte", "svelte1"],
                options: runningProcesses.map(p => `id: ${p.id}, port: ${p.port}, status: ${p.status} script: ${p.script}`),
                answers: runningProcesses,
                pointer: ">",
                color: "magenta"
            })
            info = await jsFrameworkSel.start();
        }
        try {
            process.kill(info.id);
            info.status = 'stopped';
            updateConfig();
            return info;
        } catch (err) {
            throw err;
        }

    }


}

module.exports = {
    startApp,
    listApps,
    stopApp
}