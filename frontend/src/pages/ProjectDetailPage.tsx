import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  Code2,
  ExternalLink,
  FileCode2,
  Folder,
  FolderKanban,
  Github,
  Loader2,
  Rocket,
  ShieldCheck,
  X,
} from 'lucide-react'

import {
  fetchProjectFiles,
  fetchWorkspaceProject,
  readProjectFile,
  writeProjectFile,
  type NexifyProjectProfile,
  type WorkspaceFileEntry,
} from '../lib/workspace-api'

type SelectedFile = {
  name: string
  relativePath: string
  sizeBytes: number
  content: string
}

export function ProjectDetailPage() {
  const { projectId } = useParams()
  const [project, setProject] = useState<NexifyProjectProfile | null>(null)
  const [files, setFiles] = useState<WorkspaceFileEntry[]>([])
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null)
  const [draftContent, setDraftContent] = useState('')
  const [currentPath, setCurrentPath] = useState('.')
  const [loading, setLoading] = useState(true)
  const [filesLoading, setFilesLoading] = useState(true)
  const [fileLoading, setFileLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  const hasUnsavedChanges = selectedFile !== null && draftContent !== selectedFile.content

  useEffect(() => {
    async function loadProject() {
      if (!projectId) {
        setError('Missing project id.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setFilesLoading(true)
        setError(null)

        const [projectData, filesData] = await Promise.all([
          fetchWorkspaceProject(projectId),
          fetchProjectFiles(projectId, currentPath),
        ])

        setProject(projectData)
        setFiles(filesData.files)
      } catch (err) {
        console.error(err)
        setError('Failed to load project workspace.')
      } finally {
        setLoading(false)
        setFilesLoading(false)
      }
    }

    loadProject()
  }, [projectId, currentPath])

  async function openFile(file: WorkspaceFileEntry) {
    if (!projectId || file.type !== 'file') return

    try {
      setFileLoading(true)
      setFileError(null)
      setSaveMessage(null)

      const result = await readProjectFile(projectId, file.relativePath)
      const loadedFile = {
        name: result.file.name,
        relativePath: result.file.relativePath,
        sizeBytes: result.file.sizeBytes,
        content: result.file.content,
      }

      setSelectedFile(loadedFile)
      setDraftContent(loadedFile.content)
    } catch (err) {
      console.error(err)
      setFileError('Failed to read file safely.')
    } finally {
      setFileLoading(false)
    }
  }

  async function saveSelectedFile() {
    if (!projectId || !selectedFile || !hasUnsavedChanges) return

    const confirmed = window.confirm(
      `Approve writing changes to ${selectedFile.relativePath}?`,
    )

    if (!confirmed) return

    try {
      setSaving(true)
      setFileError(null)
      setSaveMessage(null)

      const result = await writeProjectFile(
        projectId,
        selectedFile.relativePath,
        draftContent,
      )

      setSelectedFile({
        ...selectedFile,
        content: draftContent,
        sizeBytes: result.file.sizeBytes,
      })

      setSaveMessage('File saved after explicit approval.')
    } catch (err) {
      console.error(err)
      setFileError('Failed to save file safely.')
    } finally {
      setSaving(false)
    }
  }

  function goUp() {
    const parts = currentPath.split('/').filter(Boolean)
    if (parts.length <= 1) {
      setCurrentPath('.')
      return
    }

    parts.pop()
    setCurrentPath(parts.join('/'))
  }

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
        <Panel title="Architecture" icon={<Code2 className="h-5 w-5 text-cyan-300" />}>
          <InfoRow label="Frontend" value={String(project.frontend.framework || 'Unknown')} />
          <InfoRow label="Frontend Path" value={String(project.frontend.path || 'Unknown')} />
          <InfoRow label="Backend" value={String(project.backend.framework || 'Unknown')} />
          <InfoRow label="Backend Path" value={String(project.backend.path || 'Unknown')} />
          <InfoRow label="Branch" value={project.branch} />
        </Panel>

        <Panel title="AI Runtime" icon={<Bot className="h-5 w-5 text-cyan-300" />}>
          <InfoRow label="Provider" value={String(project.ai.provider || 'Unknown')} />
          <InfoRow label="Default Model" value={String(project.ai.defaultModel || 'Unknown')} />
          <InfoRow label="Base Model" value={String(project.ai.baseModel || 'Unknown')} />
        </Panel>

        <Panel title="Safety Rules" icon={<ShieldCheck className="h-5 w-5 text-cyan-300" />}>
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
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(480px,0.95fr)]">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <FileCode2 className="h-5 w-5 text-cyan-300" />
              <h2 className="font-semibold text-white">Project Files</h2>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <span className="text-zinc-500">Current Path:</span>
              <span className="rounded-lg bg-zinc-900 px-2 py-1 text-zinc-300">
                {currentPath}
              </span>
              {currentPath !== '.' && (
                <button
                  type="button"
                  onClick={goUp}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-300 transition-colors hover:border-zinc-700 hover:text-white"
                >
                  Up
                </button>
              )}
            </div>
          </div>

          {filesLoading ? (
            <div className="flex items-center gap-3 text-zinc-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading files...
            </div>
          ) : (
            <div className="space-y-2">
              {files.map((file) => (
                <button
                  type="button"
                  key={file.relativePath}
                  onClick={() => {
                    if (file.type === 'directory') {
                      setCurrentPath(file.relativePath)
                      setSelectedFile(null)
                      setDraftContent('')
                      setFileError(null)
                      setSaveMessage(null)
                    } else {
                      openFile(file)
                    }
                  }}
                  className="flex w-full items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-left transition-all hover:border-zinc-700"
                >
                  <div className="flex items-center gap-3">
                    {file.type === 'directory' ? (
                      <Folder className="h-4 w-4 text-cyan-300" />
                    ) : (
                      <FileCode2 className="h-4 w-4 text-zinc-400" />
                    )}
                    <div>
                      <div className="text-sm font-medium text-white">{file.name}</div>
                      <div className="text-xs text-zinc-500">{file.relativePath}</div>
                    </div>
                  </div>

                  <div className="text-right text-xs text-zinc-500">
                    <div>{file.type}</div>
                    {file.type === 'file' && (
                      <div>{(file.sizeBytes / 1024).toFixed(1)} KB</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Code2 className="h-5 w-5 text-cyan-300" />
              <h2 className="font-semibold text-white">File Editor</h2>
            </div>

            {selectedFile && (
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null)
                  setDraftContent('')
                  setFileError(null)
                  setSaveMessage(null)
                }}
                className="rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 transition-colors hover:border-zinc-700 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {fileLoading && (
            <div className="flex items-center gap-3 text-zinc-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Reading file safely...
            </div>
          )}

          {fileError && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              {fileError}
            </div>
          )}

          {saveMessage && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              {saveMessage}
            </div>
          )}

          {!fileLoading && !selectedFile && (
            <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/40 p-6 text-sm text-zinc-500">
              Select a readable file. Edits require explicit approval before writing.
            </div>
          )}

          {selectedFile && !fileLoading && (
            <div>
              <div className="mb-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
                <div className="text-sm font-medium text-white">{selectedFile.name}</div>
                <div className="mt-1 text-xs text-zinc-500">
                  {selectedFile.relativePath} • {(selectedFile.sizeBytes / 1024).toFixed(1)} KB
                </div>
              </div>

              <textarea
                value={draftContent}
                onChange={(event) => {
                  setDraftContent(event.target.value)
                  setSaveMessage(null)
                }}
                spellCheck={false}
                className="min-h-[520px] w-full resize-y rounded-xl border border-zinc-800 bg-black/40 p-4 font-mono text-xs leading-5 text-zinc-200 outline-none transition-colors focus:border-cyan-500/40"
              />

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="text-xs text-zinc-500">
                  {hasUnsavedChanges
                    ? 'Unsaved changes pending approval.'
                    : 'No unsaved changes.'}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!hasUnsavedChanges || saving}
                    onClick={() => selectedFile && setDraftContent(selectedFile.content)}
                    className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Reset
                  </button>

                  <button
                    type="button"
                    disabled={!hasUnsavedChanges || saving}
                    onClick={saveSelectedFile}
                    className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200 transition-colors hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                    Approve Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
        <div className="mb-4 flex items-center gap-3">
          <Rocket className="h-5 w-5 text-cyan-300" />
          <h2 className="font-semibold text-white">Next Actions</h2>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <ActionCard title="Inspect Files" description="Browse, preview, and edit files safely." />
          <ActionCard title="Run Build" description="Execute approved build commands." />
          <ActionCard title="Review Logs" description="Analyze errors and runtime output." />
          <ActionCard title="Deploy" description="Prepare Vercel/Render deployment flow." />
        </div>
      </div>
    </div>
  )
}

function Panel({
  title,
  icon,
  children,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
      <div className="mb-4 flex items-center gap-3">
        {icon}
        <h2 className="font-semibold text-white">{title}</h2>
      </div>
      <div className="space-y-4 text-sm">{children}</div>
    </section>
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
