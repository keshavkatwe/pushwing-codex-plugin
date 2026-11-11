import { validatePackage } from './package.ts';

const result = await validatePackage();
console.log(
  `Validated Pushwing ${result.version}: marketplace, hosted MCP and ${result.skills} skills`,
);
