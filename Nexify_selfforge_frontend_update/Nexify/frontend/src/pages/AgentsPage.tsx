import { Bot, Brain, CheckCircle2, Code2, GitBranch, Lock, Play, Plus, Rocket, Shield, TerminalSquare } from 'lucide-react';

const agents = [
  { name: 'Nex Builder', status: 'Designing', icon: Code2, desc: 'Turns requests into plans, file edits, terminal commands, and reviewed build steps.' },
  { name: 'Deploy Operator', status: 'Queued', icon: Rocket, desc: 'Prepares Vercel, Render, GitHub, env vars, and deployment checks.' },
  { name: 'Memory Curator', status: 'Local-first', icon: Brain, desc: 'Stores project context, decisions, repo history, and SelfForge standards.' },
  { name: 'Security Gate', status: 'Required', icon: Shield, desc: 'Blocks risky actions until you approve them and keeps secrets out of logs.' },
];

const capabilities = [
  'Read and summarize project structure',
  'Create patch plans before writing files',
  'Run local tests and capture terminal output',
  'Push approved commits to GitHub',
  'Prepare Render/Vercel deployment steps',
  'Remember SelfForge coding standards per project',
];

export function AgentsPage() {
  return (
    <div className="flex-1 overflow-y-auto px-5 py-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <section className="nex-hero rounded-3xl p-6 lg:p-8">
          <div className="nex-chip mb-4"><Bot size={14} /> Nexify Agent Forge</div>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-bold tracking-tight lg:text-5xl" style={{ color: 'var(--color-text)' }}>
                Agents that build with permission, memory, and control.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6" style={{ color: 'var(--color-text-secondary)' }}>
                This page is now shaped around the Nexify mission: a SelfForge operator layer that plans, edits, tests, commits, and deploys without turning into chaos.
              </p>
            </div>
            <button className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition" style={{ background: 'var(--color-accent)', color: 'var(--color-on-accent)' }}>
              <Plus size={16} /> New Agent Blueprint
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          {agents.map(({ name, status, icon: Icon, desc }) => (
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

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_380px]">
          <div className="nex-card p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="nex-icon"><TerminalSquare size={18} /></div>
              <div>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Builder Execution Flow</h2>
                <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>The workflow Nex will follow before touching any project.</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                ['Understand', 'Read project files, previous context, and your active goal.'],
                ['Plan', 'Create a human-readable build plan with risks and file targets.'],
                ['Approve', 'Wait for approval before writing files or running commands.'],
                ['Execute', 'Apply patches, run tests, collect errors, and repair.'],
                ['Ship', 'Commit, push, and prepare deploy once the build is stable.'],
              ].map(([title, desc], index) => (
                <div key={title} className="flex gap-4 rounded-2xl border p-4" style={{ borderColor: 'var(--color-border-subtle)', background: 'rgba(255,255,255,0.025)' }}>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold" style={{ background: 'var(--color-accent-subtle)', color: 'var(--color-accent)' }}>{index + 1}</span>
                  <div>
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{title}</h3>
                    <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="nex-card p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="nex-icon"><Lock size={18} /></div>
              <div>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Approved Capabilities</h2>
                <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>What Nexify should be allowed to do.</p>
              </div>
            </div>
            <div className="space-y-3">
              {capabilities.map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--color-success)' }} className="mt-0.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold" style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}>
              <Play size={16} /> Prepare Agent Runtime
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
