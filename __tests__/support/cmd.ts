import { spawn, spawnSync } from "child_process";
import concat from "concat-stream";
import process from "process";

function createProcess(
	processPath: string,
	args: Array<string> = [],
	env: EnvironmentVariables = {},
) {
	const concatedArgs = [processPath].concat(args);
	return spawn(process.execPath, concatedArgs, {
		env: {
			NODE_ENV: "test",
			...env,
		},
	});
}

export type EnvironmentVariables = {
	[key: string]: string;
};

interface ExecuteOptions {
	env?: EnvironmentVariables;
}

export function execute(
	processPath: string,
	args: Array<string> = [],
	opts: ExecuteOptions = {},
) {
	const { env } = opts;
	const childProcess = createProcess(processPath, args, env);

	childProcess.stdout.setEncoding("utf-8");
	childProcess.stdin.setDefaultEncoding("utf-8");

	const promise = new Promise((resolve, reject) => {
		childProcess.stderr.once("data", (err: Error) => {
			reject(err.toString());
		});

		childProcess.on("error", reject);
		childProcess.stdout.pipe(
			concat((result: Buffer) => {
				resolve(result.toString());
			}),
		);
	});
	return promise;
}

export function executeSync(
	processPath: string,
	args: Array<string> = [],
	opts: ExecuteOptions = {},
) {
	const { env = null } = opts;
	const concatedArgs = [processPath].concat(args);
	return spawnSync(process.execPath, concatedArgs, {
		env: {
			NODE_ENV: "test",
			...env,
		},
		encoding: "utf-8",
	});
}
