import type { OrganizationAgentId } from './organization-mission'

export type OrganizationCostPolicy = {
  /** Hard default: never start an agent whose invocation may create incremental external charges. */
  allowPaidExternalUsage: false
  /** Local/subscription-backed CLIs still require installation/auth, but Orca does not buy usage. */
  allowedAgents: readonly OrganizationAgentId[]
  blockedAgents: Readonly<Partial<Record<OrganizationAgentId, string>>>
}

export const ZERO_INCREMENTAL_COST_POLICY: OrganizationCostPolicy = {
  allowPaidExternalUsage: false,
  allowedAgents: [
    'claude',
    'codex',
    'gemini',
    'hermes',
    'devin',
    'cursor',
    'cline',
    'aider',
    'opencode',
    'copilot',
    'continue'
  ],
  blockedAgents: {
    jev: 'paid_external_usage_prohibited',
    chatgpt: 'external_adapter_not_cost_verified',
    openhands: 'external_adapter_not_cost_verified',
    replit: 'external_adapter_not_cost_verified'
  }
}

export function isOrganizationAgentCostAllowed(agent: OrganizationAgentId): boolean {
  return ZERO_INCREMENTAL_COST_POLICY.allowedAgents.includes(agent)
}
