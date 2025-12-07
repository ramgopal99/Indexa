import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Box,
  Button,
  VStack,
  Heading,
  Text
} from '@chakra-ui/react'
import './Popup.css'
import { tabs, scripting } from '../../lib/browser-api'

// URLs where the content script should be active
const SUPPORTED_URLS = [
  'https://chat.openai.com',
  'https://chatgpt.com',
  'https://claude.ai'
]

function isSupportedUrl(url: string | undefined): boolean {
  if (!url) return false
  return SUPPORTED_URLS.some(supported => url.startsWith(supported))
}

function Popup() {
  const [currentTab, setCurrentTab] = useState<string>('')
  const [isSidebarActive, setIsSidebarActive] = useState(false)
  const [isSupportedPage, setIsSupportedPage] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const injectContentScript = useCallback(async (tabId: number) => {
    try {
      if (scripting && scripting.executeScript) {
        await scripting.executeScript({
          target: { tabId },
          files: ['content.js']
        })
        console.log('Content script injected successfully')
        // Wait longer for Firefox - it may need more time to initialize
        await new Promise(resolve => setTimeout(resolve, 300))
      } else {
        console.error('Scripting API not available')
      }
    } catch (error) {
      console.error('Error injecting content script:', error)
      throw error
    }
  }, [])

  const checkSidebarState = useCallback(async () => {
    try {
      const [tab] = await tabs.query({ active: true, currentWindow: true })
      if (tab.id && tab.url) {
        const supported = isSupportedUrl(tab.url)
        setIsSupportedPage(supported)
        
        if (supported) {
          try {
            const response = await tabs.sendMessage(tab.id, { action: 'getSidebarState' })
            if (response) {
              setIsSidebarActive(response.visible)
            }
          } catch (error) {
            // Content script might not be loaded yet, try to inject it
            console.log('Content script not ready, attempting to inject...', error)
            await injectContentScript(tab.id)
            // Try again after injection
            try {
              const response = await tabs.sendMessage(tab.id, { action: 'getSidebarState' })
              if (response) {
                setIsSidebarActive(response.visible)
              }
            } catch (err) {
              console.log('Still unable to communicate with content script:', err)
            }
          }
        }
      }
    } catch (error) {
      console.log('Error checking sidebar state:', error)
    }
  }, [injectContentScript])

  useEffect(() => {
    // Get current tab information
    tabs.query({ active: true, currentWindow: true }, (tabArray) => {
      if (tabArray[0]?.title) {
        setCurrentTab(tabArray[0].title)
      }
      if (tabArray[0]?.url) {
        setIsSupportedPage(isSupportedUrl(tabArray[0].url))
      }
    })

    // Check sidebar state asynchronously
    // Defer to avoid synchronous setState in effect
    const timeoutId = setTimeout(() => {
      checkSidebarState()
    }, 0)

    // Load theme from localStorage and apply to popup container
    const applyTheme = () => {
      const savedTheme = localStorage.getItem('side-indexer-theme') as 'light' | 'dark' | null
      const currentTheme = savedTheme || 'light'
      
      // Apply theme class to popup container using ref
      if (containerRef.current) {
        if (currentTheme === 'dark') {
          containerRef.current.classList.add('dark')
        } else {
          containerRef.current.classList.remove('dark')
        }
      }
      
      // Also apply to document body for global theme
      if (currentTheme === 'dark') {
        document.body.classList.add('dark')
      } else {
        document.body.classList.remove('dark')
      }
    }
    
    applyTheme()

    // Listen for theme changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'side-indexer-theme') {
        applyTheme()
      }
    }
    
    // Also check periodically in case localStorage changes from another context
    const intervalId = setInterval(() => {
      applyTheme()
    }, 100)
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(intervalId)
      clearTimeout(timeoutId)
    }
  }, [checkSidebarState])

  const handleToggleSidebar = async () => {
    try {
      const [tab] = await tabs.query({ active: true, currentWindow: true })
      
      if (!tab.id || !tab.url) {
        console.error('No active tab found')
        return
      }

      // Check if page is supported
      if (!isSupportedUrl(tab.url)) {
        console.log('Current page is not supported. Please navigate to ChatGPT or Claude.')
        return
      }

      // Try to send message
      try {
        const response = await tabs.sendMessage(tab.id, { action: 'toggleSidebar' })
        if (response) {
          setIsSidebarActive(response.visible)
        }
      } catch (error) {
        // Content script might not be loaded, try to inject it
        console.log('Content script not ready, injecting...', error)
        try {
          await injectContentScript(tab.id)
          
          // Try again after injection (wait time is handled in injectContentScript)
          const response = await tabs.sendMessage(tab.id, { action: 'toggleSidebar' })
          if (response) {
            setIsSidebarActive(response.visible)
          } else {
            // If no response, assume it worked and show sidebar
            setIsSidebarActive(true)
          }
        } catch (err) {
          console.error('Error toggling sidebar after injection:', err)
          // Even if injection fails, try to show sidebar as fallback
          try {
            await tabs.sendMessage(tab.id, { action: 'showSidebar' })
            setIsSidebarActive(true)
          } catch (finalErr) {
            console.error('Final attempt to show sidebar failed:', finalErr)
          }
        }
      }
    } catch (error) {
      console.error('Error toggling sidebar:', error)
    }
  }


  return (
    <Box 
      ref={containerRef}
      w="280px" 
      minH="200px" 
      maxH="400px"
      className="popup-container"
      style={{
        backgroundColor: 'var(--popup-bg)',
        color: 'var(--popup-text)',
        minHeight: '200px',
        maxHeight: '400px',
        width: '280px'
      }}
    >
      {/* Header */}
      <Box
        className="popup-header"
        color="white"
        p={3}
        textAlign="center"
        borderBottomRadius="lg"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <Heading size="sm" mb={1}>Indexa</Heading>
        <Text
          fontSize="xs"
          opacity={0.9}
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          maxW="250px"
        >
          {currentTab}
        </Text>
      </Box>

      {/* Main Content */}
      <VStack gap={3} p={3}>
        {!isSupportedPage ? (
          <Box textAlign="center" p={2}>
            <Text fontSize="sm" color="gray.500" mb={2}>
              This extension works on:
            </Text>
            <VStack gap={1} align="stretch">
              <Text fontSize="xs">• chatgpt.com</Text>
              <Text fontSize="xs">• claude.ai</Text>
            </VStack>
            <Text fontSize="xs" color="gray.400" mt={2}>
              Please navigate to one of these pages to use Indexa.
            </Text>
          </Box>
        ) : (
          <Button
            colorPalette={isSidebarActive ? "red" : "green"}
            w="full"
            onClick={handleToggleSidebar}
            size="sm"
          >
            {isSidebarActive ? 'Hide Sidebar' : 'Show Sidebar'}
          </Button>
        )}
      </VStack>
    </Box>
  )
}

export default Popup

