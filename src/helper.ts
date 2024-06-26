import * as core from '@actions/core';

import { CategorizedEnvironment, Environment, VercelEnvironmentResponse } from './types';

export function validateTargetType(target: string[]): string[] {
  const validTargets = ['production', 'preview', 'development'];

  for (const t of target) {
    if (!validTargets.includes(t)) {
      throw new Error(`Invalid target: ${t}`);
    }
  }

  return [...new Set(target)];
}

export function parseAndFilterSecrets(githubSecrets: string, prefix: string): Record<string, string> {
  const parsedSecrets = JSON.parse(githubSecrets);
  const parsedSecretsObj: Record<string, string> = {};

  Object.entries(parsedSecrets).forEach(([key, value]: [string, unknown]) => {
    if (key.startsWith(prefix)) {
      const strippedKey = key.replace(prefix, '');
      core.debug(`strippedKey: ${strippedKey}, originalKey: ${key}`);
      parsedSecretsObj[strippedKey] = value as string;
    }
  });

  return parsedSecretsObj;
}

export function categorizeEnvironments(vercelEnvironments: VercelEnvironmentResponse[], githubSecrets: Record<string, string>): CategorizedEnvironment {
  const added: Environment[] = [];
  const modified: Environment[] = [];
  const removed: Environment[] = [];

  const vercelEnvMap = new Map<string, VercelEnvironmentResponse>();

  vercelEnvironments.forEach((vercelEnv) => {
    vercelEnvMap.set(vercelEnv.key, vercelEnv);
  });

  for (const [key, value] of Object.entries(githubSecrets)) {
    if (!vercelEnvMap.has(key)) {
      added.push({ id: '', key, value });
    } else {
      const vercelEnv = vercelEnvMap.get(key);
      if (vercelEnv && vercelEnv.value !== value) {
        modified.push({ id: vercelEnv.id, key, value });
      }
    }
  }

  vercelEnvironments.forEach((vercelEnv) => {
    if (!githubSecrets.hasOwnProperty(vercelEnv.key)) {
      removed.push({ id: vercelEnv.id, key: vercelEnv.key, value: vercelEnv.value });
    }
  });

  return { added, modified, removed };
}
