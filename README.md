# Collaborative Code Editor

A real-time collaborative code editor that enables multiple users to work on code simultaneously. This project consists of a desktop application built with Electron and a web client interface.

## Project Structure

```
collaborative-editor/
├── client/           # Web client application (React + TypeScript + Vite)
├── desktop-app/      # Electron-based desktop application
└── docs/            # Additional documentation
```

## Components

### Desktop Application

The desktop application is an Electron-based collaborative code editor. For detailed information about the desktop app, including build and installation instructions, see the [desktop-app README](desktop-app/README.md).

**Current Build Status:** Development build available for macOS. Please note that this is currently an unsigned development build and will trigger security warnings on macOS. See the desktop-app README for detailed instructions on handling security warnings.

### Web Client

The web client is built with React, TypeScript, and Vite. For more information about the web client, see the [client README](client/README.md).

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/collaborative-editor.git
cd collaborative-editor
```

2. Choose your preferred interface:
   - For desktop application: Follow instructions in [desktop-app/README.md](desktop-app/README.md)
   - For web client: Follow instructions in [client/README.md](client/README.md)

## Development Status

- ✅ Basic real-time collaboration
- ✅ Desktop application (macOS development build)
- ✅ Web client interface
- 🚧 Code signing and notarization (in progress)
- 🚧 Windows and Linux support (planned)

## Known Issues

### macOS Security Warnings

The current development build will trigger security warnings on macOS due to being unsigned. This is a known issue that we're actively working on. For now, users can:

1. Right-click the app and select "Open" to bypass the warning
2. Go to System Preferences > Security & Privacy to allow the app to run

We're working on implementing proper code signing and notarization for future releases.

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Contact

For questions, suggestions, or issues, please open an issue in the GitHub repository. 
