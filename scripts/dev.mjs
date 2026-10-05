import { spawn } from "node:child_process";
import path from "node:path";
import concurrently from "concurrently";
import { resolvePort } from "./resolve-port.mjs";

const binPath = path.resolve(process.cwd(), "node_modules", ".bin");
process.env.PATH = `${binPath}${path.delimiter}${process.env.PATH || ""}`;

const port = resolvePort();
process.env.PORT = port;

const isNextOnly = process.argv.includes("--next-only");
const extraArgs = process.argv.slice(2).filter((arg) => arg !== "--next-only");

const nextCmd = `next dev -p ${port}${extraArgs.length > 0 ? ` ${extraArgs.join(" ")}` : ""}`;

if (isNextOnly) {
	const child = spawn(nextCmd, {
		stdio: "inherit",
		shell: true,
		env: process.env,
	});
	child.on("exit", (code) => {
		process.exit(code ?? 0);
	});
} else {
	const inngestCmd = `npx inngest-cli@latest dev -u http://localhost:${port}/api/inngest`;
	const { result } = concurrently(
		[
			{
				command: nextCmd,
				name: "next",
				prefixColor: "blue",
			},
			{
				command: inngestCmd,
				name: "inngest",
				prefixColor: "magenta",
			},
		],
		{
			prefix: "name",
			restartTries: 0,
		},
	);
	result.catch(() => {});
}
