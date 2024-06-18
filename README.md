# simple_sysops

## Start
### Initialize Project

Run `npm init -y` to create a `package.json` file.
Install TypeScript, Express, and necessary types: `npm install typescript express @types/node @types/express`.
Initialize TypeScript config: `npx tsc --init.`
Install child_process type definitions: `npm install @types/node.`

### Setup TypeScript Configuration
Edit `tsconfig.json` to suit the project needs, ensuring `outDir` and `rootDir` are set.

### Create the API Server
Import Express and initialize an application.
Define a POST endpoint `/execute-command` that takes a JSON body with `command` and `args` fields.
Validate the input to ensure it's safe to execute (very important for security).

### Execute the Command
Use the `child_process.exec` function to execute the command constructed from the input.
Handle the callback to capture the output or errors.

### Return the Output
Send the command output or errors back in the response.


## Calling 
curl -X POST http://localhost:3000/execute-command -H "Content-Type: application/json" -d '{"command":"echo", "args":["Hello, World!"]}'

curl -X POST http://localhost:3000/execute-commands -H "Content-Type: application/json" -d '[{"command":"hostname", "args":[""]},{"command":"ifconfig", "args":["eth0","|","grep","inet "]}]'