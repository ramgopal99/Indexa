export interface Topic {
  text: string
  level: number
  element: Element
  type?: 'user' | 'ai' // For chat mode
  highlightedText?: string // For search highlighting
  customLabel?: string // User-defined custom label for better organization
  studyChecked?: boolean // Study mode: whether this topic is checked/completed
}

