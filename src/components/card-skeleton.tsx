import type { ReactElement } from "react"

interface CardSkeletonProps {
   count?: number
}

export default function CardSkeleton({ count = 3 }: CardSkeletonProps): ReactElement {
   return (
      <>
         {Array.from({ length: count }).map((_, index: number) => (
            <div key={index} className="card animate-pulse">
               {/* Title Skeleton */}
               <div className="h-6 w-3/4 rounded bg-muted/30" />
               {/* Body Text Skeleton */}
               <div className="space-y-2">
                  {
                     // random line from 0 to 3 and finally the last line
                     Array.from({ length: Math.floor(Math.random() * 4) }).map((_, lineIndex: number) => (
                        <div key={lineIndex} className="h-4 w-full rounded bg-muted/20" />
                     ))
                  }
                  <div className="h-4 w-5/6 rounded bg-muted/20" />
               </div>
               <div className="h-3 w-1/3 rounded bg-muted/20" />
            </div>
         ))}
      </>
   )
}

