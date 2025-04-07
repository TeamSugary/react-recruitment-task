import type { ReactElement } from "react"
import "../styles/card-skeleton.css"

interface CardSkeletonProps {
   count?: number
}

export default function CardSkeleton({ count = 3 }: CardSkeletonProps): ReactElement {
   return (
      <>
         {Array.from({ length: count }).map((_, index: number) => (
            <div key={index} className="card animate-pulse">
               {/* Title Skeleton */}
               <div className="skeleton-title" />
               {/* Body Text Skeleton */}
               <div className="skeleton-body-container">
                  {
                     // random line from 0 to 2 and finally the last line
                     Array.from({ length: Math.floor(Math.random() * 3) }).map((_, lineIndex: number) => (
                        <div key={lineIndex} className="skeleton-body" />
                     ))
                  }
                  <div className="skeleton-body skeleton-body-last" />
               </div>
               <div className="skeleton-body skeleton-date" />
            </div>
         ))}
      </>
   )
}

