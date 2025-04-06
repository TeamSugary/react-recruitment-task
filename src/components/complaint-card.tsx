import { addHours, format, parseISO } from "date-fns"
import { JSX } from "react"
import { Clock } from "lucide-react"
import "../styles/complaint-card.css"

interface Complaint {
   Id: number
   Title: string
   Body: string
   CreatedAt: string
}

interface ComplaintCardProps {
   complaint: Complaint
}

export default function ComplaintCard({ complaint }: ComplaintCardProps): JSX.Element {
   return (
      <div className="card complaint-card">
         <h3 className="card-title">{complaint.Title || 'no data added by user'}</h3>
         <p className="card-body">{complaint.Body || 'no data added by user'}</p>
         <p className="card-date">
            <Clock size={15} />
            {format(addHours(parseISO(complaint.CreatedAt), 6), "hh:mm a | dd MMM yyyy")}
         </p>
         <div className="card-overlay" />
      </div>
   )
}

