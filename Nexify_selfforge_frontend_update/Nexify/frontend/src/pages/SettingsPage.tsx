import { useEffect, useState } from 'react';
import { Check, Cpu, Download, Globe, Key, Mic, Moon, Palette, Save, ServerCog, Settings2, ShieldCheck, Sun, Trash2, Upload } from 'lucide-react';
import { useAppStore, type ThemeMode } from '../lib/store';
import { checkHealth, fetchSpeechHealth } from '../lib/api';

function Section({ title, icon: Icon, children, subtitle }: { title: string; subtitle?: string; icon: typeof Cpu; children: React.ReactNode }) {
  return (
    <div className="nex-card p-5">
      <div className="mb-5 flex items-center gap-3">
        <div className="nex-icon"><Icon size={18} /></div>
        <div>
          <h3 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>{title}</h3>
          {subtitle && <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function Row({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3" style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
      <div>
        <div className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{label}</div>
        {description && <div className="mt-1 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{description}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function ApiKeyInput({ storageKey, placeholder }: { storageKey: string; placeholder: string }) {
  const [value, setValue] = useState(() => {
    try { return localStorage.getItem(storageKey) || ''; } catch { return ''; }
  });
  const [saved, setSaved] = useState(false);
  const save = (v: string) => {
    setValue(v);
    try { v ? localStorage.setItem(storageKey, v) : localStorage.removeItem(storageKey); } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };
  return (
    <div className="flex items-center gap-2">
      <input
        type="password"
        value={value}
        onChange={(e) => save(e.target.value)}
        placeholder={placeholder}
        className="w-56 rounded-xl px-3 py-2 text-xs outline-none"
        style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
      />
      {saved && <Check size={14} style={{ color: 'var(--color-success)' }} />}
    </div>
  );
}

const themeOptions: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Cpu },
];

export function SettingsPage() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const conversations = useAppStore((s) => s.conversations);
  const serverInfo = useAppStore((s) => s.serverInfo);
  const selectedModel = useAppStore((s) => s.selectedModel);
  const [healthy, setHealthy] = useState<boolean | null>(null);
  const [speechBackendAvailable, setSpeechBackendAvailable] = useState<boolean | null>(null);
  const [saved, setSaved] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    checkHealth().then(setHealthy);
    fetchSpeechHealth().then((h) => setSpeechBackendAvailable(h.available)).catch(() => setSpeechBackendAvailable(false));
  }, []);

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleExport = () => {
    const data = localStorage.getItem('nexify-conversations') || '{}';
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexify-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          localStorage.setItem('nexify-conversations', JSON.stringify(data));
          useAppStore.getState().loadConversations();
          showSaved();
        } catch {}
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
      return;
    }
    localStorage.removeItem('nexify-conversations');
    useAppStore.getState().loadConversations();
    setConfirmClear(false);
    showSaved();
  };

  return (
    <div className="flex-1 overflow-y-auto px-5 py-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <section className="nex-hero rounded-3xl p-6 lg:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="nex-chip mb-4"><Settings2 size={14} /> Nexify Control Room</div>
              <h1 className="text-3xl font-bold tracking-tight lg:text-5xl" style={{ color: 'var(--color-text)' }}>Settings built for SelfForge operations.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6" style={{ color: 'var(--color-text-secondary)' }}>
                Keep the engine clean: model settings, security rules, cloud fallback keys, local data, and the look of the Nexify workspace.
              </p>
            </div>
            {saved && <span className="nex-chip"><Check size={14} /> Saved</span>}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Section title="Appearance" subtitle="SelfForge visual layer" icon={Palette}>
            <Row label="Theme" description="Dark is recommended for the Nexify command center.">
              <div className="flex gap-2">
                {themeOptions.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => { updateSettings({ theme: value }); showSaved(); }}
                    className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold"
                    style={{
                      background: settings.theme === value ? 'var(--color-accent)' : 'var(--color-bg-tertiary)',
                      color: settings.theme === value ? 'var(--color-on-accent)' : 'var(--color-text-secondary)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <Icon size={14} /> {label}
                  </button>
                ))}
              </div>
            </Row>
            <Row label="Accent" description="Current palette is tuned around cyan, steel, and forge amber.">
              <span className="nex-chip">SelfForge</span>
            </Row>
          </Section>

          <Section title="Engine" subtitle="Local AI runtime" icon={Cpu}>
            <Row label="Backend status" description="FastAPI-compatible Nexify server.">
              <span className="nex-chip" style={{ color: healthy ? 'var(--color-success)' : 'var(--color-warning)' }}>{healthy ? 'Online' : 'Checking'}</span>
            </Row>
            <Row label="Selected model" description="Current active model from the local runtime.">
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{selectedModel || 'Auto'}</span>
            </Row>
            <Row label="Server info" description="Runtime metadata reported by the backend.">
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{serverInfo ? 'Loaded' : 'Pending'}</span>
            </Row>
          </Section>

          <Section title="Voice & Input" subtitle="Optional voice layer" icon={Mic}>
            <Row label="Speech backend" description="Voice can be added later after builder core is stable.">
              <span className="nex-chip" style={{ color: speechBackendAvailable ? 'var(--color-success)' : 'var(--color-text-tertiary)' }}>{speechBackendAvailable ? 'Available' : 'Offline'}</span>
            </Row>
          </Section>

          <Section title="Cloud Fallback" subtitle="Optional, not primary" icon={Key}>
            <Row label="OpenAI key" description="Use only when local Ollama is not enough.">
              <ApiKeyInput storageKey="nexify-openai-key" placeholder="sk-..." />
            </Row>
            <Row label="Router policy" description="Local-first; cloud should be a deliberate fallback.">
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Local first</span>
            </Row>
          </Section>

          <Section title="Security" subtitle="Approval gate defaults" icon={ShieldCheck}>
            <Row label="File writes" description="Nex should propose patches before modifying files.">
              <span className="nex-chip">Approval required</span>
            </Row>
            <Row label="Shell commands" description="Terminal execution should always show the command first.">
              <span className="nex-chip">Approval required</span>
            </Row>
          </Section>

          <Section title="Data" subtitle={`${conversations.length} conversations saved locally`} icon={Globe}>
            <div className="flex flex-wrap gap-2">
              <button onClick={handleExport} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold" style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}><Download size={14} /> Export</button>
              <button onClick={handleImport} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold" style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}><Upload size={14} /> Import</button>
              <button onClick={handleClear} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold" style={{ background: confirmClear ? 'var(--color-error)' : 'var(--color-bg-tertiary)', color: confirmClear ? 'white' : 'var(--color-text)', border: '1px solid var(--color-border)' }}><Trash2 size={14} /> {confirmClear ? 'Confirm clear' : 'Clear local data'}</button>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
