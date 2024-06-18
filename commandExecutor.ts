import express, { Request, Response } from 'express';
import { exec } from 'child_process';

const app = express();
const PORT = 3000;

app.use(express.json());

interface CommandRequest {
  command: string;
  args: string[];
}

app.post('/execute-command', (req: Request, res: Response) => {
  const { command, args }: CommandRequest = req.body;

  // Basic validation for single command
  if (typeof command !== 'string' || !Array.isArray(args)) {
    return res.status(400).send('Invalid input');
  }

  const commandStr = `${command} ${args.join(' ')}`;

  exec(commandStr, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send({ error: stderr });
    }
    res.send({ output: stdout });
  });
});

app.post('/execute-commands', (req: Request, res: Response) => {
  const commands: CommandRequest[] = req.body;

  // Basic validation for multiple commands
  if (!Array.isArray(commands) || !commands.every(cmd => typeof cmd.command === 'string' && Array.isArray(cmd.args))) {
    return res.status(400).send('Invalid input');
  }

  let results: { command: string; output: string; error?: string }[] = [];

  const executeCommand = (cmd: CommandRequest, callback: () => void) => {
    const commandStr = `${cmd.command} ${cmd.args.join(' ')}`;
    exec(commandStr, (error, stdout, stderr) => {
      results.push({
        command: commandStr,
        output: stdout,
        error: error ? stderr : undefined
      });
      callback();
    });
  };

  const executeCommandsSequentially = (cmds: CommandRequest[], index = 0) => {
    if (index < cmds.length) {
      executeCommand(cmds[index], () => executeCommandsSequentially(cmds, index + 1));
    } else {
      res.send(results);
    }
  };

  executeCommandsSequentially(commands);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});