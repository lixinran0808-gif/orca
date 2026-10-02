import type { AgentLaunchIntent } from './agent-launch-intent'
import type { TuiAgent } from './tui-agent'
import {
  planOrganizationMission,
  type OrganizationAgentId,
  type OrganizationMission,
  type WorkerAssignment
} from './organization-mission'

const ORCA_AGENT_MAP: Partial<Record<OrganizationAgentId, TuiAgent>> = {
  claude: 'claude',
  codex: 'codex',
  gemini: 'gemini',
  hermes: 'hermes',
  devin: 'devin',
  cursor: 'cursor',
  cline: 'cline',
  aider: 'aider',
  opencode: 'opencode',
  copilot: 'copilot',
  continue: 'continue'
}

export type OrganizationLaunchPlan = {
  assignment: WorkerAssignment
  launchIntent?: AgentLaunchIntent
  blockedReason?: string
}

/**
 * Adapts the organization planner to Orca's existing launch pipeline.
 * It never starts a process itself: callers pass launchIntent to executeAgentLaunch,
 * keeping Orca's existing trust, worktree, structured-session, and prompt-delivery rules intact.
 */
export function buildOrganizationLaunchPlans(params: {
  mission: OrganizationMission
  worktree: string
}): readonly OrganizationLaunchPlan[] {
  return planOrganizationMission(params.mission).map((assignment) => {
    const agent = ORCA_AGENT_MAP[assignment.agent]
    if (!agent) {
      return {
        assignment,
        blockedReason:
          assignment.execution === 'decision-service'
            ? 'decision_service_adapter_required'
            : 'external_adapter_required'
      }
    }

    return {
      assignment,
      launchIntent: {
        agent,
        target: { kind: 'existing', worktree: params.worktree },
        prompt: { text: assignment.task, delivery: 'submit' },
        launchSource: 'ai-organization'
      }
    }
  })
}
