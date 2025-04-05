import { addHours, format, parseISO } from "date-fns"


export default function ComplaintCard({ complaint }) {
   return (
      <div key={complaint.Id} className="card">
         <h3 className="text-lg font-semibold">{complaint.Title}</h3>
         <p className="text-body-text/85">{complaint.Body}</p>
         <p className="text-xs text-muted">
            {format(addHours(parseISO(complaint.CreatedAt), 6), "dd MMM yyyy | hh:mm a")}
         </p>
      </div>
   )
}

