"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const child_process_1 = require("child_process");
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
app.post('/execute-command', (req, res) => {
    const { command, args } = req.body;
    // Basic validation for single command
    if (typeof command !== 'string' || !Array.isArray(args)) {
        return res.status(400).send('Invalid input');
    }
    const commandStr = `${command} ${args.join(' ')}`;
    (0, child_process_1.exec)(commandStr, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send({ error: stderr });
        }
        res.send({ output: stdout });
    });
});
app.post('/execute-commands', (req, res) => {
    const commands = req.body;
    // Basic validation for multiple commands
    if (!Array.isArray(commands) || !commands.every(cmd => typeof cmd.command === 'string' && Array.isArray(cmd.args))) {
        return res.status(400).send('Invalid input');
    }
    let results = [];
    const executeCommand = (cmd, callback) => {
        const commandStr = `${cmd.command} ${cmd.args.join(' ')}`;
        (0, child_process_1.exec)(commandStr, (error, stdout, stderr) => {
            results.push({
                command: commandStr,
                output: stdout,
                error: error ? stderr : undefined
            });
            callback();
        });
    };
    const executeCommandsSequentially = (cmds, index = 0) => {
        if (index < cmds.length) {
            executeCommand(cmds[index], () => executeCommandsSequentially(cmds, index + 1));
        }
        else {
            res.send(results);
        }
    };
    executeCommandsSequentially(commands);
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
