## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## MCP configuration examples

These are complete `.mcp.json` examples. Use the server type supported by the endpoint or command.

### Local command (stdio)

```json
{
  "mcpServers": {
    "localExample": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "some-mcp-package"],
      "env": {
        "API_TOKEN": "${API_TOKEN}"
      },
      "cwd": "C:/path/to/project",
      "tools": ["search", "read"]
    }
  }
}
```

### Remote Streamable HTTP

```json
{
  "mcpServers": {
    "httpExample": {
      "type": "http",
      "url": "https://example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${MCP_API_TOKEN}"
      },
      "oauthClientId": "registered-client-id",
      "tools": ["*"]
    }
  }
}
```

### Legacy Server-Sent Events (SSE)

```json
{
  "mcpServers": {
    "sseExample": {
      "type": "sse",
      "url": "https://example.com/sse",
      "headers": {
        "Authorization": "Bearer ${MCP_API_TOKEN}"
      },
      "oauthClientId": "registered-client-id",
      "tools": ["tool-name"]
    }
  }
}
```

## Playwright MCP examples

See the [Playwright MCP guide](https://playwright.dev/docs/getting-started-mcp) for prerequisites and details.

### Browser launch options

Playwright MCP runs headed by default. Add `--headless` to run without a visible browser.
Supported browser values are `chrome`, `firefox`, `webkit`, and `msedge`. This example runs
headless Firefox and closes an idle browser after five minutes:

```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@playwright/mcp@latest",
        "--headless",
        "--browser=firefox",
        "--idle-timeout=300000"
      ]
    }
  }
}
```

### Browser profiles

- The default persistent profile preserves login state. Set `--user-data-dir` to choose its directory.
- Use `--isolated` for a fresh browser session; optionally provide `--storage-state` to load initial state.
- Use `--extension` to connect through the Playwright browser extension.

For example, add `"--isolated"` to the `args` array above to start each session with a fresh profile.

### Advanced server configuration

Use `--config` to load browser options, context options, network rules, timeouts, and other settings
from a Playwright MCP config file:

```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest", "--config", "path/to/config.json"]
    }
  }
}
```

### Standalone HTTP server

Start the server separately when a headed browser needs a display or an IDE worker process needs to
connect over HTTP:

```sh
npx -y @playwright/mcp@latest --port 8931
```

Then configure the client to use its HTTP endpoint:

```json
{
  "mcpServers": {
    "playwright": {
      "type": "http",
      "url": "http://localhost:8931/mcp"
    }
  }
}
```