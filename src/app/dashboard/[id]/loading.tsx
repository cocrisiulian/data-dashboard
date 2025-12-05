import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardDetailsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full bg-slate-700" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-10 w-80 bg-slate-700" />
            <Skeleton className="h-4 w-64 bg-slate-700" />
          </div>
          <Skeleton className="h-10 w-32 bg-slate-700" />
        </div>

        {/* Charts Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-48 bg-slate-700" />
                  <Skeleton className="h-8 w-8 bg-slate-700" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full bg-slate-700 rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
