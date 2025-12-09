import { Card, CardContent, CardHeader } from "@/components/ui/layout/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64 bg-slate-700" />
            <Skeleton className="h-4 w-96 bg-slate-700" />
          </div>
          <Skeleton className="h-10 w-32 bg-slate-700" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-24 bg-slate-700" />
                <Skeleton className="h-4 w-4 bg-slate-700" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 bg-slate-700" />
                <Skeleton className="h-3 w-32 bg-slate-700 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs Skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-10 w-full max-w-md bg-slate-700" />
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <Skeleton className="h-6 w-48 bg-slate-700" />
              <Skeleton className="h-4 w-96 bg-slate-700 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 bg-slate-700" />
                <Skeleton className="h-10 w-full bg-slate-700" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 bg-slate-700" />
                <Skeleton className="h-10 w-full bg-slate-700" />
              </div>
              <Skeleton className="h-10 w-full bg-slate-700 mt-4" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
