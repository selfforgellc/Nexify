import { useEffect, useState } from 'react'
import { FolderKanban, Github, Loader2 } from 'lucide-react'
import { Link } from 'react-router'

import {
  fetchWorkspaceProjects,
  type NexifyProjectProfile,
} from '../lib/workspace-api'

export function ProjectsPage() {
  const [projects, setProjects] = useState<NexifyProjectProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true)
        setError(null)

        const data = await fetchWorkspaceProjects()
        setProjects(data)
      } catch (err) {
        console.error(err)
        setError('Failed to load workspace projects.')
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading workspace projects...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-300">
          {error}
        </div>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
          <FolderKanban className="mx-auto mb-4 h-10 w-10 text-zinc-500" />
          <h2 className="mb-2 text-xl font-semibold text-white">
            No projects found
          </h2>
          <p className="text-zinc-400">
            Add workspace project profiles to begin using Nexify projects.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Projects</h1>
        <p className="mt-2 text-zinc-400">
          Workspace-managed SelfForge software projects.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <Link
  key={project.id}
  to={`/projects/${project.id}`}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {project.name}
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  {project.type}
                </p>
              </div>

              <FolderKanban className="h-6 w-6 text-zinc-500" />
            </div>

            <p className="mb-6 text-sm leading-6 text-zinc-300">
              {project.description}
            </p>

            <div className="space-y-3 text-sm">
              <div>
                <div className="mb-1 text-zinc-500">Frontend</div>
                <div className="text-zinc-200">
                  {String(project.frontend.framework || 'Unknown')}
                </div>
              </div>

              <div>
                <div className="mb-1 text-zinc-500">Backend</div>
                <div className="text-zinc-200">
                  {String(project.backend.framework || 'Unknown')}
                </div>
              </div>

              <div>
                <div className="mb-1 text-zinc-500">AI Model</div>
                <div className="text-zinc-200">
                  {String(project.ai.defaultModel || 'Unknown')}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-zinc-800 pt-4">
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                {project.status}
              </span>

              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-zinc-400 transition-colors hover:text-white"
              >
                <Github className="h-4 w-4" />
                Repo
              </a>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
