import { useState, useEffect, useRef } from 'react'
import {
  Box,
  Button,
  VStack,
  Heading,
  Text
} from '@chakra-ui/react'
import './Popup.css'

function Popup() {
  const [currentTab, setCurrentTab] = useState<string>('')
  const [isSidebarActive, setIsSidebarActive] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const checkSidebarState = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (tab.id) {
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'getSidebarState' })
        if (response) {
          setIsSidebarActive(response.visible)
        }
      }
    } catch (error) {
      // Content script might not be loaded yet
      console.log('Content script not ready:', error)
    }
  }

  useEffect(() => {
    // Get current tab information
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.title) {
        setCurrentTab(tabs[0].title)
      }
    })

    // Check sidebar state
    // eslint-disable-next-line
    checkSidebarState()

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
    }
  }, [])

  const handleToggleSidebar = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (tab.id) {
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'toggleSidebar' })
        if (response) {
          setIsSidebarActive(response.visible)
        }
      }
    } catch (error) {
      console.error('Error toggling sidebar:', error)
      // If content script isn't ready, try to activate it
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
        if (tab.id) {
          await chrome.tabs.sendMessage(tab.id, { action: 'showSidebar' })
          setIsSidebarActive(true)
        }
      } catch (err) {
        console.error('Error activating sidebar:', err)
      }
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
        <Heading size="sm" mb={1}>Side Indexer</Heading>
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
        <Button
          colorPalette={isSidebarActive ? "red" : "green"}
          w="full"
          onClick={handleToggleSidebar}
          size="sm"
        >
          {isSidebarActive ? 'Hide Sidebar' : 'Show Sidebar'}
        </Button>

      </VStack>
    </Box>
  )
}

export default Popup

