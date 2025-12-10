import { Card, CardContent, CardHeader } from "@/components/ui/layout/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
        <CardHeader className="space-y-4 text-center">
          <Skeleton className="h-10 w-48 mx-auto bg-slate-700" />
          <Skeleton className="h-4 w-64 mx-auto bg-slate-700" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20 bg-slate-700" />
            <Skeleton className="h-10 w-full bg-slate-700" />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20 bg-slate-700" />
            <Skeleton className="h-10 w-full bg-slate-700" />
          </div>

          {/* Submit Button */}
          <Skeleton className="h-10 w-full bg-slate-700" />

          {/* Divider */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-px flex-1 bg-slate-700" />
            <Skeleton className="h-4 w-12 bg-slate-700" />
            <Skeleton className="h-px flex-1 bg-slate-700" />
          </div>

          {/* Register Link */}
          <Skeleton className="h-4 w-64 mx-auto bg-slate-700" />
        </CardContent>
      </Card>
    </div>
  );
}
