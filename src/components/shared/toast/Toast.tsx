import "./Toast.css"

// interface ToastProps {
//   message: string
//   type: "success" | "error"
// }

const Toast = {
  show: (message: string, type: "success" | "error") => {
    
    const toast = document.createElement("div")
    toast.className = `toast ${type}`

    const content = document.createElement("div")
    content.className = "toast-content"

    const icon = document.createElement("div")
    icon.className = "toast-icon"
    icon.innerHTML =
      type === "success"
        ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>'

    const messageEl = document.createElement("div")
    messageEl.className = "toast-message"
    messageEl.textContent = message

    const progress = document.createElement("div")
    progress.className = "toast-progress"

    content.appendChild(icon)
    content.appendChild(messageEl)
    toast.appendChild(content)
    toast.appendChild(progress)

    const container = document.getElementById("toast-container")
    if (container) {
      container.appendChild(toast)
    } else {
      document.body.appendChild(toast)
    }

    let width = 100
    const interval = setInterval(() => {
      width -= 0.5
      progress.style.width = `${width}%`

      if (width <= 0) {
        clearInterval(interval)
      }
    }, 15)

    setTimeout(() => {
      toast.classList.add("hiding")
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast)
        }
      }, 300)
    }, 3000)
  },
}

export default Toast