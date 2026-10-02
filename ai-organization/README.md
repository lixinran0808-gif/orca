# Orca AI Organization OS

Human-supervised multi-agent development environment for Orca.

## Authority
1. **Human Supervisor** — final authority. Only the human may approve release, destructive changes, credential changes, production deployment, or final adoption.
2. **Claude Code** — field commander / chief architect. It decomposes work, delegates, compares results, and prepares integration proposals. It is not the final authority.
3. **Specialist agents** — execute bounded assignments.

## Operating loop
`OBSERVE -> DECOMPOSE -> DELEGATE -> PARALLEL EXECUTION -> COMPARE -> CRITIQUE -> TEST -> PROPOSE INTEGRATION -> HUMAN DECISION`

Claude must end every mission with concrete artifacts and a decision packet containing:
- objective
- agents used
- changed files / produced artifacts
- test evidence
- unresolved risks
- recommendation options: adopt / reject / rerun
- explicit items requiring Human Supervisor approval

## Safety gates
Human approval is required before:
- merging to main
- production deployment or release
- destructive file/data operations
- credential/secret changes
- spending money or creating paid resources
- publishing externally
- irreversible migrations

## Files
- `agents.json`: canonical roster and responsibilities.
- `mission.schema.json`: mission contract between commander and workers.
- `CLAUDE_COMMANDER.md`: commander operating protocol.
- `.env.ai-org.example`: credential/CLI placeholders only; never commit real secrets.

This bootstrap defines the organization layer. Provider authentication and local CLI installation remain environment-specific.
