import { Card, CardContent, CardHeader } from "@/components/ui/layout/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function FilesLoading() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64 bg-slate-700" />
            <Skeleton className="h-4 w-96 bg-slate-700" />
          </div>
          <Skeleton className="h-10 w-40 bg-slate-700" />
        </div>

        {/* Files List Skeleton */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-48 bg-slate-700" />
              <Skeleton className="h-10 w-32 bg-slate-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30">
                  <div className="flex items-center gap-4 flex-1">
                    <Skeleton className="h-10 w-10 rounded bg-slate-700" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-64 bg-slate-700" />
                      <Skeleton className="h-3 w-32 bg-slate-700" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 bg-slate-700" />
                    <Skeleton className="h-8 w-8 bg-slate-700" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
