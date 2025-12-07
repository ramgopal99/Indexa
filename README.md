# 🎯 Indexa - Smart AI Chat Indexer

<div align="center">

![Indexa Logo](https://img.shields.io/badge/Indexa-Smart_AI_Indexer-blue?style=for-the-badge&logo=chrome&logoColor=white)
![Version](https://img.shields.io/badge/version-1.0.0-green?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![Chrome](https://img.shields.io/badge/chrome-%3E%3D88-orange?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)

**Transform long AI conversations into navigable knowledge bases**

[🚀 Install](#-installation) • [📖 Documentation](#-usage) • [🤝 Contributing](#-contributing) • [💡 Ideas](#-roadmap--future-ideas)

</div>

---

## ✨ What is Indexa?

Indexa is a smart Chrome extension that **automatically indexes and organizes** your AI chat conversations (ChatGPT, Claude, and more). No more scrolling through endless conversations to find that one important code snippet or explanation!

### 🎯 Key Features

- **🚀 Auto-Detection**: Automatically activates on AI chat platforms
- **📊 Smart Indexing**: Extracts headings, code blocks, and key topics in real-time
- **🎨 Beautiful Sidebar**: Clean, minimal interface that doesn't interfere with your chat
- **⚡ Instant Navigation**: Click any topic to jump directly to it
- **💾 Local Storage**: Your data stays private on your device
- **🔧 Developer-Friendly**: Open source and extensible

### 📸 Screenshots

<div align="center">

| Before | After |
|--------|-------|
| ![Before](https://via.placeholder.com/300x200/333333/FFFFFF?text=Long+Chat) | ![After](https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Indexed+Chat) |

*Indexa transforms chaotic conversations into organized knowledge*

</div>

## 🚀 Installation

### For Users (Ready to Use)

1. **Download the Extension**
   - Visit the [Chrome Web Store](#) *(Coming Soon)*
   - Or build from source (see Developer Setup below)

2. **Install in Chrome**
   - Open `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right)
   - Click "Load unpacked" and select the `dist` folder

3. **Start Using**
   - Visit [ChatGPT](https://chat.openai.com) or [Claude](https://claude.ai)
   - The Indexa sidebar appears automatically ✨
   - Start chatting and watch topics appear in real-time!

### For Developers (Contribute & Customize)

```bash
# Clone the repository
git clone https://github.com/yourusername/indexa.git
cd indexa

# Install dependencies
npm install

# Build for development
npm run build:dev

# Load in Chrome
# Go to chrome://extensions/ → Load unpacked → select dist/
```

> **💡 Pro Tip**: Use `npm run watch` for auto-rebuilding during development!

## 🛠️ Development

### 🚀 Quick Start for Contributors

```bash
# Fork & clone the repository
git clone https://github.com/yourusername/indexa.git
cd indexa

# Install dependencies
npm install

# Start development mode
npm run dev:watch

# Load extension in Chrome
# chrome://extensions/ → Load unpacked → select dist/
```

### 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run build:dev` | Build for development (includes localhost) |
| `npm run watch` | Auto-rebuild on file changes |
| `npm run dev:watch` | Full development workflow |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint and fix issues |
| `npm run test` | Run test suite |

### 🔄 Development Workflow

1. **🏗️ Setup**: Install dependencies and build initial version
2. **⚡ Develop**: Make changes in `src/` with auto-reload
3. **🔄 Test**: Reload extension and test on AI platforms
4. **✅ Commit**: Follow conventional commit format
5. **🚀 PR**: Submit your contribution!

### 📁 Project Structure

```
indexa/
├── 📁 public/
│   ├── manifest.json          # Production manifest
│   ├── manifest.dev.json      # Development manifest
│   └── vite.svg              # Extension icon
├── 📁 src/
│   ├── content.ts            # 🎯 Main indexing logic
│   ├── content.css           # 🎨 Sidebar styles
│   ├── components/           # ⚛️ React components
│   │   ├── popup/           # Extension popup
│   │   └── sidebar/         # Injected sidebar
│   ├── lib/                 # 🛠️ Utilities & helpers
│   └── assets/              # 📸 Static assets
├── 📁 scripts/              # 🔧 Development tools
├── 📁 dist/                 # 📦 Built extension
└── 📄 *.config.*            # ⚙️ Configuration files
```

### 🐛 Debugging & Testing

#### Local Testing (Without AI Platforms)
```bash
# Open test page
npm run serve:test
# Visit: http://localhost:8080/test-chatgpt.html
```

#### Extension Debugging
- **Browser Console**: F12 → Console (main page errors)
- **Extension Console**: Extension icon → Right-click → Inspect
- **Background Page**: `chrome://extensions/` → Details → Background page

#### Testing on Real Platforms
1. Visit ChatGPT/Claude
2. Open DevTools (F12)
3. Check Console for Indexa logs
4. Use `console.log('Indexa:', data)` for debugging


## 📖 Usage

### 🎯 Automatic Mode (Recommended)

Indexa works **completely automatically** - just start chatting!

1. **Visit AI Platforms**: Open ChatGPT, Claude, or supported platforms
2. **Watch Magic Happen**: Indexa detects the page and shows a sidebar automatically
3. **Real-time Indexing**: Topics appear as you chat - headings, code blocks, key concepts
4. **Navigate Effortlessly**: Click any topic to jump directly to it in the conversation

### 🔧 Manual Mode (Legacy)

For advanced users who want more control:

1. Click the Indexa icon in your Chrome toolbar
2. Use the popup interface to manually index specific content
3. Customize indexing rules and preferences

### 🎨 Interface Overview

- **📍 Sidebar**: Appears on the right side of AI chat pages
- **🏷️ Topics**: Automatically extracted headings and key phrases
- **💻 Code Blocks**: Syntax-highlighted code snippets
- **🔍 Search**: Quick search through indexed content
- **⚙️ Settings**: Customize appearance and behavior

### 🌟 Supported Platforms

- ✅ ChatGPT (chat.openai.com, chatgpt.com)
- ✅ Claude (claude.ai)
- 🔄 More AI platforms coming soon!

## 🔒 Permissions & Privacy

Indexa respects your privacy and requires minimal permissions:

| Permission | Why We Need It | Data Usage |
|------------|----------------|------------|
| `activeTab` | Detect AI chat pages | No data collected |
| `storage` | Save your indexing preferences | Stored locally only |
| `scripting` | Inject sidebar into chat pages | Temporary DOM manipulation |

**🔐 Your data never leaves your device.** All processing happens locally in your browser.

## ⚙️ How It Works

1. **🎯 Smart Detection**: Automatically identifies AI chat platforms
2. **👁️ Real-time Monitoring**: Watches for new messages using MutationObserver
3. **🧠 Intelligent Parsing**: Extracts headings, code blocks, and key concepts
4. **🎨 Sidebar Creation**: Injects a beautiful, non-intrusive interface
5. **⚡ Instant Navigation**: Smooth scrolling and highlighting when you click topics

## 🗺️ Roadmap & Future Ideas

### 🎯 Phase 1: Core Features (Current)
- ✅ Auto-detection on AI platforms
- ✅ Real-time topic indexing
- ✅ Beautiful sidebar interface
- ✅ Cross-platform compatibility

### 🚀 Phase 2: Enhanced Features (Next 3 Months)
- 🔄 **Multi-Platform Support**
  - Anthropic Claude
  - Google Gemini
  - Microsoft Copilot
  - Perplexity AI

- 🎨 **Advanced UI/UX**
  - Dark/light theme toggle
  - Customizable sidebar position
  - Keyboard shortcuts
  - Collapsible sections

- 🧠 **Smart Features**
  - AI-powered topic summarization
  - Code syntax highlighting
  - Export conversations to Markdown
  - Search within indexed content

### 🌟 Phase 3: Power User Features (6+ Months)
- 📱 **Mobile Support**
  - iOS Safari extension
  - Android Chrome extension

- 🔗 **Integration Features**
  - Export to Notion/Obsidian
  - Sync across devices
  - Team collaboration features
  - API for third-party apps

- 🤖 **AI Enhancements**
  - Custom topic detection models
  - Multi-language support
  - Voice-to-text indexing
  - Image/diagram recognition

### 💡 Community Ideas Wanted!

Have a great idea? We'd love to hear it! Some concepts we're considering:

- **🔍 Advanced Search**: Fuzzy search, filters, tags
- **📊 Analytics**: Conversation insights and statistics
- **🎯 Custom Rules**: User-defined indexing patterns
- **🔄 Auto-Sync**: Backup indexed data to cloud
- **🎨 Themes**: Custom color schemes and layouts
- **🌐 Multi-Language**: Support for non-English conversations

### 🗳️ Vote on Features

Check out our [GitHub Discussions](https://github.com/yourusername/indexa/discussions) to:
- 💬 Discuss new ideas
- 🗳️ Vote on upcoming features
- 🤝 Connect with other contributors

---

## 🏗️ Architecture

### Core Components
- **🎯 Content Script** (`src/content.ts`) - Auto ChatGPT/Claude integration
- **🎨 Sidebar UI** (`src/components/sidebar/`) - Injected interface
- **⚙️ Popup** (`src/components/popup/`) - Manual controls
- **🔧 Background Service** - Manifest-based automation
- **💾 Storage** - Local data persistence

### Tech Stack
- ⚛️ **React 19** - Modern UI framework
- 📘 **TypeScript** - Type safety and DX
- ⚡ **Vite** - Fast build tool
- 🎯 **Chrome Extension APIs** - Native browser integration
- 👁️ **MutationObserver** - Real-time DOM monitoring

## 🤝 Contributing

We ❤️ contributions! Indexa is an open-source project built by the community, for the community.

### 🚀 Ways to Contribute

- **🐛 Bug Reports**: Found a bug? [Open an issue](https://github.com/yourusername/indexa/issues)
- **💡 Feature Requests**: Have an idea? [Start a discussion](https://github.com/yourusername/indexa/discussions)
- **🔧 Code Contributions**: Fix bugs or add features
- **📚 Documentation**: Improve docs or add examples
- **🎨 Design**: Help with UI/UX improvements
- **🌍 Translation**: Help localize the extension

### 📝 How to Contribute Code

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/yourusername/indexa.git`
3. **Create** a feature branch: `git checkout -b feature/amazing-feature`
4. **Install** dependencies: `npm install`
5. **Make** your changes following our [coding standards](#-coding-standards)
6. **Test** thoroughly on multiple AI platforms
7. **Commit** with conventional format: `git commit -m "feat: add amazing feature"`
8. **Push** to your branch: `git push origin feature/amazing-feature`
9. **Open** a Pull Request!

### 🎯 Development Guidelines

#### Code Quality
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Ensure cross-browser compatibility

#### Commit Convention
```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
Examples:
- feat: add Claude.ai support
- fix: resolve sidebar positioning bug
- docs: update installation guide
```

#### Pull Request Process
1. **Self-review** your code before submitting
2. **Test** on Chrome, Firefox, and Edge
3. **Update** documentation if needed
4. **Add** screenshots for UI changes
5. **Request review** from maintainers

### 🏆 Recognition

Contributors get:
- 📜 Credit in CHANGELOG.md
- 🏅 Special mention in releases
- 🎖️ "Contributor" badge on GitHub
- 💝 Eternal gratitude from the community!

### 📞 Getting Help

- 💬 **Discussions**: For questions and ideas
- 🐛 **Issues**: For bugs and feature requests
- 📧 **Discord**: Join our community chat *(Coming Soon)*

## 🌟 Community & Support

### 📊 Project Stats
![GitHub stars](https://img.shields.io/github/stars/yourusername/indexa?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/indexa?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/indexa?style=social)

### 💬 Connect With Us

- **🐛 Issues**: [Report bugs](https://github.com/yourusername/indexa/issues)
- **💡 Ideas**: [Feature requests](https://github.com/yourusername/indexa/discussions)
- **🤝 Discussions**: [Community chat](https://github.com/yourusername/indexa/discussions)
- **📧 Email**: [Contact maintainers](mailto:hello@indexa.dev)

### 🎉 Recent Contributors

<a href="https://github.com/yourusername/indexa/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=yourusername/indexa" />
</a>

### 📈 Support the Project

If Indexa helps you be more productive, consider:

- ⭐ **Star** the repository
- 🐛 **Report** bugs you find
- 🚀 **Contribute** code or documentation
- 📣 **Share** Indexa with your friends

### 📋 Troubleshooting

**Extension not working?** Check our [troubleshooting guide](docs/troubleshooting.md)

**Need help?** Join our [GitHub Discussions](https://github.com/yourusername/indexa/discussions)

---

## 📄 License

**Indexa** is open source software licensed under the **MIT License**.

```
Copyright (c) 2024 Indexa Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

See the full [LICENSE](LICENSE) file for complete details.

---

<div align="center">

**Made with ❤️ by the Indexa community**

[⬆️ Back to Top](#-indexa---smart-ai-chat-indexer)

</div>
