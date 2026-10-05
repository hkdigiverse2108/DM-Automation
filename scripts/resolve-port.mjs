import fs from "node:fs";
import path from "node:path";

export function resolvePort() {
	// 1. Check if PORT is already in process.env
	if (process.env.PORT?.trim()) {
		return process.env.PORT.trim();
	}

	// 2. Read from .env.local and .env
	for (const envFile of [".env.local", ".env"]) {
		const fullPath = path.resolve(process.cwd(), envFile);
		if (fs.existsSync(fullPath)) {
			try {
				const content = fs.readFileSync(fullPath, "utf8");
				const match = content.match(/^\s*PORT\s*=\s*["']?(\d+)["']?\s*$/m);
				if (match?.[1]) {
					return match[1];
				}
			} catch {
				// Ignore reading error and fall through
			}
		}
	}

	// 3. Fallback default port
	return "3000";
}
