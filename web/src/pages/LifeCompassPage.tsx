import { useEffect, useMemo, useState } from "react";
import { Compass, ExternalLink, RefreshCw, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LifeCompassStatus = {
  available: boolean;
  entrypoint: string | null;
  site_root: string;
  entry_mtime: number | null;
  entry_size_bytes: number | null;
  missing: string[];
  snapshot?: {
    available: boolean;
    missing: string[];
    manifest?: Record<string, unknown>;
    error?: string;
  };
  safety: {
    mode: string;
    raw_html_in_api: boolean;
    nas_mounted_on_vps: boolean;
  };
};

function formatSnapshotTime(value: number | null): string {
  if (!value) return "미확인";
  return new Date(value * 1000).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function LifeCompassPage() {
  const [status, setStatus] = useState<LifeCompassStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/life-compass/status", { cache: "no-store" });
      if (!response.ok) throw new Error(`status ${response.status}`);
      setStatus(await response.json());
    } catch {
      setStatus(null);
      setError("Life Compass 상태를 읽지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const entrypoint = status?.entrypoint ?? "/life-compass-site/Life%20Compass.html";
  const snapshotVersion = status?.entry_mtime ? String(status.entry_mtime) : "pending";
  const entrypointUrl = `${entrypoint}${entrypoint.includes("?") ? "&" : "?"}v=${encodeURIComponent(snapshotVersion)}#study`;
  const snapshotLabel = useMemo(() => formatSnapshotTime(status?.entry_mtime ?? null), [status?.entry_mtime]);

  return (
    <main className="flex min-h-[calc(100vh-5rem)] flex-col gap-4 p-4 lg:p-6" data-life-compass-page="true">
      <Card className="border-emerald-400/20 bg-emerald-950/10">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-300">Read-only Life Compass</div>
              <CardTitle className="mt-2 flex items-center gap-2 text-lg">
                <Compass className="h-5 w-5" /> Life Compass
              </CardTitle>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-midground/70">
                NAS 정본을 직접 노출하지 않고, VPS 로컬 스냅샷을 Hermes 대시보드 안에서 읽기 전용으로 표시합니다.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 border border-emerald-300/30 bg-black/20 px-2 py-1 text-emerald-100/80">
                <ShieldCheck className="h-3.5 w-3.5" /> raw HTML API 제외
              </span>
              <span className="border border-current/15 bg-black/20 px-2 py-1 text-midground/70">스냅샷: {snapshotLabel}</span>
              <button type="button" onClick={() => void load()} disabled={loading} className="inline-flex items-center gap-1 rounded-md border border-current/20 px-3 py-2 text-xs font-semibold text-midground/80 hover:text-foreground disabled:opacity-50">
                <RefreshCw className="h-3.5 w-3.5" /> 새로고침
              </button>
              <a className="inline-flex items-center gap-1 rounded-md border border-current/20 px-3 py-2 text-xs font-semibold text-midground/80 hover:text-foreground" href={entrypointUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="h-3.5 w-3.5" /> 새 창
              </a>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-xs text-midground/75 md:grid-cols-4" data-life-compass-status="true">
            <div className="border border-current/10 bg-black/15 p-2"><span className="text-midground/45">상태</span><div className="mt-1 font-semibold text-foreground">{loading ? "확인 중" : status?.available ? "사용 가능" : "확인 필요"}</div></div>
            <div className="border border-current/10 bg-black/15 p-2"><span className="text-midground/45">모드</span><div className="mt-1 font-semibold text-foreground">{status?.safety?.mode ?? "read-only snapshot"}</div></div>
            <div className="border border-current/10 bg-black/15 p-2"><span className="text-midground/45">크기</span><div className="mt-1 font-semibold text-foreground">{status?.entry_size_bytes ? `${Math.round(status.entry_size_bytes / 1024)} KB` : "미확인"}</div></div>
            <div className="border border-current/10 bg-black/15 p-2"><span className="text-midground/45">누락</span><div className="mt-1 font-semibold text-foreground">{status?.missing?.length ? status.missing.join(", ") : "없음"}</div></div>
          </div>
          {error ? <div className="mt-3 border border-red-400/30 bg-red-950/20 p-3 text-sm text-red-100/80">{error}</div> : null}
        </CardContent>
      </Card>

      <section className="min-h-[72vh] flex-1 overflow-hidden rounded-xl border border-current/15 bg-black/20 shadow-2xl" data-life-compass-frame="true">
        {status && !status.available ? (
          <div className="p-6 text-sm text-midground/70">Life Compass 스냅샷을 찾지 못했습니다: {status.missing.join(", ")}</div>
        ) : (
          <iframe
            title="Life Compass"
            src={entrypointUrl}
            className="h-[78vh] w-full bg-white"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-downloads"
            data-life-compass-iframe="true"
          />
        )}
      </section>
    </main>
  );
}
