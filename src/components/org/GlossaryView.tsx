import { useMemo, useRef, useState } from "react";
import { BookOpen, ImagePlus, Search, Trash2, Upload, X } from "lucide-react";
import {
  glossary,
  glossaryCategories,
  getGlossaryCategory,
  type GlossaryCategory,
  type GlossaryTerm,
} from "@/data/glossary";
import { getDept, getStage } from "@/data/orgStructure";
import { useGlossaryPhotos } from "@/hooks/useGlossaryPhotos";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type OrgView = "location" | "cycle" | "hierarchy" | "staffing" | "hr" | "glossary";

interface Props {
  onSwitchView?: (view: OrgView, deptId?: string) => void;
}

export function GlossaryView({ onSwitchView }: Props) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<GlossaryCategory | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const { photos, setPhoto, removePhoto } = useGlossaryPhotos();

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return glossary.filter((g) => {
      if (cat !== "all" && g.category !== cat) return false;
      if (!ql) return true;
      return (
        g.term.toLowerCase().includes(ql) ||
        g.short.toLowerCase().includes(ql) ||
        g.full.toLowerCase().includes(ql) ||
        (g.synonyms || []).some((s) => s.toLowerCase().includes(ql))
      );
    });
  }, [q, cat]);

  const openTerm = openId ? glossary.find((g) => g.id === openId) || null : null;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-zinc-700">
            <BookOpen className="h-4 w-4 text-amber-600" />
            <span className="font-semibold">Глоссарий терминов</span>
            <span className="text-xs text-zinc-500">
              {filtered.length} из {glossary.length}
            </span>
          </div>
          <div className="relative ml-auto w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Поиск: SLA, SOC, Kubernetes…"
              className="pl-9 bg-white border-zinc-300"
            />
            {q && (
              <button
                onClick={() => setQ("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-zinc-400 hover:text-zinc-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <CatChip active={cat === "all"} onClick={() => setCat("all")}>
            Все
          </CatChip>
          {glossaryCategories.map((c) => (
            <CatChip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
              {c.title}
            </CatChip>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white py-16 text-center text-sm text-zinc-500">
          Ничего не найдено. Попробуйте другой запрос или фильтр.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((g) => (
            <GlossaryCard
              key={g.id}
              term={g}
              photo={photos[g.id]}
              onOpen={() => setOpenId(g.id)}
              onUpload={(file) => setPhoto(g.id, file)}
            />
          ))}
        </div>
      )}

      <GlossaryDialog
        term={openTerm}
        photo={openTerm ? photos[openTerm.id] : undefined}
        onClose={() => setOpenId(null)}
        onUpload={(file) => openTerm && setPhoto(openTerm.id, file)}
        onRemovePhoto={() => openTerm && removePhoto(openTerm.id)}
        onSwitchView={onSwitchView}
      />
    </div>
  );
}

function CatChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs transition ${
        active
          ? "border-amber-500 bg-amber-500 text-white shadow-sm"
          : "border-zinc-300 bg-white text-zinc-700 hover:border-amber-400 hover:text-amber-700"
      }`}
    >
      {children}
    </button>
  );
}

function GlossaryCard({
  term,
  photo,
  onOpen,
  onUpload,
}: {
  term: GlossaryTerm;
  photo?: string;
  onOpen: () => void;
  onUpload: (file: File) => void;
}) {
  const cat = getGlossaryCategory(term.category);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md">
      <button
        onClick={onOpen}
        className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200"
      >
        {photo ? (
          <img
            src={photo}
            alt={term.term}
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-zinc-400">
            <ImagePlus className="h-8 w-8" />
            <span className="text-xs">Фото не загружено</span>
          </div>
        )}
        <span
          className={`absolute left-2 top-2 rounded-full border px-2 py-0.5 text-[10px] font-medium ${cat.color}`}
        >
          {cat.title}
        </span>
      </button>
      <div className="flex flex-1 flex-col p-3">
        <button
          onClick={onOpen}
          className="text-left text-base font-semibold text-zinc-900 hover:text-amber-700"
        >
          {term.term}
        </button>
        <p className="mt-1 line-clamp-2 text-xs text-zinc-600">{term.short}</p>
        <div className="mt-3 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 border-zinc-300 text-xs"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="mr-1 h-3 w-3" />
            {photo ? "Заменить фото" : "Загрузить фото"}
          </Button>
          <button
            onClick={onOpen}
            className="ml-auto text-xs font-medium text-amber-700 hover:text-amber-900"
          >
            Подробнее →
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onUpload(f);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

function GlossaryDialog({
  term,
  photo,
  onClose,
  onUpload,
  onRemovePhoto,
  onSwitchView,
}: {
  term: GlossaryTerm | null;
  photo?: string;
  onClose: () => void;
  onUpload: (file: File) => void;
  onRemovePhoto: () => void;
  onSwitchView?: (view: OrgView, deptId?: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  if (!term) {
    return (
      <Dialog open={false} onOpenChange={(o) => !o && onClose()}>
        <DialogContent />
      </Dialog>
    );
  }
  const cat = getGlossaryCategory(term.category);
  const depts = (term.relatedDeptIds || []).map((id) => getDept(id)).filter(Boolean);
  const stages = (term.relatedStageIds || []).map((id) => getStage(id)).filter(Boolean);

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto bg-white">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${cat.color}`}>
              {cat.title}
            </span>
            {term.units && (
              <span className="rounded-full border border-zinc-300 bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-700">
                Ед. изм.: {term.units}
              </span>
            )}
          </div>
          <DialogTitle className="text-2xl text-zinc-900">{term.term}</DialogTitle>
          {term.synonyms && term.synonyms.length > 0 && (
            <DialogDescription className="text-zinc-600">
              Синонимы: {term.synonyms.join(", ")}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200">
          {photo ? (
            <img src={photo} alt={term.term} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-zinc-400">
              <ImagePlus className="h-10 w-10" />
              <span className="text-sm">Загрузите фото для этого термина</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-zinc-300"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            {photo ? "Заменить фото" : "Загрузить фото"}
          </Button>
          {photo && (
            <Button
              variant="outline"
              size="sm"
              className="border-red-300 text-red-700 hover:bg-red-50"
              onClick={onRemovePhoto}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Удалить фото
            </Button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onUpload(f);
              e.target.value = "";
            }}
          />
        </div>

        <div>
          <div className="mb-1 text-xs uppercase tracking-wider text-zinc-500">Определение</div>
          <p className="text-sm leading-relaxed text-zinc-800">{term.full}</p>
        </div>

        {(depts.length > 0 || stages.length > 0) && (
          <div className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
            <div className="text-xs uppercase tracking-wider text-zinc-500">
              Где встречается в оргструктуре
            </div>
            {stages.length > 0 && (
              <div>
                <div className="mb-1 text-[11px] text-zinc-500">Этапы цикла</div>
                <div className="flex flex-wrap gap-1.5">
                  {stages.map(
                    (s) =>
                      s && (
                        <button
                          key={s.id}
                          onClick={() => onSwitchView?.("cycle")}
                          className="rounded-full border border-yellow-300 bg-yellow-50 px-2 py-0.5 text-[11px] text-yellow-800 hover:bg-yellow-100"
                        >
                          {s.title}
                        </button>
                      ),
                  )}
                </div>
              </div>
            )}
            {depts.length > 0 && (
              <div>
                <div className="mb-1 text-[11px] text-zinc-500">Отделы</div>
                <div className="flex flex-wrap gap-1.5">
                  {depts.map(
                    (d) =>
                      d && (
                        <button
                          key={d.id}
                          onClick={() => onSwitchView?.("location", d.id)}
                          className="rounded-full border border-zinc-300 bg-white px-2 py-0.5 text-[11px] text-zinc-700 hover:border-amber-400 hover:text-amber-700"
                        >
                          {d.name}
                        </button>
                      ),
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          <Badge variant="outline" className="border-zinc-300 bg-white text-zinc-700">
            ID: {term.id}
          </Badge>
        </div>
      </DialogContent>
    </Dialog>
  );
}