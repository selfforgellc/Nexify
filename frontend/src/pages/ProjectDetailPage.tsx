import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import {
  ArrowLeft,
  Bot,
  Code2,
  ExternalLink,
  FolderKanban,
  Github,
  Loader2,
  Rocket,
  ShieldCheck,
} from 'lucide-react'

import {
  fetchWorkspaceProject,
  type NexifyProjectProfile,
} from '../lib/workspace-api'

export function ProjectDetailPage() {
  const { projectId } = useParams()
  const [project, setProject] = useState<NexifyProjectProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProject() {
      if (!projectId) {
        setError('Missing project id.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const data = await fetchWorkspaceProject(projectId)
        setProject(data)
      } catch (err) {
        console.error(err)
        setError('Failed to load project.')
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [projectId])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading project workspace...</span>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-300">
          {error || 'Project not found.'}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <Link
        to="/projects"
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

      <div className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-300">
                <FolderKanban className="h-6 w-6" />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-white">{project.name}</h1>
                <p className="text-sm text-zinc-500">{project.type}</p>
              </div>
            </div>

            <p className="max-w-3xl text-zinc-300">{project.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300">
              {project.status}
            </span>

            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-700 hover:text-white"
            >
              <Github className="h-4 w-4" />
              Repository
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
          <div className="mb-4 flex items-center gap-3">
            <Code2 className="h-5 w-5 text-cyan-300" />
            <h2 className="font-semibold text-white">Architecture</h2>
          </div>

          <div className="space-y-4 text-sm">
            <InfoRow label="Frontend" value={String(project.frontend.framework || 'Unknown')} />
            <InfoRow label="Frontend Path" value={String(project.frontend.path || 'Unknown')} />
            <InfoRow label="Backend" value={String(project.backend.framework || 'Unknown')} />
            <InfoRow label="Backend Path" value={String(project.backend.path || 'Unknown')} />
            <InfoRow label="Branch" value={project.branch} />
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
          <div className="mb-4 flex items-center gap-3">
            <Bot className="h-5 w-5 text-cyan-300" />
            <h2 className="font-semibold text-white">AI Runtime</h2>
          </div>

          <div className="space-y-4 text-sm">
            <InfoRow label="Provider" value={String(project.ai.provider || 'Unknown')} />
            <InfoRow label="Default Model" value={String(project.ai.defaultModel || 'Unknown')} />
            <InfoRow label="Base Model" value={String(project.ai.baseModel || 'Unknown')} />
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
          <div className="mb-4 flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-cyan-300" />
            <h2 className="font-semibold text-white">Safety Rules</h2>
          </div>

          <div className="space-y-3 text-sm text-zinc-300">
            {Object.entries(project.rules).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <span className="text-zinc-500">{key}</span>
                <span className={value ? 'text-emerald-300' : 'text-zinc-400'}>
                  {String(value)}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
        <div className="mb-4 flex items-center gap-3">
          <Rocket className="h-5 w-5 text-cyan-300" />
          <h2 className="font-semibold text-white">Next Actions</h2>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <ActionCard title="Inspect Files" description="Browse project files safely." />
          <ActionCard title="Run Build" description="Execute approved build commands." />
          <ActionCard title="Review Logs" description="Analyze errors and runtime output." />
          <ActionCard title="Deploy" description="Prepare Vercel/Render deployment flow." />
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-1 text-zinc-500">{label}</div>
      <div className="break-words text-zinc-200">{value}</div>
    </div>
  )
}

function ActionCard({ title, description }: { title: string; description: string }) {
  return (
    <button
      type="button"
      className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 text-left transition-all hover:border-cyan-500/40 hover:bg-zinc-900"
    >
      <div className="font-medium text-white">{title}</div>
      <div className="mt-1 text-sm text-zinc-500">{description}</div>
    </button>
  )
}
