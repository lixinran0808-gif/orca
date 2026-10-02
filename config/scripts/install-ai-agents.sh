#!/usr/bin/env bash
set -u
failed=0
run() { "$@" || failed=1; }
command -v npm >/dev/null || { echo "Install Node.js 24 (includes npm) first."; exit 1; }
run npm install -g @openai/codex @anthropic-ai/claude-code @google/gemini-cli
installer_dir=$(mktemp -d)
trap 'rm -rf "$installer_dir"' EXIT
if curl -fsSL https://x.ai/cli/install.sh -o "$installer_dir/grok.sh"; then
  run bash "$installer_dir/grok.sh"
else failed=1; fi
if curl -fsSL https://hermes-agent.nousresearch.com/install.sh -o "$installer_dir/hermes.sh"; then
  run bash "$installer_dir/hermes.sh" --non-interactive --skip-browser --skip-computer-use
else failed=1; fi
export PATH="$HOME/.grok/bin:$HOME/.local/bin:$PATH"
for agent in codex claude gemini grok hermes; do
  if command -v "$agent" >/dev/null; then
    printf '%s: %s\n' "$agent" "$(command -v "$agent")"
  else printf '%s: missing\n' "$agent"; failed=1; fi
done
echo "Restart Orca, then authenticate each agent in its terminal. No accounts are configured by this installer."
exit "$failed"
