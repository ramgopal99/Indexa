import type { Topic } from '../types/Topic'
import './Search.css'

export class Search {
  private searchContainer: HTMLElement | null = null
  private searchInput: HTMLInputElement | null = null
  private isVisible: boolean = false
  private topics: Topic[] = []
  private filteredTopics: Topic[] = []
  private onFilterChange: (topics: Topic[], isSearchResult?: boolean) => void

  constructor(onFilterChange: (topics: Topic[]) => void) {
    this.onFilterChange = onFilterChange
    this.createContainer()
  }

  private createContainer(): void {
    this.searchContainer = document.createElement('div')
    this.searchContainer.className = 'search-container'
    this.searchContainer.id = 'search-container'
    this.searchContainer.style.display = 'none'

    // Create input wrapper to hold input and close button
    const inputWrapper = document.createElement('div')
    inputWrapper.className = 'search-input-wrapper'

    this.searchInput = document.createElement('input')
    this.searchInput.type = 'text'
    this.searchInput.id = 'search-input'
    this.searchInput.className = 'search-input'
    this.searchInput.placeholder = 'Search topics...'

    this.searchInput.addEventListener('input', (e) => {
      this.filterTopics((e.target as HTMLInputElement).value)
    })

    // Create close button with X icon
    const closeButton = document.createElement('button')
    closeButton.className = 'search-close-button'
    closeButton.title = 'Close search'
    closeButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6 6 18"/>
        <path d="m6 6 12 12"/>
      </svg>
    `
    closeButton.addEventListener('click', () => {
      this.toggle()
    })

    inputWrapper.appendChild(this.searchInput)
    inputWrapper.appendChild(closeButton)
    this.searchContainer.appendChild(inputWrapper)
  }

  public getContainer(): HTMLElement | null {
    return this.searchContainer
  }

  public setTopics(topics: Topic[]): void {
    this.topics = topics
  }

  public toggle(): void {
    if (!this.searchContainer) return

    this.isVisible = !this.isVisible

    if (this.isVisible) {
      this.searchContainer.style.display = 'block'
      this.searchInput?.focus()
    } else {
      this.searchContainer.style.display = 'none'
      if (this.searchInput) {
        this.searchInput.value = ''
      }
      this.filteredTopics = []
      // Clear highlighted text when closing search
      const topicsWithoutHighlight = this.topics.map(topic => ({
        ...topic,
        highlightedText: undefined
      }))
      this.onFilterChange(topicsWithoutHighlight, false)
    }
  }

  private filterTopics(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredTopics = []
      // Clear highlighted text when search is cleared
      const topicsWithoutHighlight = this.topics.map(topic => ({
        ...topic,
        highlightedText: undefined
      }))
      this.onFilterChange(topicsWithoutHighlight, false)
      return
    }

    const term = searchTerm.toLowerCase()
    this.filteredTopics = this.topics.filter(topic =>
      topic.text.toLowerCase().includes(term)
    ).map(topic => {
      // Create highlighted version of the text
      const highlightedText = this.highlightText(topic.text, searchTerm)
      return {
        ...topic,
        highlightedText
      }
    })

    this.onFilterChange(this.filteredTopics, true)
  }

  private highlightText(text: string, searchTerm: string): string {
    if (!searchTerm.trim()) return text

    const regex = new RegExp(`(${this.escapeRegExp(searchTerm)})`, 'gi')
    return text.replace(regex, '<span class="search-highlight">$1</span>')
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }
}

