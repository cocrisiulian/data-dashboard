import { Card, CardContent, CardHeader } from "@/components/ui/layout/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PricingLoading() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Skeleton */}
        <div className="text-center space-y-4">
          <Skeleton className="h-14 w-96 mx-auto bg-slate-700" />
          <Skeleton className="h-4 w-[600px] mx-auto bg-slate-700" />
          <Skeleton className="h-4 w-80 mx-auto bg-slate-700" />
        </div>

        {/* Pricing Cards Grid Skeleton */}
        <div className="grid gap-8 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card 
              key={i} 
              className={`bg-slate-800/50 border-slate-700 ${
                i === 2 ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}
            >
              <CardHeader className="text-center space-y-4">
                <Skeleton className="h-8 w-32 mx-auto bg-slate-700" />
                <div className="space-y-2">
                  <Skeleton className="h-12 w-40 mx-auto bg-slate-700" />
                  <Skeleton className="h-4 w-24 mx-auto bg-slate-700" />
                </div>
                <Skeleton className="h-10 w-full bg-slate-700" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5, 6].map((j) => (
                    <div key={j} className="flex items-center gap-3">
                      <Skeleton className="h-5 w-5 rounded-full bg-slate-700" />
                      <Skeleton className="h-4 flex-1 bg-slate-700" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Comparison Skeleton */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <Skeleton className="h-8 w-64 mx-auto bg-slate-700" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="grid grid-cols-4 gap-4 items-center">
                  <Skeleton className="h-4 w-full bg-slate-700 col-span-1" />
                  <Skeleton className="h-6 w-6 mx-auto bg-slate-700" />
                  <Skeleton className="h-6 w-6 mx-auto bg-slate-700" />
                  <Skeleton className="h-6 w-6 mx-auto bg-slate-700" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
