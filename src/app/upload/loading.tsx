import { Card, CardContent, CardHeader } from "@/components/ui/layout/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function UploadLoading() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-80 mx-auto bg-slate-700" />
          <Skeleton className="h-4 w-96 mx-auto bg-slate-700" />
        </div>

        {/* Upload Form Skeleton */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <Skeleton className="h-6 w-48 bg-slate-700" />
            <Skeleton className="h-4 w-full bg-slate-700 mt-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-12 bg-slate-700/20">
              <div className="flex flex-col items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full bg-slate-700" />
                <Skeleton className="h-6 w-64 bg-slate-700" />
                <Skeleton className="h-4 w-80 bg-slate-700" />
                <Skeleton className="h-10 w-40 bg-slate-700 mt-2" />
              </div>
            </div>

            {/* Dashboard Name Field */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 bg-slate-700" />
              <Skeleton className="h-10 w-full bg-slate-700" />
            </div>

            {/* Chart Type Selection */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 bg-slate-700" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-24 bg-slate-700 rounded-lg" />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Skeleton className="h-10 w-full bg-slate-700" />
          </CardContent>
        </Card>

        {/* Instructions Card */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <Skeleton className="h-6 w-40 bg-slate-700" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-4 w-full bg-slate-700" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
