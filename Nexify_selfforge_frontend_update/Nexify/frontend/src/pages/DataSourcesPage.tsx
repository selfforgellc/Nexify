import { BookOpen, Brain, Database, FileCode2, FolderGit2, Github, HardDrive, KeyRound, ServerCog, ShieldCheck } from 'lucide-react';

const sources = [
  { name: 'Project Repositories', icon: FolderGit2, status: 'Next', desc: 'Connect AutoForge, TruckerForge, ContractorForge, and future SelfForge apps as active workspaces.' },
  { name: 'GitHub Context', icon: Github, status: 'Planned', desc: 'Read branches, commits, diffs, issues, and deployment history before Nex writes code.' },
  { name: 'Local Files', icon: HardDrive, status: 'Local', desc: 'Index selected folders only, with approval before editing or shell execution.' },
  { name: 'Knowledge Base', icon: BookOpen, status: 'Ready', desc: 'Store project decisions, business rules, UI standards, pricing, and launch plans.' },
  { name: 'Deploy Targets', icon: ServerCog, status: 'Queued', desc: 'Render, Vercel, environment variables, build logs, and deployment diagnostics.' },
  { name: 'Secure Secrets', icon: KeyRound, status: 'Protected', desc: 'API keys remain local or encrypted. Nex should never print secrets into chat.' },
];

export function DataSourcesPage() {
  return (
    <div className="flex-1 overflow-y-auto px-5 py-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <section className="nex-hero rounded-3xl p-6 lg:p-8">
          <div className="nex-chip mb-4"><Database size={14} /> Workspace Memory</div>
          <h1 className="max-w-4xl text-3xl font-bold tracking-tight lg:text-5xl" style={{ color: 'var(--color-text)' }}>
            Give Nex the right context without giving it uncontrolled access.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6" style={{ color: 'var(--color-text-secondary)' }}>
            Data sources are being reshaped around the SelfForge workflow: repos, project documents, local folders, deploy logs, and memory that stays useful across builds.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sources.map(({ name, icon: Icon, status, desc }) => (
            <div key={name} className="nex-card p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="nex-icon"><Icon size={18} /></div>
                <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ background: 'var(--color-accent-subtle)', color: 'var(--color-accent)' }}>{status}</span>
              </div>
              <h3 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>{name}</h3>
              <p className="mt-2 text-sm leading-6" style={{ color: 'var(--color-text-secondary)' }}>{desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_420px]">
          <div className="nex-card p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="nex-icon"><Brain size={18} /></div>
              <div>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Nexify Memory Rules</h2>
                <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>The memory layer should improve builds, not create clutter.</p>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                ['Project-specific', 'Each SelfForge app gets its own remembered constraints, stack, deploy details, and UI rules.'],
                ['Approval-based', 'Nex can read approved paths; writes and terminal commands require explicit approval.'],
                ['Build-aware', 'Errors, fixes, branches, and deployment problems become useful context later.'],
                ['Privacy-first', 'Secrets, keys, and legal/private documents stay protected by policy.'],
              ].map(([title, desc]) => (
                <div key={title} className="rounded-2xl border p-4" style={{ borderColor: 'var(--color-border-subtle)', background: 'rgba(255,255,255,0.025)' }}>
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{title}</h3>
                  <p className="mt-2 text-sm leading-6" style={{ color: 'var(--color-text-secondary)' }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="nex-card p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="nex-icon"><ShieldCheck size={18} /></div>
              <div>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Connection Priority</h2>
                <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>Best order for the next build wave.</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                ['1', 'Local project folders'],
                ['2', 'GitHub repository access'],
                ['3', 'Render/Vercel logs'],
                ['4', 'Persistent project memory'],
              ].map(([num, item]) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border p-3" style={{ borderColor: 'var(--color-border-subtle)' }}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold" style={{ background: 'var(--color-accent-subtle)', color: 'var(--color-accent)' }}>{num}</span>
                  <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
