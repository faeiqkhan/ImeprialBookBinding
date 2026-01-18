// Utility function to safely parse dates
export const formatDate = (dateString: string | number | undefined | null): string => {
  if (!dateString) return '—'
  
  try {
    let date: Date
    
    // If it's a number, treat as timestamp
    if (typeof dateString === 'number') {
      date = new Date(dateString)
    } else if (typeof dateString === 'string') {
      // Try parsing as ISO string first
      date = new Date(dateString)
      
      // If invalid, try other formats
      if (isNaN(date.getTime())) {
        // Try parsing date in "YYYY-MM-DD" format
        const parts = dateString.split('-')
        if (parts.length === 3) {
          date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))
        } else {
          return '—'
        }
      }
    } else {
      return '—'
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '—'
    }
    
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  } catch (err) {
    console.error('Date parsing error:', err, dateString)
    return '—'
  }
}
