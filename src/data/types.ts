export interface Complaint {
    Id: number
    Title: string
    Body: string
    CreatedAt: string
  }
  
  export type FilterOption = "all" | "withContent" | "withoutContent"
  export type SortOption = "newest" | "oldest"
  
  export interface ApiResponse<T> {
    Success: boolean
    Message?: string
    Data: T
  }
  
  