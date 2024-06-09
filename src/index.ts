import * as core from '@actions/core';

import { config } from './config';
import { categorizeEnvironments, parseAndFilterSecrets, validateRegex, validateTargetType } from './helper';
import { createVercelEnv, deleteVercelEnv, getVercelEnv, updateVercelEnv } from './vercel';

(async function run() {
  try {
    const regex = validateRegex(config.regex);
    const target = validateTargetType(config.environments);

    const parsedSecrets = parseAndFilterSecrets(config.secrets, regex);
    const vercelEnv = await getVercelEnv({ project: config.project, teamId: config.teamId, token: config.token });

    const categorizedEnvs = categorizeEnvironments(vercelEnv.envs, parsedSecrets);

    for (const env of categorizedEnvs.added) {
      const key = env.key;
      const value = env.value;

      try {
        core.info(`Adding Environment: ${key}`);
        await createVercelEnv({ project: config.project, teamId: config.teamId, token: config.token, key, value, target });
        core.info(`Successfully added environment: ${key}`);
      } catch (error) {
        core.error(`Failed to add environment: ${key}, with error: ${error}`);
      }
    }

    for (const env of categorizedEnvs.modified) {
      const key = env.key;
      const value = env.value;
      const id = env.id;

      try {
        core.info(`Updating Environment: ${key}`);
        await updateVercelEnv({ project: config.project, teamId: config.teamId, token: config.token, key, value, id, target });
        core.info(`Successfully updated environment: ${key}`);
      } catch (error) {
        core.error(`Failed to update environment: ${key}, with error: ${error}`);
      }
    }

    for (const env of categorizedEnvs.removed) {
      const key = env.key;
      const id = env.id;

      try {
        core.info(`Removing Environment: ${key}`);
        await deleteVercelEnv({ project: config.project, teamId: config.teamId, token: config.token, id });
        core.info(`Successfully removed environment: ${key}`);
      } catch (error) {
        core.error(`Failed to remove environment: ${key}, with error: ${error}`);
      }
    }

    core.info('Successfully synced environments');
  } catch (error: any) {
    core.setFailed(error);
  }
})();
