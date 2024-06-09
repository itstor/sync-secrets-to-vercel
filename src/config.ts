import * as core from '@actions/core';

import { Config } from './types';

export const config: Config = {
  apiUrl: 'https://api.vercel.com',
  secrets: core.getInput('secrets', { required: true }),
  prefix: core.getInput('prefix', { required: false }) || 'ENV_',
  environments: core.getInput('environments').split(',') || ['production'],
  project: core.getInput('project', { required: true }),
  teamId: core.getInput('team_id', { required: true }),
  token: core.getInput('token', { required: true }),
  cancelOnFail: core.getInput('cancel_on_fail', { required: false }) === 'true',
};
