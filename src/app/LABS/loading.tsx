import { Card, CardContent, CardHeader } from "@/components/ui/layout/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LabsLoading() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="text-center space-y-4">
          <Skeleton className="h-14 w-96 mx-auto bg-slate-700" />
          <Skeleton className="h-4 w-[600px] mx-auto bg-slate-700" />
        </div>

        {/* Labs Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <Card key={i} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-lg bg-slate-700" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-32 bg-slate-700" />
                    <Skeleton className="h-4 w-full bg-slate-700" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full bg-slate-700" />
                  <Skeleton className="h-4 w-5/6 bg-slate-700" />
                  <Skeleton className="h-4 w-4/6 bg-slate-700" />
                  <div className="flex gap-2 mt-4">
                    <Skeleton className="h-6 w-20 bg-slate-700 rounded-full" />
                    <Skeleton className="h-6 w-16 bg-slate-700 rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
