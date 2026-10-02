import { describe, expect, it } from 'vitest'
import { buildOrganizationLaunchPlans } from './organization-launch-plan'

describe('buildOrganizationLaunchPlans', () => {
  it('reuses Orca launch intents for supported CLI agents', () => {
    const plans = buildOrganizationLaunchPlans({
      mission: {
        id: 'mission-1',
        objective: 'Implement and review a feature',
        acceptanceCriteria: ['tests pass'],
        requestedAgents: ['codex', 'gemini', 'copilot']
      },
      worktree: 'id:workspace-1'
    })

    expect(plans.map((plan) => plan.launchIntent?.agent)).toEqual([
      'codex',
      'gemini',
      'copilot'
    ])
    expect(plans.every((plan) => plan.launchIntent?.launchSource === 'ai-organization')).toBe(true)
    expect(plans.every((plan) => plan.launchIntent?.prompt?.delivery === 'submit')).toBe(true)
  })

  it('does not pretend external services are locally connected', () => {
    const plans = buildOrganizationLaunchPlans({
      mission: {
        id: 'mission-2',
        objective: 'Compare product and decision proposals',
        acceptanceCriteria: ['return evidence'],
        requestedAgents: ['chatgpt', 'jev', 'openhands', 'replit']
      },
      worktree: 'id:workspace-1'
    })

    expect(plans.map((plan) => plan.blockedReason)).toEqual([
      'external_adapter_required',
      'decision_service_adapter_required',
      'external_adapter_required',
      'external_adapter_required'
    ])
    expect(plans.every((plan) => plan.launchIntent === undefined)).toBe(true)
  })
})
