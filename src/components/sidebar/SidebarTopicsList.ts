import type { Topic } from '../types/Topic'
import type { ViewMode } from './SidebarTabs'

export class SidebarTopicsList {
  private topicsList: HTMLElement | null = null
  private customLabels: Map<string, string> = new Map()
  private readonly STORAGE_KEY = 'side-indexer-custom-labels'
  private readonly STUDY_STORAGE_KEY = 'side-indexer-study-checked'
  private onLabelsChanged?: () => void
  private isStudyModeEnabled: boolean = false
  private studyCheckedTopics: Set<string> = new Set()

  constructor(onLabelsChanged?: () => void) {
    this.onLabelsChanged = onLabelsChanged
    this.createTopicsList()
    this.loadCustomLabels()
    this.loadStudyCheckedTopics()
  }

  private loadCustomLabels(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        const labels = JSON.parse(stored)
        this.customLabels = new Map(Object.entries(labels))
      }
    } catch (error) {
      console.warn('Failed to load custom labels from localStorage:', error)
    }
  }

  private saveCustomLabels(): void {
    try {
      const labelsObject = Object.fromEntries(this.customLabels)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(labelsObject))
    } catch (error) {
      console.warn('Failed to save custom labels to localStorage:', error)
    }
  }

  private getTopicKey(topic: Topic): string {
    // Create a unique key based on the topic's content and type
    const baseKey = topic.type ? `${topic.type}:${topic.text}` : `section:${topic.text}`
    // Add element position info for uniqueness
    const elementIndex = Array.from(topic.element.parentElement?.children || []).indexOf(topic.element)
    return `${baseKey}:${elementIndex}`
  }

  public setCustomLabel(topic: Topic, customLabel: string): void {
    const key = this.getTopicKey(topic)
    if (customLabel.trim()) {
      this.customLabels.set(key, customLabel.trim())
    } else {
      this.customLabels.delete(key)
    }
    this.saveCustomLabels()
    this.onLabelsChanged?.()
  }

  public getCustomLabel(topic: Topic): string | undefined {
    const key = this.getTopicKey(topic)
    return this.customLabels.get(key)
  }

  // Study Mode Methods
  public setStudyMode(enabled: boolean, topics: Topic[], viewMode: ViewMode): void {
    this.isStudyModeEnabled = enabled
    // Re-render topics to show/hide checkboxes
    this.updateTopicsList(topics, viewMode, false)
  }

  public isTopicChecked(topic: Topic): boolean {
    const key = this.getTopicKey(topic)
    return this.studyCheckedTopics.has(key)
  }

  public toggleTopicChecked(topic: Topic): void {
    const key = this.getTopicKey(topic)
    if (this.studyCheckedTopics.has(key)) {
      this.studyCheckedTopics.delete(key)
    } else {
      this.studyCheckedTopics.add(key)
    }
    this.saveStudyCheckedTopics()
  }

  private loadStudyCheckedTopics(): void {
    try {
      const stored = localStorage.getItem(this.STUDY_STORAGE_KEY)
      if (stored) {
        const checkedTopics = JSON.parse(stored)
        this.studyCheckedTopics = new Set(checkedTopics)
      }
    } catch (error) {
      console.warn('Failed to load study checked topics from localStorage:', error)
    }
  }

  private saveStudyCheckedTopics(): void {
    try {
      const checkedTopicsArray = Array.from(this.studyCheckedTopics)
      localStorage.setItem(this.STUDY_STORAGE_KEY, JSON.stringify(checkedTopicsArray))
    } catch (error) {
      console.warn('Failed to save study checked topics to localStorage:', error)
    }
  }

  private createTopicsList(): void {
    // Create topics list
    this.topicsList = document.createElement('div')
    this.topicsList.className = 'topics-list'
    this.topicsList.id = 'topics-list'
    this.topicsList.innerHTML = '<div class="no-topics">No topics found yet</div>'
  }

  public updateTopicsList(topics: Topic[], viewMode: ViewMode, isSearchResult: boolean = false): void {
    if (!this.topicsList) return

    if (topics.length === 0) {
      this.topicsList.innerHTML = '<div class="no-topics">No topics found yet</div>'
      return
    }

    // Filter topics based on view mode
    const filteredTopics = viewMode === 'chat'
      ? topics.filter(t => t.type === 'user' || t.type === 'ai')
      : topics.filter(t => !t.type)

    console.log('Total topics found:', topics.length)
    console.log('Filtered topics for', viewMode, ':', filteredTopics.length)
    console.log('Chat topics:', topics.filter(t => t.type === 'user' || t.type === 'ai').length)
    console.log('Section topics:', topics.filter(t => !t.type).length)

    // Build hierarchy for filtered topics
    const filteredHasChildren: boolean[] = new Array(filteredTopics.length).fill(false)
    for (let i = 0; i < filteredTopics.length; i++) {
      const currentLevel = filteredTopics[i].level
      for (let j = i + 1; j < filteredTopics.length; j++) {
        if (filteredTopics[j].level <= currentLevel) break
        if (filteredTopics[j].level === currentLevel + 1) {
          filteredHasChildren[i] = true
          break
        }
      }
    }

    this.topicsList.innerHTML = filteredTopics.map((topic, index) => {
      const isParent = filteredHasChildren[index]
      const indent = (topic.level - 1) * 20

      // All items are visible by default (expanded state)
      // Parent items start with expanded icon (ChevronDown) since they're open
      // Only show checkboxes in study mode and sections view (not chat view)
      const showCheckbox = this.isStudyModeEnabled && viewMode === 'sections'
      
      // In study mode + sections view, don't show placeholder for leaf nodes to reduce spacing
      // In chat mode, don't show placeholder either to reduce left gap
      const expandIconHtml = isParent
        ? '<span class="expand-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></span>'
        : (showCheckbox || viewMode === 'chat' ? '' : '<span class="expand-icon-placeholder"></span>')

      // Show "You:" or "AI:" in chat mode, otherwise show H1, H2, etc.
      const labelText = viewMode === 'chat' && topic.type
        ? (topic.type === 'user' ? 'You:' : 'AI:')
        : `H${topic.level}`

      const customLabel = this.getCustomLabel(topic)
      const displayText = topic.highlightedText || customLabel || topic.text
      const isChecked = this.isTopicChecked(topic)
      const checkboxHtml = showCheckbox
        ? `<input type="checkbox" class="study-checkbox" ${isChecked ? 'checked' : ''} data-topic-index="${index}">`
        : ''

      // Adjust indent when checkbox is present to account for checkbox space
      // Only apply spacing when checkboxes are actually shown (study mode + sections view)
      // Checkbox ends at 28px (12px position + 16px width)
      // For parent nodes: checkbox (28px) + minimal gap (1px) = 29px base (arrow starts immediately after)
      // For leaf nodes: checkbox (28px) + gap (8px) = 36px base
      const hasExpandIcon = isParent
      const checkboxGap = showCheckbox
        ? (hasExpandIcon ? 29 : 36) // Minimal gap for parent nodes, proper gap for leaf nodes
        : 0
      const adjustedIndent = showCheckbox ? checkboxGap + indent : indent

      return `
      <div class="topic-item ${isParent ? 'has-children expanded' : ''} ${topic.type || ''} ${isSearchResult ? 'search-result' : ''}" data-index="${index}" data-level="${topic.level}">
        ${checkboxHtml}
        <div class="topic-text" style="padding-left: ${adjustedIndent}px;">
          ${expandIconHtml}
          <span class="heading-label h${topic.level} ${topic.type || ''}">${labelText}</span>
          <span class="topic-content">${displayText}</span>
        </div>
      </div>
    `
    }).join('')

    // Add click handlers
    filteredTopics.forEach((topic, index) => {
      const topicElement = this.topicsList?.querySelector(`[data-index="${index}"]`) as HTMLElement
      if (!topicElement) return

      const expandIcon = topicElement.querySelector('.expand-icon') as HTMLElement
      const isParent = filteredHasChildren[index]

      // Handle expand/collapse click on icon
      if (isParent && expandIcon) {
        expandIcon.addEventListener('click', (e) => {
          e.stopPropagation()
          const isExpanded = topicElement.classList.contains('expanded')

          if (isExpanded) {
            topicElement.classList.remove('expanded')
            expandIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>'
            // Hide all children
            this.hideChildren(index, topic.level)
          } else {
            topicElement.classList.add('expanded')
            expandIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>'
            // Show direct children only
            this.showChildren(index, topic.level)
          }
        })
      }

      // Handle navigation click on topic item
      topicElement.addEventListener('click', (e) => {
        // Don't navigate if clicking on expand icon or checkbox
        if ((e.target as HTMLElement).classList.contains('expand-icon') ||
            (e.target as HTMLElement).classList.contains('study-checkbox')) {
          return
        }
        topic.element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        // Highlight the element temporarily with smooth fade out
        topic.element.classList.add('side-indexer-highlight')
        // Start fade out after 1.5 seconds
        setTimeout(() => {
          topic.element.classList.add('fade-out')
          // Remove highlight completely after fade out transition (0.5s)
          setTimeout(() => {
            topic.element.classList.remove('side-indexer-highlight', 'fade-out')
          }, 500)
        }, 1500)
      })

      // Handle double-click for inline editing
      const topicTextElement = topicElement.querySelector('.topic-text') as HTMLElement
      if (topicTextElement) {
        topicTextElement.addEventListener('dblclick', (e) => {
          e.stopPropagation()
          this.startInlineEditing(topicElement, topic)
        })
      }

      // Handle checkbox changes for study mode (only in sections view)
      if (this.isStudyModeEnabled && viewMode === 'sections') {
        const checkbox = topicElement.querySelector('.study-checkbox') as HTMLInputElement
        if (checkbox) {
          checkbox.addEventListener('change', (e) => {
            e.stopPropagation()
            this.toggleTopicChecked(topic)
          })

          // Prevent checkbox clicks from triggering navigation
          checkbox.addEventListener('click', (e) => {
            e.stopPropagation()
          })
        }
      }
    })
  }

  private hideChildren(parentIndex: number, parentLevel: number): void {
    if (!this.topicsList) return

    const items = this.topicsList.querySelectorAll('.topic-item')
    items.forEach((item, index) => {
      if (index > parentIndex) {
        const level = parseInt((item as HTMLElement).dataset.level || '1')
        if (level > parentLevel) {
          // Just hide the child, preserve its expanded state
          const itemElement = item as HTMLElement
          itemElement.style.display = 'none'
        } else {
          return // Stop when we reach same or higher level
        }
      }
    })
  }

  private showChildren(parentIndex: number, parentLevel: number): void {
    if (!this.topicsList) return

    const items = this.topicsList.querySelectorAll('.topic-item')

    items.forEach((item, index) => {
      if (index > parentIndex) {
        const level = parseInt((item as HTMLElement).dataset.level || '1')
        const itemElement = item as HTMLElement

        if (level <= parentLevel) {
          // Reached same or higher level - stop
          return
        }

        if (level === parentLevel + 1) {
          // Direct child - show it and restore to expanded state if it has children
          itemElement.style.display = ''
          if (itemElement.classList.contains('has-children') && !itemElement.classList.contains('expanded')) {
            itemElement.classList.add('expanded')
            const expandIcon = itemElement.querySelector('.expand-icon')
            if (expandIcon) {
              expandIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>'
            }
          }
        } else if (level > parentLevel + 1) {
          // Nested child - check if all its parents in the chain are expanded
          let shouldShow = true
          let currentLevel = level - 1
          let searchIndex = index - 1

          // Walk backwards to check if all parents are expanded
          while (currentLevel > parentLevel && searchIndex >= 0) {
            const checkItem = items[searchIndex] as HTMLElement
            const checkLevel = parseInt(checkItem.dataset.level || '1')

            if (checkLevel === currentLevel) {
              // Found a parent at this level
              if (!checkItem.classList.contains('expanded')) {
                shouldShow = false
                break
              }
              currentLevel--
            }
            searchIndex--
          }

          if (shouldShow) {
            itemElement.style.display = ''
            // Restore to expanded state if it has children
            if (itemElement.classList.contains('has-children') && !itemElement.classList.contains('expanded')) {
              itemElement.classList.add('expanded')
              const expandIcon = itemElement.querySelector('.expand-icon')
              if (expandIcon) {
                expandIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>'
              }
            }
          } else {
            itemElement.style.display = 'none'
          }
        }
      }
    })
  }

  public toggleExpandAll(allExpanded: boolean): void {
    if (!this.topicsList) return

    const items = Array.from(this.topicsList.querySelectorAll('.topic-item.has-children'))

    if (allExpanded) {
      // Collapse all
      items.forEach((item) => {
        const itemElement = item as HTMLElement
        itemElement.classList.remove('expanded')
        const expandIcon = itemElement.querySelector('.expand-icon') as HTMLElement
        if (expandIcon) {
          expandIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>'
        }
        const level = parseInt(itemElement.dataset.level || '1')
        const itemIndex = parseInt(itemElement.dataset.index || '0')
        this.hideChildren(itemIndex, level)
      })
    } else {
      // Expand all
      items.forEach((item) => {
        const itemElement = item as HTMLElement
        itemElement.classList.add('expanded')
        const expandIcon = itemElement.querySelector('.expand-icon') as HTMLElement
        if (expandIcon) {
          expandIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>'
        }
        const level = parseInt(itemElement.dataset.level || '1')
        const itemIndex = parseInt(itemElement.dataset.index || '0')
        this.showChildren(itemIndex, level)
      })
    }
  }

  private startInlineEditing(topicElement: HTMLElement, originalTopic: Topic): void {
    const topicTextElement = topicElement.querySelector('.topic-text') as HTMLElement
    const textSpan = topicTextElement.querySelector('.topic-content') as HTMLElement

    if (!textSpan) return

    // Get the current display text (custom label or original text)
    const currentText = this.getCustomLabel(originalTopic) || originalTopic.text

    // Make the text span editable
    textSpan.contentEditable = 'true'
    textSpan.style.outline = 'none'
    textSpan.style.border = '1px solid #007acc'
    textSpan.style.borderRadius = '3px'
    textSpan.style.padding = '2px 4px'
    textSpan.style.backgroundColor = 'white'
    textSpan.style.minWidth = '50px'
    textSpan.style.display = 'inline-block'

    // Select all text for easy replacement
    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(textSpan)
    selection?.removeAllRanges()
    selection?.addRange(range)

    // Mark as editing
    topicElement.classList.add('editing')

    // Auto-save on blur (when user clicks away)
    const handleBlur = () => {
      this.saveInlineEdit(textSpan, originalTopic, topicElement)
    }

    // Also save on Enter key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        textSpan.blur()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        // Revert to original text
        textSpan.textContent = currentText
        textSpan.blur()
      }
    }

    textSpan.addEventListener('blur', handleBlur)
    textSpan.addEventListener('keydown', handleKeyDown)

    // Store handlers for cleanup
    const elementWithHandlers = textSpan as HTMLElement & {
      _blurHandler?: () => void
      _keydownHandler?: (e: KeyboardEvent) => void
    }
    elementWithHandlers._blurHandler = handleBlur
    elementWithHandlers._keydownHandler = handleKeyDown

    // Focus the editable element
    textSpan.focus()
  }

  private saveInlineEdit(textSpan: HTMLElement, originalTopic: Topic, topicElement: HTMLElement): void {
    const newText = textSpan.textContent?.trim() || ''

    // Remove editing styles
    textSpan.contentEditable = 'false'
    textSpan.style.outline = ''
    textSpan.style.border = ''
    textSpan.style.borderRadius = ''
    textSpan.style.padding = ''
    textSpan.style.backgroundColor = ''
    textSpan.style.minWidth = ''
    textSpan.style.display = ''

    // Remove editing class
    topicElement.classList.remove('editing')

    // Handle the save logic
    if (newText && newText !== originalTopic.text) {
      // Save custom label
      this.setCustomLabel(originalTopic, newText)
    } else if (!newText) {
      // If blank, revert to original text and remove custom label
      textSpan.textContent = originalTopic.text
      this.setCustomLabel(originalTopic, '')
    } else if (newText === originalTopic.text) {
      // If same as original, remove custom label
      this.setCustomLabel(originalTopic, '')
    }

    // Remove event listeners
    const elementWithHandlers = textSpan as HTMLElement & {
      _blurHandler?: () => void
      _keydownHandler?: (e: KeyboardEvent) => void
    }
    if (elementWithHandlers._blurHandler) {
      textSpan.removeEventListener('blur', elementWithHandlers._blurHandler)
    }
    if (elementWithHandlers._keydownHandler) {
      textSpan.removeEventListener('keydown', elementWithHandlers._keydownHandler)
    }
  }

  public getElement(): HTMLElement | null {
    return this.topicsList
  }
}
