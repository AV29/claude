# Installation

## 1. Clone this repo

```bash
https://github.com/AV29/claude.git
cd claude
```

## 2. Add the marketplace to Claude Code

In Claude Code, from the repo root:

```
/plugin marketplace add .
```

This registers the marketplace as **Vlasik dev hub**.

## 3. Install the plugins

```
/plugin install documentation@vlasik-dev-hub
/plugin install web-dev@vlasik-dev-hub
/plugin install ambient@vlasik-dev-hub
```

## 4. Verify

```
/plugin
```

You should see all three plugins listed as installed:

```
Installed plugins:
  documentation  1.0.0  (vlasik-dev-hub)
  web-dev        1.0.0  (vlasik-dev-hub)
  ambient        1.0.0  (vlasik-dev-hub)
```
