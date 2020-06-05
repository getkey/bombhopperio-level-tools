import fs from 'fs';
import { validate } from './validator';

if (process.argv.length < 3) {
	console.error('Not enough arguments');
	process.exit(1);
}

switch(process.argv[2]) {
	case 'validate': {
		if (process.argv.length < 4) {
			console.error('Not enough arguments');
			process.exit(3);
		}
		process.argv.slice(3).forEach((path) => {
			const file = JSON.parse(fs.readFileSync(path, 'utf-8'));
			try {
				const levelVersion = validate(file);
				console.log(`${path} is a valid level of version ${levelVersion}`);
			} catch (err) {
				console.log(`${path} is not a valid level:`, err);
			}
		});
		break;
	}
	default: {
		console.error('Unknown argument');
		process.exit(2);
	}
}
