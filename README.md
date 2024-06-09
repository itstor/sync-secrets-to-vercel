# Sync GitHub Secrets to Vercel Environment

This GitHub Action syncs GitHub Secrets to Vercel Environment variables. It allows you to seamlessly transfer your secrets from GitHub to Vercel, ensuring your projects have the necessary environment variables set up.

## Description

This action automates the synchronization of GitHub Secrets to Vercel environment variables based on a regex pattern. It supports multiple Vercel environments and projects, making it easy to manage your secrets across different stages of development.

## Inputs

| Name           | Description                                                                                                              | Required | Default      |
| -------------- | ------------------------------------------------------------------------------------------------------------------------ | -------- | ------------ |
| `regex`        | Regex to match the GitHub Secrets. For example `^PROD_ENV_.*$`                                                           | false    | `^.*$`       |
| `environments` | The name of the Vercel Environment. If multiple, separate with a comma. For example `development,preview`                | false    | `production` |
| `project`      | The name of the Vercel Project.                                                                                          | true     |              |
| `team_id`      | The ID of the Vercel Team.                                                                                               | true     |              |
| `token`        | The Vercel Token.                                                                                                        | true     |              |
| `secrets`      | The GitHub secrets encoded in JSON format. You can use this `${{ toJSON(secrets) }}` to include all your GitHub secrets. | true     |              |

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

      - name: Sync GitHub Secrets to Vercel
        uses: itstor/sync-secrets-to-vercel@v1
        with:
          regex: '^PROD_ENV_.*$'
          environments: 'development,preview'
          project: 'your-vercel-project'
          team_id: ${{ secrets.VERCEL_TEAM_ID }}
          token: ${{ secrets.VERCEL_TOKEN }}
          secrets: ${{ toJSON(secrets) }}
```
