# 个人自用，需要自取，以下介绍为AI攥写
# For personal use only, please pick up as needed. The following description is AI-generated.

# DSH Daily Mode

English | [中文](README.zh.md)

Daily Mode is a public DeepSeek Harness bundle for a general-purpose daily workflow. It keeps the same transaction semantics across Desktop, Web and Headless profiles while adding native tools, context presentation, child-agent controls, archive filtering and session cleanup.

The package declares compatibility with DSH `>=0.1.7`. DSH's native plugin loader performs the compatibility check for the installed Host.

## Install from Git

Install the public repository with DSH's native profile manager:

```powershell
dsh plugin --profile desktop add github:Error0Function/dsh-daily-preset
dsh plugin --profile web add github:Error0Function/dsh-daily-preset
dsh plugin --profile headless add github:Error0Function/dsh-daily-preset
```

Install it in each profile that should provide Daily Mode. The repository includes its built `lib` output and bundle patches, so a Git installation does not depend on a separate workspace or a linked development checkout. Pin the repository to a reviewed commit with `github:Error0Function/dsh-daily-preset#<commit>` when reproducible deployments are required. Restart the DSH Host after installation or replacement so the running process loads the new package.

## What it provides

- A daily preset with native tools, permissions, goals, skills and model routing.
- Context presentation rules for the main Agent and its child Agents.
- Agent waiting, archiving and client-side archive filtering.
- Confirmed cleanup of archived sessions during Host startup.
- Desktop and Web settings for the mode and child-model configuration.
- Headless policy, context and Agent-control components with the same session semantics.

The child Agent uses the parent model and effort by default. A different model can be selected through DSH's native settings. Settings are stored by DSH; this package does not require a separate configuration synchronizer or a login plugin.

## Permissions and scope

The daily preset requests DSH's `danger-full-access` permission preset because its workflow is intended for general local development and file operations. Review that policy before enabling the bundle in a profile.

The client components target Desktop and Web. Headless loads the model-facing policy, context and Agent-control components; it does not need a client connection service. Model credentials, MCP services, global instructions and compression policy remain the user's DSH configuration.

## Build from source

To rebuild the committed artifacts, use a compatible DSH source checkout:

```powershell
$env:DSH_REPO = 'path to a compatible DSH source checkout'
node build.mjs
npm pack . --ignore-scripts --pack-destination <output-directory>
```

The build records the DSH compatibility floor in `package.json`. Keep the generated `lib` output and bundle files in the same release commit; DSH Git installation consumes those committed artifacts.

## License and notices

This project is released under the [MIT License](LICENSE). The [third-party notices](THIRD_PARTY_NOTICES.md) identify bundled upstream code and its licenses.
