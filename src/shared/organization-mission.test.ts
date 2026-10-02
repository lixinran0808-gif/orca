import { describe, expect, it } from 'vitest'
import { createHumanDecisionPacket, planOrganizationMission } from './organization-mission'

describe('planOrganizationMission', () => {
  it('keeps the human above the commander and excludes Claude from worker dispatch', () => {
    const plan = planOrganizationMission({
      id: 'm1',
      objective: 'Build a prototype',
      acceptanceCriteria: ['produces an artifact'],
      requestedAgents: ['claude', 'codex', 'gemini']
    })
    expect(plan.map((worker) => worker.agent)).toEqual(['codex', 'gemini'])
    expect(plan.every((worker) => worker.task.includes('Human Supervisor is the final decision maker'))).toBe(true)
  })

  it('caps parallel workers at eight and removes duplicates', () => {
    const plan = planOrganizationMission({
      id: 'm2',
      objective: 'Explore',
      acceptanceCriteria: ['evidence'],
      requestedAgents: ['codex', 'gemini', 'codex', 'chatgpt', 'jev', 'hermes', 'devin', 'openhands', 'cursor', 'cline', 'aider']
    })
    expect(plan).toHaveLength(8)
    expect(new Set(plan.map((worker) => worker.agent)).size).toBe(8)
  })
})

describe('createHumanDecisionPacket', () => {
  it('always returns to the human with pending approval', () => {
    expect(createHumanDecisionPacket('m3', {
      artifacts: ['artifact.zip'],
      tests: ['pass'],
      risks: [],
      proposedNextAction: 'merge',
      approvalRequired: true
    }).approvalStatus).toBe('pending')
  })
})
