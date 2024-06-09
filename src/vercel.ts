import { config } from './config';
import { CreateVercelEnvironmentRequest, GetVercelEnvironmentResponse, UpdateVercelEnvironmentRequest, VercelEnvironmentResponse } from './types';

export async function getVercelEnv({ project, teamId, token }: { project: string; teamId: string; token: string }): Promise<GetVercelEnvironmentResponse> {
  const response = await fetch(`${config.apiUrl}/v8/projects/${project}/env?decrypt=true&teamId=${teamId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Vercel env: ${response.statusText}`);
  }

  return response.json() as Promise<GetVercelEnvironmentResponse>;
}

export async function decryptVercelEnv({
  project,
  teamId,
  key,
  token,
}: {
  project: string;
  teamId: string;
  key: string;
  token: string;
}): Promise<VercelEnvironmentResponse> {
  const response = await fetch(`${config.apiUrl}/v9/projects/${project}/env/${key}?teamId=${teamId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to decrypt secret: ${response.statusText}`);
  }

  return response.json() as Promise<VercelEnvironmentResponse>;
}

export async function updateVercelEnv({
  project,
  teamId,
  token,
  key,
  value,
  id,
  target,
}: {
  project: string;
  teamId: string;
  token: string;
  key: string;
  value: string;
  id: string;
  target: string[];
}) {
  const body: UpdateVercelEnvironmentRequest = {
    key,
    value,
    type: 'encrypted',
    target,
  };

  const response = await fetch(`${config.apiUrl}/v9/projects/${project}/env/${id}?teamId=${teamId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Failed to update Vercel env: ${response.statusText}`);
  }

  return response.json();
}

export async function createVercelEnv({
  project,
  teamId,
  token,
  key,
  value,
  target,
}: {
  project: string;
  teamId: string;
  token: string;
  key: string;
  value: string;
  target: string[];
}) {
  const body: CreateVercelEnvironmentRequest = {
    key,
    value,
    target,
    type: 'encrypted',
  };

  const response = await fetch(`${config.apiUrl}/v10/projects/${project}/env?teamId=${teamId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Failed to create Vercel env: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteVercelEnv({ project, teamId, token, id }: { project: string; teamId: string; token: string; id: string }) {
  const response = await fetch(`${config.apiUrl}/v9/projects/${project}/env/${id}?teamId=${teamId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete Vercel env: ${response.statusText}`);
  }

  return response.json();
}
