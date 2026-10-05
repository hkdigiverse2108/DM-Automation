import { spawn } from "node:child_process";
import path from "node:path";
import { resolvePort } from "./resolve-port.mjs";

const binPath = path.resolve(process.cwd(), "node_modules", ".bin");
process.env.PATH = `${binPath}${path.delimiter}${process.env.PATH || ""}`;

const port = resolvePort();
process.env.PORT = port;

const extraArgs = process.argv.slice(2);
const startCmd = `next start -p ${port}${extraArgs.length > 0 ? ` ${extraArgs.join(" ")}` : ""}`;

const child = spawn(startCmd, {
	stdio: "inherit",
	shell: true,
	env: process.env,
});

child.on("exit", (code) => {
	process.exit(code ?? 0);
});
