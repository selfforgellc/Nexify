import { ArrowRight, CheckCircle2, Code2, Cpu, Github, MonitorSmartphone, Rocket, Server, Sparkles, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router';

const steps = [
  { title: 'Run the engine', desc: 'Start Nexify backend with uv run nex serve and keep Ollama running.', icon: Cpu },
  { title: 'Choose the model', desc: 'Use qwen2.5-coder:7b for coding work and a smaller model for fast chat.', icon: Sparkles },
  { title: 'Connect a project', desc: 'Point Nex at one SelfForge app at a time so memory stays clean.', icon: Code2 },
  { title: 'Approve actions', desc: 'Nex proposes file edits, tests, and terminal commands before execution.', icon: CheckCircle2 },
  { title: 'Commit and deploy', desc: 'Push approved changes to GitHub, then deploy frontend/backend where needed.', icon: Rocket },
];

const commands = [
  'cd C:\\dev\\Nexify',
  'uv run nex serve',
  'ollama run qwen2.5-coder:7b',
  'cd frontend && npm run dev',
];

export function GetStartedPage() {
  const navigate = useNavigate();
  return (
    <div className="flex-1 overflow-y-auto px-5 py-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <section className="nex-hero rounded-3xl p-6 lg:p-8">
          <div className="nex-chip mb-4"><MonitorSmartphone size={14} /> Nexify Launch Path</div>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-bold tracking-tight lg:text-5xl" style={{ color: 'var(--color-text)' }}>
                Build the new SelfForge operator one stable wave at a time.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6" style={{ color: 'var(--color-text-secondary)' }}>
                Nexify is no longer a JarJar rebuild. It is a clean platform with local AI, project memory, controlled actions, and future phone-access deployment.
              </p>
            </div>
            <button onClick={() => navigate('/')} className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold" style={{ background: 'var(--color-accent)', color: 'var(--color-on-accent)' }}>
              Open Command Center <ArrowRight size={16} />
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_420px]">
          <div className="nex-card p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="nex-icon"><Rocket size={18} /></div>
              <div>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Build Sequence</h2>
                <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>The correct order so Nexify does not turn messy.</p>
              </div>
            </div>
            <div className="space-y-3">
              {steps.map(({ title, desc, icon: Icon }, index) => (
                <div key={title} className="flex gap-4 rounded-2xl border p-4" style={{ borderColor: 'var(--color-border-subtle)', background: 'rgba(255,255,255,0.025)' }}>
                  <div className="nex-icon shrink-0"><Icon size={18} /></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold" style={{ color: 'var(--color-accent)' }}>0{index + 1}</span>
                      <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{title}</h3>
                    </div>
                    <p className="mt-1 text-sm leading-6" style={{ color: 'var(--color-text-secondary)' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="nex-card p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="nex-icon"><Terminal size={18} /></div>
                <div>
                  <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Local Commands</h2>
                  <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>Keep these simple while we build.</p>
                </div>
              </div>
              <div className="space-y-2">
                {commands.map((cmd) => (
                  <code key={cmd} className="block rounded-xl px-3 py-2 text-xs" style={{ background: 'var(--color-code-bg)', color: 'var(--color-text)', border: '1px solid var(--color-border-subtle)' }}>{cmd}</code>
                ))}
              </div>
            </div>

            <div className="nex-card p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="nex-icon"><Github size={18} /></div>
                <div>
                  <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Deployment Goal</h2>
                  <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>Phone access stays part of the plan.</p>
                </div>
              </div>
              <div className="space-y-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                <p className="flex items-start gap-2"><Server size={16} className="mt-0.5 shrink-0" /> Backend API stays deployable for Render/cloud runtime.</p>
                <p className="flex items-start gap-2"><MonitorSmartphone size={16} className="mt-0.5 shrink-0" /> Frontend stays web-first so you can open Nexify from your phone.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
