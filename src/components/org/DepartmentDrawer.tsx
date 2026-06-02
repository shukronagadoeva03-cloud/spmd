import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitFork, MapPin, Workflow, Users } from "lucide-react";
import { getDept, getLocation, getStage } from "@/data/orgStructure";

type OrgView = "location" | "cycle" | "hierarchy" | "staffing";

interface Props {
  deptId: string | null;
  onClose: () => void;
  view: OrgView;
  onSwitchView: (view: OrgView) => void;
}

export function DepartmentDrawer({ deptId, onClose, view, onSwitchView }: Props) {
  const dept = deptId ? getDept(deptId) : null;
  const open = !!dept;
  if (!dept) {
    return (
      <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
        <SheetContent />
      </Sheet>
    );
  }
  const loc = getLocation(dept.locationId);
  const stage = dept.cycleStageId ? getStage(dept.cycleStageId) : null;
  const total = dept.positions.reduce((s, p) => s + p.count, 0);

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto bg-white text-zinc-900 border-zinc-200">
        <SheetHeader className="space-y-3">
          <SheetTitle className="text-zinc-900 text-xl leading-tight">{dept.name}</SheetTitle>
          <SheetDescription className="text-zinc-600">{dept.description}</SheetDescription>
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge variant="outline" className={`${loc.badge} gap-1`}>
              <MapPin className="h-3 w-3" /> {loc.title}
            </Badge>
            {stage && (
              <Badge
                variant="outline"
                className="border-yellow-500/40 bg-yellow-500/10 text-yellow-800 gap-1"
              >
                <Workflow className="h-3 w-3" /> Этап: {stage.title}
              </Badge>
            )}
            <Badge variant="outline" className="border-zinc-300 bg-zinc-100 text-zinc-700 gap-1">
              <Users className="h-3 w-3" /> {total} чел.
            </Badge>
          </div>
        </SheetHeader>

        <div className="px-4 pb-6 mt-2">
          <div className="text-xs uppercase tracking-wider text-zinc-500 mb-2">
            Штатные должности
          </div>
          <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-zinc-50/60">
            {dept.positions.map((p, i) => (
              <li key={i} className="flex items-start justify-between gap-3 px-3 py-2 text-sm">
                <span className="text-zinc-800">{p.title}</span>
                <span className="shrink-0 rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                  ×{p.count}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4">
            <div className="text-xs uppercase tracking-wider text-zinc-500 mb-2">
              Физическое размещение
            </div>
            <p className="text-sm text-zinc-700">{loc.physical}</p>
          </div>

          <div className="mt-5 grid gap-2">
            {view !== "location" && (
              <Button
                variant="outline"
                className="w-full border-zinc-300 bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                onClick={() => onSwitchView("location")}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Показать во вкладке «По локациям»
              </Button>
            )}
            {view !== "cycle" && (
              <Button
                variant="outline"
                className="w-full border-zinc-300 bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                onClick={() => onSwitchView("cycle")}
              >
                <Workflow className="mr-2 h-4 w-4" />
                Показать во вкладке «По производственному циклу»
              </Button>
            )}
            {view !== "hierarchy" && (
              <Button
                variant="outline"
                className="w-full border-zinc-300 bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                onClick={() => onSwitchView("hierarchy")}
              >
                <GitFork className="mr-2 h-4 w-4" />
                Показать во вкладке «По иерархии»
              </Button>
            )}
            {view !== "staffing" && (
              <Button
                variant="outline"
                className="w-full border-zinc-300 bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                onClick={() => onSwitchView("staffing")}
              >
                <GitFork className="mr-2 h-4 w-4" />
                Показать в «Штатном расписании»
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
