import { describe, expect, it } from 'vitest'
import { isOrganizationAgentCostAllowed, ZERO_INCREMENTAL_COST_POLICY } from './organization-cost-policy'

describe('ZERO_INCREMENTAL_COST_POLICY', () => {
  it('hard-blocks Jev from automatic paid execution', () => {
    expect(isOrganizationAgentCostAllowed('jev')).toBe(false)
    expect(ZERO_INCREMENTAL_COST_POLICY.blockedAgents.jev).toBe('paid_external_usage_prohibited')
  })

  it('keeps unverified external adapters blocked by default', () => {
    expect(isOrganizationAgentCostAllowed('chatgpt')).toBe(false)
    expect(isOrganizationAgentCostAllowed('openhands')).toBe(false)
    expect(isOrganizationAgentCostAllowed('replit')).toBe(false)
  })
})
