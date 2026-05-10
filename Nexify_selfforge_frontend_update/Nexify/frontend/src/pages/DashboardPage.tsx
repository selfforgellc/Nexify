import { Activity, BrainCircuit, Cpu, Gauge, GitBranch, Rocket, ShieldCheck, Zap } from 'lucide-react';
import { EnergyDashboard } from '../components/Dashboard/EnergyDashboard';
import { CostComparison } from '../components/Dashboard/CostComparison';
import { TraceDebugger } from '../components/Dashboard/TraceDebugger';
import { useAppStore } from '../lib/store';

function MetricCard({ icon: Icon, label, value, detail }: { icon: typeof Cpu; label: string; value: string; detail: string }) {
  return (
    <div className="nex-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em]" style={{ color: 'var(--color-text-tertiary)' }}>{label}</p>
          <h3 className="mt-2 text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>{value}</h3>
          <p className="mt-1 text-xs" style={{ color: 'var(--color-text-secondary)' }}>{detail}</p>
        </div>
        <div className="nex-icon"><Icon size={18} /></div>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const selectedModel = useAppStore((s) => s.selectedModel);
  const models = useAppStore((s) => s.models);
  const serverInfo = useAppStore((s) => s.serverInfo);
  const activeModel = selectedModel || models[0]?.id || 'local model';

  return (
    <div className="flex-1 overflow-y-auto px-5 py-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <section className="nex-hero overflow-hidden rounded-3xl p-6 lg:p-8">
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="nex-chip mb-4"><ShieldCheck size={14} /> SelfForge Command Layer</div>
              <h1 className="text-3xl font-bold tracking-tight lg:text-5xl" style={{ color: 'var(--color-text)' }}>
                Nexify is your local-first AI operating system.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6" style={{ color: 'var(--color-text-secondary)' }}>
                Monitor the engine, compare local savings, track model health, and prepare the platform for project building, GitHub actions, Render deploys, and SelfForge automation.
              </p>
            </div>
            <div className="grid min-w-[280px] grid-cols-2 gap-3">
              <div className="nex-glass p-4">
                <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Active Model</p>
                <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{activeModel}</p>
              </div>
              <div className="nex-glass p-4">
                <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Backend</p>
                <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--color-success)' }}>{serverInfo ? 'Online' : 'Checking'}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={BrainCircuit} label="Brain" value="Ollama" detail="Local model provider" />
          <MetricCard icon={Cpu} label="Runtime" value="Nex Engine" detail="FastAPI-compatible server" />
          <MetricCard icon={GitBranch} label="Builder" value="Planned" detail="GitHub + file actions next" />
          <MetricCard icon={Rocket} label="Deploy" value="Queued" detail="Vercel + Render workflow" />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="space-y-4">
            <EnergyDashboard />
            <div className="nex-card p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="nex-icon"><Zap size={18} /></div>
                <div>
                  <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Nexify Build Roadmap</h2>
                  <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Focused on turning chat into controlled software execution.</p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {['Project workspace', 'File read/write approval', 'GitHub push flow', 'Render/Vercel deploys'].map((item, index) => (
                  <div key={item} className="rounded-xl border p-3" style={{ borderColor: 'var(--color-border-subtle)', background: 'rgba(255,255,255,0.025)' }}>
                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text)' }}>
                      <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold" style={{ background: 'var(--color-accent-subtle)', color: 'var(--color-accent)' }}>{index + 1}</span>
                      {item}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <CostComparison />
        </div>

        <TraceDebugger />
      </div>
    </div>
  );
}
