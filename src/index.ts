import * as core from '@actions/core';

import { config } from './config';
import { categorizeEnvironments, parseAndFilterSecrets, validateTargetType } from './helper';
import { createVercelEnv, deleteVercelEnv, getVercelEnv, updateVercelEnv } from './vercel';

(async function run() {
  try {
    const target = validateTargetType(config.environments);

    const parsedSecrets = parseAndFilterSecrets(config.secrets, config.prefix);
    const vercelEnv = await getVercelEnv({ project: config.project, teamId: config.teamId, token: config.token });

    const categorizedEnvs = categorizeEnvironments(vercelEnv.envs, parsedSecrets);
    const counter = {
      added: {
        success: 0,
        failed: 0,
      },
      modified: {
        success: 0,
        failed: 0,
      },
      removed: {
        success: 0,
        failed: 0,
      },
    };

    for (const env of categorizedEnvs.added) {
      const key = env.key;
      const value = env.value;

      try {
        core.info(`Adding Environment: ${key}`);
        await createVercelEnv({ project: config.project, teamId: config.teamId, token: config.token, key, value, target });
        core.info(`Successfully added environment: ${key}`);
        counter.added.success++;
      } catch (error) {
        counter.added.failed++;
        core.error(`Failed to add environment: ${key}, with error: ${error}`);
        if (config.cancelOnFail) {
          throw new Error(`Failed to add environment: ${key}, with error: ${error}`);
        }
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
        counter.modified.success++;
      } catch (error) {
        counter.modified.failed++;
        core.error(`Failed to update environment: ${key}, with error: ${error}`);
        if (config.cancelOnFail) {
          throw new Error(`Failed to add environment: ${key}, with error: ${error}`);
        }
      }
    }

    for (const env of categorizedEnvs.removed) {
      const key = env.key;
      const id = env.id;

      try {
        core.info(`Removing Environment: ${key}`);
        await deleteVercelEnv({ project: config.project, teamId: config.teamId, token: config.token, id });
        core.info(`Successfully removed environment: ${key}`);
        counter.removed.success++;
      } catch (error) {
        counter.removed.failed++;
        core.error(`Failed to remove environment: ${key}, with error: ${error}`);
        if (config.cancelOnFail) {
          throw new Error(`Failed to add environment: ${key}, with error: ${error}`);
        }
      }
    }

    core.info(`Added: ${counter.added.success}, Failed: ${counter.added.failed}`);
    core.info(`Modified: ${counter.modified.success}, Failed: ${counter.modified.failed}`);
    core.info(`Removed: ${counter.removed.success}, Failed: ${counter.removed.failed}`);
    core.info('Synced environments');
  } catch (error: any) {
    core.setFailed(error);
  }
})();
