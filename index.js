#!/usr/bin/env node
const psList = require('ps-list');
const chalk = require('chalk');
const { exec } = require('child_process');
const commander = require('commander');
const { version, description } = require('./package.json');
const program = new commander.Command();
// Process type categories with colors
const PROCESS_TYPES = {
    Browser: {
        color: chalk.cyan,
        matches: ['chrome', 'firefox', 'safari', 'msedge', 'edge', 'opera']
    },
    'Editor/IDE': {
        color: chalk.magenta,
        matches: ['code', 'visual studio code', 'sublime text', 'atom', 'notepad++', 'webstorm', 'pycharm', 'intellij idea', 'notepad', 'textedit']
    },
    Office: {
        color: chalk.yellow,
        matches: ['excel', 'word', 'powerpoint', 'outlook', 'onenote', 'teams', 'slack', 'zoom', 'skype']
    },
    System: {
        color: chalk.gray,
        matches: ['cmd.exe', 'node.exe', 'bash', 'zsh', 'system', 'idle', 'svchost.exe', 'explorer.exe', 'finder', 'dock', 'kernel_task']
    },
    Other: {
        color: chalk.white,
        matches: [] // Default for anything not matched
    }
};
// Simple descriptions for common processes
const PROCESS_DESCRIPTIONS = {
    'chrome': 'Google Chrome web browser.',
    'firefox': 'Mozilla Firefox web browser.',
    'safari': 'Apple Safari web browser.',
    'msedge': 'Microsoft Edge web browser.',
    'edge': 'Microsoft Edge web browser.',
    'opera': 'Opera web browser.',
    'code': 'Visual Studio Code editor.',
    'visual studio code': 'Visual Studio Code editor.',
    'sublime text': 'Sublime Text editor.',
    'atom': 'Atom text editor.',
    'notepad++': 'Notepad++ text editor.',
    'webstorm': 'WebStorm IDE for web development.',
    'pycharm': 'PyCharm IDE for Python development.',
    'intellij idea': 'IntelliJ IDEA for Java/general development.',
    'excel': 'Microsoft Excel spreadsheet software.',
    'word': 'Microsoft Word document editor.',
    'powerpoint': 'Microsoft PowerPoint presentation software.',
    'outlook': 'Microsoft Outlook email client.',
    'onenote': 'Microsoft OneNote note-taking app.',
    'teams': 'Microsoft Teams collaboration platform.',
    'slack': 'Slack messaging and collaboration tool.',
    'zoom': 'Zoom video conferencing app.',
    'skype': 'Skype communication app.',
    'notepad': 'Basic Windows text editor.',
    'textedit': 'Basic macOS text editor.',
    'cmd.exe': 'Windows Command Prompt.',
    'node.exe': 'Node.js runtime environment.',
    'bash': 'Unix shell for command-line tasks.',
    'zsh': 'Z Shell, an enhanced Unix shell.',
    'system': 'Core macOS system process.',
    'idle': 'System idle process (low CPU usage).',
    'svchost.exe': 'Windows service host process.',
    'explorer.exe': 'Windows File Explorer.',
    'finder': 'macOS file management app.',
    'dock': 'macOS Dock for app launching.',
    'kernel_task': 'macOS kernel management process.'
};
function getProcessType(name) {
    const lowerName = name.toLowerCase();
    for (const [type, { matches }] of Object.entries(PROCESS_TYPES)) {
        if (matches.some(match => lowerName.includes(match))) {
            return type;
        }
    }
    return 'Other';
}
function getProcessDescription(name) {
    const lowerName = name.toLowerCase();
    for (const [key, desc] of Object.entries(PROCESS_DESCRIPTIONS)) {
        if (lowerName.includes(key)) return desc;
    }
    return 'A running process (purpose unknown).';
}
async function getAllProcesses() {
    const tasks = await psList();
    return tasks.filter(task => task.name !== process.argv[1]); // Exclude logggggoff itself
}
function closeApp(pid) {
    return new Promise((resolve, reject) => {
        const command = process.platform === 'win32'
            ? `taskkill /PID ${pid}`
            : `kill -TERM ${pid}`;
        exec(command, (error) => {
            if (error) reject(error);
            else resolve();
        });
    });
}
async function listProcesses() {
    console.log(chalk.bgMagenta.white.bold('Logggggoff Process List'));
    const processes = await getAllProcesses();
    if (processes.length === 0) {
        console.log(chalk.yellow('No processes detected.'));
        return;
    }
    console.log(chalk.green('\nRunning Processes:'));
    processes.forEach((proc, i) => {
        const type = getProcessType(proc.name);
        const colorFn = PROCESS_TYPES[type].color;
        console.log(colorFn(`${i + 1}. ${proc.name} (PID: ${proc.pid}) - ${getProcessDescription(proc.name)} [${type}]`));
    });
}
async function killSpecificProcess(pid) {
    console.log(chalk.bgMagenta.white.bold(` :rocket: Killing Process ${pid}... `));
    try {
        await closeApp(pid);
        console.log(chalk.green(`✓ Process ${pid} closed`));
    } catch (err) {
        console.error(chalk.red(`Failed to close process ${pid}: ${err.message}`));
        process.exit(1);
    }
}
// Set up commander
program
    .version(version)
    .description(description || 'A colorful, cross-platform CLI tool to list processes or terminate a specific process by PID');
program
    .command('list')
    .description('Display all running processes with descriptions and types')
    .action(() => {
        listProcesses().catch(err => {
            console.error(chalk.red('Error:', err.message));
            process.exit(1);
        });
    });
program
    .command('<pid> run')
    .description('Kill a specific process by PID (e.g., logggggoff 525 run)')
    .action((pid) => {
        killSpecificProcess(pid).catch(err => {
            console.error(chalk.red('Error:', err.message));
            process.exit(1);
        });
    });
// Parse arguments; default to 'list' if no command is provided
program.parse(process.argv);
if (!process.argv.slice(2).length) {
    program.parse(['', '', 'list']);
}
