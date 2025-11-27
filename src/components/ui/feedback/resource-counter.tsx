import { cn } from "@/lib/utils/utils"

interface ResourceCounterProps {
  current: number
  max: number
  label: string
  className?: string
  showWarning?: boolean
}

export function ResourceCounter({ 
  current, 
  max, 
  label,
  className,
  showWarning = true 
}: ResourceCounterProps) {
  const isUnlimited = max === -1
  const isAtLimit = !isUnlimited && current >= max
  const isNearLimit = !isUnlimited && current >= max * 0.8 // 80% of limit
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn(
        "font-medium",
        isAtLimit ? "text-destructive" : isNearLimit ? "text-orange-500" : "text-foreground"
      )}>
        {current} / {isUnlimited ? "∞" : max}
      </span>
      <span className="text-sm text-muted-foreground">{label}</span>
      {showWarning && isAtLimit && (
        <span className="text-xs text-destructive font-medium">
          (Limit reached)
        </span>
      )}
      {showWarning && !isAtLimit && isNearLimit && (
        <span className="text-xs text-orange-500 font-medium">
          (Near limit)
        </span>
      )}
    </div>
  )
}
