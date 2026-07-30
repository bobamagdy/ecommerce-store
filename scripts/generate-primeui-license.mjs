import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { loadEnvFile } from 'node:process';

const localEnvironmentFile = resolve('.env.local');

/*
 * في GitHub Actions يكون المفتاح موجودًا داخل process.env.
 * محليًا نقرأه تلقائيًا من .env.local.
 */
if (!process.env.PRIMEUI_LICENSE_KEY && existsSync(localEnvironmentFile)) {
  loadEnvFile(localEnvironmentFile);
}

const licenseKey = process.env.PRIMEUI_LICENSE_KEY?.trim();

if (!licenseKey) {
  throw new Error(
    'PRIMEUI_LICENSE_KEY is missing. Add it to .env.local or GitHub Actions Secrets.',
  );
}

const targetFile = resolve('src/app/core/config/primeui-license.generated.ts');

await mkdir(dirname(targetFile), {
  recursive: true,
});

await writeFile(
  targetFile,
  `export const PRIMEUI_LICENSE_KEY = ${JSON.stringify(licenseKey)};\n`,
  'utf8',
);

console.log('PrimeUI license configuration generated.');
