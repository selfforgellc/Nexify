export type NexifyProjectProfile = {
  id: string
  name: string
  type: string
  description: string
  localPath: string
  repoUrl: string
  branch: string
  frontend: Record<string, unknown>
  backend: Record<string, unknown>
  ai: Record<string, unknown>
  rules: Record<string, unknown>
  status: string
}

export type WorkspaceProjectsResponse = {
  projects: NexifyProjectProfile[]
}

const API_BASE =
  import.meta.env.VITE_NEXIFY_API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://127.0.0.1:8000'

async function requestJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Nexify API request failed: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<T>
}

export async function fetchWorkspaceProjects(): Promise<NexifyProjectProfile[]> {
  const data = await requestJson<WorkspaceProjectsResponse>('/api/workspace/projects')
  return data.projects
}

export async function fetchWorkspaceProject(projectId: string): Promise<NexifyProjectProfile> {
  const data = await requestJson<{ project: NexifyProjectProfile }>(
    `/api/workspace/projects/${encodeURIComponent(projectId)}`,
  )

  return data.project
}
