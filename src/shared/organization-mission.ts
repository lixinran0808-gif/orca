export type OrganizationAgentId =
  | 'claude' | 'codex' | 'gemini' | 'chatgpt' | 'jev' | 'hermes' | 'devin'
  | 'openhands' | 'cursor' | 'cline' | 'aider' | 'opencode' | 'copilot'
  | 'continue' | 'replit'

export type OrganizationMission = {
  id: string
  objective: string
  acceptanceCriteria: readonly string[]
  requestedAgents?: readonly OrganizationAgentId[]
}

export type WorkerAssignment = {
  agent: OrganizationAgentId
  role: string
  task: string
  deliverables: readonly string[]
  execution: 'orca-tui' | 'external-adapter' | 'decision-service'
}

const roles: Record<OrganizationAgentId, Omit<WorkerAssignment, 'agent' | 'task' | 'deliverables'>> = {
  claude: { role: 'Field Commander / Chief Architect', execution: 'orca-tui' },
  codex: { role: 'Principal Engineer', execution: 'orca-tui' },
  gemini: { role: 'Large Context Analyst', execution: 'orca-tui' },
  chatgpt: { role: 'Product Strategist', execution: 'external-adapter' },
  jev: { role: 'Decision Engine', execution: 'decision-service' },
  hermes: { role: 'Memory and Integration Agent', execution: 'orca-tui' },
  devin: { role: 'Independent Development Unit', execution: 'orca-tui' },
  openhands: { role: 'Autonomous Experiment Unit', execution: 'external-adapter' },
  cursor: { role: 'UI and Rapid Editing Unit', execution: 'orca-tui' },
  cline: { role: 'MCP and Tool Integration Unit', execution: 'orca-tui' },
  aider: { role: 'Git Specialist', execution: 'orca-tui' },
  opencode: { role: 'Independent Second Opinion', execution: 'orca-tui' },
  copilot: { role: 'Code Review and GitHub Unit', execution: 'orca-tui' },
  continue: { role: 'Local Model Research Unit', execution: 'orca-tui' },
  replit: { role: 'Rapid Prototype Unit', execution: 'external-adapter' }
}

const defaultWorkers: readonly OrganizationAgentId[] = ['chatgpt', 'gemini', 'codex', 'opencode', 'copilot']

export function planOrganizationMission(mission: OrganizationMission): readonly WorkerAssignment[] {
  const selected = mission.requestedAgents?.length ? mission.requestedAgents : defaultWorkers
  const unique = [...new Set(selected)].filter((agent) => agent !== 'claude').slice(0, 8)
  return unique.map((agent) => ({
    agent,
    ...roles[agent],
    task: buildWorkerTask(mission, roles[agent].role),
    deliverables: ['result summary', 'inspectable artifact', 'evidence or test result']
  }))
}

function buildWorkerTask(
  mission: OrganizationMission,
  role: string
): string {
  return [
    `Mission: ${mission.objective}`,
    `Your assigned role: ${role}`,
    'Acceptance criteria:',
    ...mission.acceptanceCriteria.map((criterion) => `- ${criterion}`),
    'Return concrete artifacts and evidence. Do not claim final authority.',
    'The Human Supervisor is the final decision maker; Claude is the field commander.'
  ].join('\n')
}

export type HumanDecisionPacket = {
  missionId: string
  artifacts: readonly string[]
  tests: readonly string[]
  risks: readonly string[]
  proposedNextAction: string
  approvalRequired: boolean
  approvalStatus: 'pending'
}

export function createHumanDecisionPacket(
  missionId: string,
  input: Omit<HumanDecisionPacket, 'missionId' | 'approvalStatus'>
): HumanDecisionPacket {
  return { missionId, ...input, approvalStatus: 'pending' }
}
