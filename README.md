# Sync Repository Secrets to Vercel Environment

This GitHub Action syncs Repository Secrets to Vercel Environment variables. It allows you to seamlessly transfer your secrets from your Repository to Vercel, ensuring your projects have the necessary environment variables set up.

## Description

This action automates the synchronization of Repository Secrets to Vercel environment variables based on a regex pattern. It supports multiple Vercel environments and projects, making it easy to manage your secrets across different stages of development.

## Inputs

| Name             | Description                                                                                                                                                                                       | Required | Default      |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------ |
| `prefix`         | Prefix for the secrets to sync. For example `PROD_ENV_`. This prefix will be removed from the Environment Key. Therefore, if you have `PROD_ENV_HELLO`, it will be deployed to Vercel as `HELLO`. | false    | `ENV_`       |
| `environments`   | The name of the Vercel Environment. If multiple, separate with a comma. For example `development,preview`                                                                                         | false    | `production` |
| `project`        | The ID of the Vercel Project.                                                                                                                                                                   | true     |              |
| `team_id`        | The ID of the Vercel Team.                                                                                                                                                                        | true     |              |
| `token`          | The Vercel Token.                                                                                                                                                                                 | true     |              |
| `secrets`        | The Repository secrets encoded in JSON format. You can use this `${{ toJSON(secrets) }}` to include all your Repository secrets.                                                                  | true     |              |
| `cancel_on_fail` | Cancel the workflow if one of the secrets fails to sync.                                                                                                                                          | false    | `true`       |

## Example Usage

```yaml
name: Sync Secrets to Vercel
on: [push]

jobs:
  sync-secrets:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Sync Repository Secrets to Vercel
        uses: itstor/sync-secrets-to-vercel@v1
        with:
          prefix: 'PROD_ENV_'
          environments: 'production'
          project: ${{ secrets.VERCEL_PROJECT }}
          team_id: ${{ secrets.VERCEL_TEAM_ID }}
          token: ${{ secrets.VERCEL_TOKEN }}
          secrets: '${{ toJSON(secrets) }}'
```
