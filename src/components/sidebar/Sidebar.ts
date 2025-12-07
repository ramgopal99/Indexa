import { Search } from '../search/Search'
import { Settings } from '../settings/Settings'
import type { Topic } from '../types/Topic'
import { SidebarHeader } from './SidebarHeader'
import { SidebarTabs } from './SidebarTabs'
import type { ViewMode } from './SidebarTabs'
import { SidebarTopicsList } from './SidebarTopicsList'
import './Sidebar.css'

export class Sidebar {
  private sidebar: HTMLElement | null = null
  private topics: Topic[] = []
  private observer: MutationObserver | null = null
  private search: Search
  private settings: Settings
  private viewMode: ViewMode = 'sections'
  private allExpanded: boolean = true

  // Compound components
  private sidebarHeader: SidebarHeader
  private sidebarTabs: SidebarTabs
  private sidebarTopicsList: SidebarTopicsList

  constructor() {
    this.search = new Search((filteredTopics: Topic[], isSearchResult: boolean = false) => {
      this.updateTopicsList(filteredTopics.length > 0 ? filteredTopics : this.topics, isSearchResult)
    })
    this.settings = new Settings()

    // Initialize compound components
    this.sidebarHeader = new SidebarHeader(this.search, this.settings, () => this.hideSidebar())
    this.sidebarTabs = new SidebarTabs(
      (mode) => this.handleViewModeChange(mode),
      () => this.toggleExpandAll()
    )
    this.sidebarTopicsList = new SidebarTopicsList(() => {
      // Re-render topics when custom labels change
      this.updateTopicsList(this.topics, false)
    })

    // Set initial study mode state and listen for changes
    this.sidebarTopicsList.setStudyMode(this.settings.isStudyModeEnabled(), this.topics, this.viewMode)
    this.settings.setStudyModeChangeCallback((enabled) => {
      this.sidebarTopicsList.setStudyMode(enabled, this.topics, this.viewMode)
    })
  }

  public initialize(): void {
    // Create sidebar container
    this.sidebar = document.createElement('div')
    this.sidebar.className = 'side-indexer-sidebar'

    // Add compound components
    const headerElement = this.sidebarHeader.getElement()
    if (headerElement) {
      this.sidebar.appendChild(headerElement)
    }

    const tabsElement = this.sidebarTabs.getElement()
    if (tabsElement) {
      this.sidebar.appendChild(tabsElement)
    }

    // Append search container
    const searchContainer = this.search.getContainer()
    if (searchContainer) {
      this.sidebar.appendChild(searchContainer)
    }

    // Add topics list
    const topicsListElement = this.sidebarTopicsList.getElement()
    if (topicsListElement) {
      this.sidebar.appendChild(topicsListElement)
    }

    // Sidebar is styled via CSS, just append it
    document.body.appendChild(this.sidebar)

    // Initialize expand/collapse button state (items start expanded)
    this.sidebarTabs.updateExpandCollapseButton(this.allExpanded)

    // Initially show the sidebar
    setTimeout(() => {
      if (this.sidebar) {
        this.sidebar.classList.add('sidebar-visible')
        // Register sidebar with settings for theme application
        this.settings.setSidebarElement(this.sidebar)
      }
      document.body.classList.add('sidebar-active')
    }, 1000) // Delay to allow page to load

    // Initial scan for topics
    this.scanForTopics()
  }

  private handleViewModeChange(mode: ViewMode): void {
    this.viewMode = mode
    this.updateTopicsList(this.topics, false)
  }

  public observeChatChanges(): void {
    // Observe changes in the chat container - try multiple selectors for different platforms
    let chatContainer: Element | null = null

    // Check if we're on Claude.ai
    if (window.location.hostname === 'claude.ai') {
      chatContainer = document.querySelector('[data-testid="conversation-main"]') ||
                     document.querySelector('[data-scroller="true"]') ||
                     document.querySelector('.conversation-container') ||
                     document.querySelector('.flex.flex-col.gap-3') ||
                     document.querySelector('.flex.flex-col.items-start') ||
                     document.querySelector('[role="main"]') ||
                     document.body
    } else {
      // ChatGPT selectors
      chatContainer = document.querySelector('[data-testid="conversation-turn"]')?.parentElement ||
                         document.querySelector('.flex.flex-col') ||
                          document.querySelector('[data-testid="conversation-list"]') ||
                          document.querySelector('.conversation-container') ||
                          document.querySelector('#conversation-container') ||
                         document.body
    }

    console.log('Chat container found:', chatContainer ? chatContainer.tagName : 'none', 'on site:', window.location.hostname)

    if (chatContainer) {
      this.observer = new MutationObserver((mutations) => {
        let shouldScan = false
        mutations.forEach(mutation => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            shouldScan = true
          }
        })
        if (shouldScan) {
          console.log('Chat changes detected, scanning for topics...')
        this.scanForTopics()
        }
      })

      this.observer.observe(chatContainer, {
        childList: true,
        subtree: true,
        characterData: false // Only watch for DOM changes, not text changes
      })

      // Initial scan
      setTimeout(() => this.scanForTopics(), 500)
    }
  }

  private scanForTopics(): void {
    console.log('🔍 Scanning for topics on:', window.location.hostname)
    this.topics = []

    // Find conversation turns for chat mode - try multiple selectors for different platforms
    let conversationTurns: NodeListOf<Element> | HTMLElement[]

    if (window.location.hostname === 'claude.ai') {
      // Claude.ai specific selectors - more comprehensive
      // Claude.ai selectors for finding message containers

      // Claude.ai approach: Find message containers first, then extract content
      let messageContainers = document.querySelectorAll('[data-testid*="message"], [data-message-id], .group[data-message-id]')

      if (messageContainers.length === 0) {
        // Try the specific class selectors
        messageContainers = document.querySelectorAll('[class*="font-user-message"], [class*="font-claude-message"], [class*="font-assistant-message"]')
      }

      console.log(`Found ${messageContainers.length} Claude message containers`)

      // Extract actual content elements from containers
      const contentElements = new Set<HTMLElement>()

      messageContainers.forEach(container => {
        // Look for content within the container
        const contentSelectors = [
          '.prose',
          '.whitespace-pre-wrap',
          'p', 'div', 'span'
        ]

        for (const selector of contentSelectors) {
          const elements = container.querySelectorAll(selector)
          elements.forEach(el => {
            const text = el.textContent?.trim()
            if (text && text.length > 10 &&
                !text.includes('Sonnet') &&
                !text.includes('model') &&
                !text.includes('Claude.ai') &&
                !text.includes('Save') &&
                !text.includes('Copy') &&
                !text.includes('Regenerate')) {
              contentElements.add(el as HTMLElement)
            }
          })
        }

        // If no content found within, use the container itself if it has substantial text
        if (container.querySelectorAll('.prose, .whitespace-pre-wrap, p, div, span').length === 0) {
          const containerText = container.textContent?.trim()
          if (containerText && containerText.length > 10 &&
              !containerText.includes('Sonnet') &&
              !containerText.includes('model') &&
              !containerText.includes('Save') &&
              !containerText.includes('Copy')) {
            contentElements.add(container as HTMLElement)
          }
        }
      })

      conversationTurns = Array.from(contentElements)
      console.log(`Extracted ${conversationTurns.length} Claude content elements`)
    } else {
      // ChatGPT selectors
      conversationTurns = document.querySelectorAll('[data-testid="conversation-turn"]')

    // If no conversation-turn elements found, try other common selectors
    if (conversationTurns.length === 0) {
      const alternativeSelectors = [
        '[data-message-author-role]',
        '.message',
        '.conversation-message',
        '[role="message"]',
        '.user-message',
        '.assistant-message',
        '[data-message-role]',
        '.chat-message',
        '.message-wrapper',
        '.conversation-item'
      ]

      for (const selector of alternativeSelectors) {
        conversationTurns = document.querySelectorAll(selector)
        if (conversationTurns.length > 0) {
          console.log(`Found ${conversationTurns.length} conversation elements using selector: ${selector}`)
          break
        }
      }
    } else {
      console.log('Found conversation turns:', conversationTurns.length)
    }
    }

    // Track processed content to avoid duplicates
    const processedContent = new Set<string>()

    conversationTurns.forEach((turn) => {
      let isUser = false
      let isAI = false
      let messageContent = turn.textContent?.trim() || ''

      // Skip if we've already processed this content
      if (processedContent.has(messageContent)) {
        return
      }

      if (window.location.hostname === 'claude.ai') {
        // Claude.ai specific message detection - check parent containers for message type
        let container = turn

        // If this is a content element inside a message container, find the container
        if (!turn.matches('[data-testid*="message"], [data-message-id], [class*="font-user-message"], [class*="font-claude-message"]')) {
          container = turn.closest('[data-testid*="message"], [data-message-id], [class*="font-user-message"], [class*="font-claude-message"]') || turn
        }

        const messageRole = container.getAttribute('data-message-role')
        const isUserMessage = container.getAttribute('data-is-user-message')
        const messageId = container.getAttribute('data-message-id')
        const containerClasses = container.className

        // Primary detection methods for Claude.ai based on container
        if (messageRole === 'user' ||
            isUserMessage === 'true' ||
            containerClasses.includes('font-user-message') ||
            container.matches('[class*="font-user-message"]')) {
          isUser = true
        }

        if (messageRole === 'assistant' ||
            isUserMessage === 'false' ||
            containerClasses.includes('font-claude-message') ||
            containerClasses.includes('font-assistant-message') ||
            container.matches('[class*="font-claude-message"]') ||
            container.matches('[class*="font-assistant-message"]')) {
          isAI = true
        }

        // Secondary detection - check for Claude-specific patterns in content and classes
        if (!isUser && !isAI) {
          const lowerContent = messageContent.toLowerCase()
          const classList = turn.className.toLowerCase()

          // Check class patterns first (more reliable than content)
          if (classList.includes('font-user-message') || classList.includes('user-message')) {
            isUser = true
          } else if (classList.includes('font-claude-message') || classList.includes('font-assistant-message') || classList.includes('claude-message') || classList.includes('assistant-message')) {
            isAI = true
          }
          // Content-based fallback detection - enhanced for Claude.ai
          else if (messageContent && messageContent.length > 10) {
            // Skip headers/metadata
            if (lowerContent.length < 50 &&
                (lowerContent.includes('sonnet') ||
                 lowerContent.includes('claude.ai') ||
                 lowerContent.includes('model') ||
                 lowerContent.includes('save') ||
                 lowerContent.includes('copy') ||
                 lowerContent.includes('regenerate'))) {
              console.log('Skipping likely header/metadata:', messageContent.substring(0, 30) + '...')
            } else {
              // Look for Claude-specific AI response patterns
              if (lowerContent.includes('i\'m claude') ||
                  lowerContent.includes('as claude') ||
                  lowerContent.includes('here\'s') ||
                  lowerContent.includes('i\'ll help') ||
                  lowerContent.includes('i can help') ||
                  lowerContent.includes('let me') ||
                  lowerContent.includes('i\'d be happy to') ||
                  (lowerContent.includes('claude') && lowerContent.length > 100)) {
                isAI = true
              }
              // User message patterns
              else if (lowerContent.includes('you said:') ||
                       lowerContent.includes('you:') ||
                       (lowerContent.length < 500 &&
                        !lowerContent.includes('here\'s') &&
                        !lowerContent.includes('i\'ll') &&
                        !lowerContent.includes('i can'))) {
                isUser = true
              }
            }
          }
        }

        // Debug logging for Claude messages
        if (isUser || isAI) {
          console.log(`Claude message detected - ${isUser ? 'USER' : 'AI'}:`, {
            role: messageRole,
            isUserMessage,
            messageId,
            classes: turn.className,
            preview: messageContent.substring(0, 50) + '...'
          })
        }
      } else {
        // ChatGPT message detection
      if (turn.querySelector('[data-message-author-role="user"]') ||
          turn.querySelector('[data-message-role="user"]') ||
          turn.classList.contains('user') ||
          turn.closest('[data-message-author-role="user"]') ||
          messageContent.includes('You :') ||
          turn.getAttribute('data-message-author-role') === 'user') {
        isUser = true
      }

      if (turn.querySelector('[data-message-author-role="assistant"]') ||
          turn.querySelector('[data-message-role="assistant"]') ||
          turn.classList.contains('assistant') ||
          turn.closest('[data-message-author-role="assistant"]') ||
          messageContent.includes('Assistant:') ||
          messageContent.includes('AI :') ||
          turn.getAttribute('data-message-author-role') === 'assistant') {
        isAI = true
      }

        // ChatGPT content analysis fallback
      if (!isUser && !isAI && messageContent) {
        const lowerContent = messageContent.toLowerCase()
        if (lowerContent.includes('you:') || lowerContent.includes('user:') || lowerContent.includes('human:')) {
          isUser = true
        } else if (lowerContent.includes('assistant:') || lowerContent.includes('ai:') || lowerContent.includes('bot:')) {
          isAI = true
          }
        }
      }
      
      if (isUser || isAI) {
        // Remove common prefixes that indicate the author
        let prefixesToRemove: string[]
        if (window.location.hostname === 'claude.ai') {
          prefixesToRemove = ['You said:', 'You:', 'Claude:', 'Assistant:', 'Human:', 'User:', 'AI:', 'Assistant:', 'Bot:', 'Claude AI:']
        } else {
          prefixesToRemove = ['You:', 'Assistant:', 'User:', 'AI:', 'Human:', 'Assistant:', 'Bot:']
        }

        for (const prefix of prefixesToRemove) {
          if (messageContent.toLowerCase().startsWith(prefix.toLowerCase())) {
            messageContent = messageContent.substring(prefix.length).trim()
            break
          }
        }

        // Create a meaningful preview of the message
        const preview = messageContent.length > 60
          ? messageContent.substring(0, 60) + '...'
          : messageContent || 'Empty message'

        console.log(`Found ${isUser ? 'user' : 'AI'} message:`, preview.substring(0, 30) + '...')

        this.topics.push({
          text: preview,
          level: 1,
          element: turn,
          type: isUser ? 'user' : 'ai'
        })

        // Mark this content as processed to avoid duplicates
        processedContent.add(messageContent)
      }
    })

    // Find conversation containers for sections
    let conversationElements: NodeListOf<Element>
    if (window.location.hostname === 'claude.ai') {
      conversationElements = document.querySelectorAll('[data-message-role], [data-testid="conversation-turn"], .group, .markdown, .message-container, [data-message-id]')
    } else {
      conversationElements = document.querySelectorAll('[data-testid="conversation-turn"], .group, .markdown')
    }

    conversationElements.forEach(container => {
      // Look for all heading levels (H1-H6)
      const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
      headings.forEach(heading => {
        const text = heading.textContent?.trim()
        if (text && text.length > 2 && text.length < 100) {
          const level = parseInt(heading.tagName.charAt(1)) || 1
          this.topics.push({
            text,
            level,
            element: heading
          })
        }
      })
    })

    // Look for markdown-style H1 and H2 headers in the entire document (fallback)
    if (this.topics.length === 0) {
      const allText = document.body.textContent || ''
      const lines = allText.split('\n')

      lines.forEach((line) => {
        const trimmed = line.trim()
        if (trimmed.length > 5 && trimmed.length < 100) {
          // Detect markdown headers for all levels (H1-H6)
          const headerMatch = trimmed.match(/^(#{1,6})\s+(.+)$/)
          if (headerMatch) {
            this.topics.push({
              text: headerMatch[2],
              level: headerMatch[1].length,
              element: document.body // fallback element
            })
          }
        }
      })
    }

    // Remove duplicates and limit
    this.topics = this.topics
      .filter((topic, index, self) =>
        index === self.findIndex(t => t.text === topic.text)
      )
      .slice(0, 25) // Limit to 25 topics

    this.updateTopicsList(this.topics, false)
    this.search.setTopics(this.topics)
  }

  private updateTopicsList(topics: Topic[], isSearchResult: boolean = false): void {
    this.sidebarTopicsList.updateTopicsList(topics, this.viewMode, isSearchResult)
  }


  public showSidebar(): void {
    if (this.sidebar) {
      this.sidebar.classList.add('sidebar-visible')
      document.body.classList.add('sidebar-active')
    }
  }

  public hideSidebar(): void {
    if (this.sidebar) {
      this.sidebar.classList.remove('sidebar-visible')
      document.body.classList.remove('sidebar-active')
    }
  }

  public isSidebarVisible(): boolean {
    return this.sidebar?.classList.contains('sidebar-visible') || false
  }


  // Manual trigger for debugging - can be called from console
  public manualScan(): void {
    console.log('Manual scan triggered')
    this.scanForTopics()
  }

  // Debug function for Claude.ai - can be called from console
  public debugClaude(): void {
    console.log('🔧 Claude.ai Debug Information:')
    console.log('Current hostname:', window.location.hostname)
    console.log('Available selectors:')

    const testSelectors = [
      '[data-message-role]',
      '[data-testid*="message"]',
      '.group[data-message-id]',
      '.font-user-message',
      '.font-claude-message',
      '.font-assistant-message',
      '[class*="font-user-message"]',
      '[class*="font-claude-message"]',
      '[class*="font-assistant-message"]',
      '.prose',
      '.whitespace-pre-wrap',
      '[class*="prose"]',
      '[class*="whitespace-pre-wrap"]',
      '[data-is-user-message]',
      '.message-container',
      'div[role="group"]',
      'div[class*="message"]'
    ]

    testSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector)
      if (elements.length > 0) {
        console.log(`✅ ${selector}: ${elements.length} elements found`)
        // Log first element details
        const first = elements[0] as HTMLElement
        console.log(`   First element:`, {
          tagName: first.tagName,
          className: first.className,
          attributes: Array.from(first.attributes).map(attr => `${attr.name}="${attr.value}"`),
          textPreview: first.textContent?.substring(0, 100) + '...'
        })
      } else {
        console.log(`❌ ${selector}: 0 elements found`)
      }
    })

    console.log('Current topics found:', this.topics.length)
    this.topics.forEach((topic, index) => {
      console.log(`${index + 1}. ${topic.type}: ${topic.text.substring(0, 50)}...`)
    })
  }

  private toggleExpandAll(): void {
    if (this.allExpanded) {
      // Collapse all
      this.sidebarTopicsList.toggleExpandAll(true)
      this.allExpanded = false
      this.sidebarTabs.updateExpandCollapseButton(false)
    } else {
      // Expand all
      this.sidebarTopicsList.toggleExpandAll(false)
      this.allExpanded = true
      this.sidebarTabs.updateExpandCollapseButton(true)
    }
  }
}

