export interface Config {
  apiUrl: string;
  secrets: string;
  prefix: string;
  environments: string[];
  project: string;
  teamId: string;
  token: string;
  cancelOnFail: boolean;
}

export interface Environment {
  id: string;
  key: string;
  value: string;
}

export interface CategorizedEnvironment {
  added: Environment[];
  modified: Environment[];
  removed: Environment[];
}

export interface VercelEnvironmentResponse {
  type: string;
  value: string;
  target: string[];
  configurationId: null | string;
  comment: string;
  id: string;
  key: string;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
  updatedBy: null | string;
  decrypted: boolean;
}

export interface GetVercelEnvironmentResponse {
  envs: VercelEnvironmentResponse[];
}

export interface UpdateVercelEnvironmentRequest {
  comment?: string;
  customEnvironmentIds?: string[];
  gitBranch?: string;
  key?: string;
  target?: string[];
  type?: string;
  value?: string;
}

export interface CreateVercelEnvironmentRequest {
  key: string;
  value: string;
  target: string[];
  type: string;
}
