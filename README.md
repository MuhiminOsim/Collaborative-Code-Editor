# Collaborative Code Editor

A real-time collaborative code editor that allows multiple users to edit code simultaneously. The project consists of a web client, desktop application, and server component.

## Features

- Real-time code collaboration
- Syntax highlighting
- Desktop application support
- Multiple user cursors
- Live code synchronization
- Cross-platform compatibility (Web & Desktop)

## Project Structure

```
.
├── client/         # Web client application
├── desktop-app/    # Electron-based desktop application
└── server/         # Backend server
```

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14.0.0 or higher)
- npm or yarn
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/MuhiminOsim/Collaborative-Code-Editor.git
cd Collaborative-Code-Editor
```

2. Install dependencies for each component:

For the web client:
```bash
cd client
npm install
```

For the desktop app:
```bash
cd desktop-app
npm install
```

For the server:
```bash
cd server
npm install
```

## Running the Application

### Start the Server

```bash
cd server
npm start
```

### Start the Web Client

```bash
cd client
npm run dev
```

### Start the Desktop App

```bash
cd desktop-app
npm start
```

## Building the Desktop App

To build the desktop application:

```bash
cd desktop-app
npm run build
```

The built application will be available in the `desktop-app/dist` directory.

## Development

### Web Client
The web client is built with:
- React
- TypeScript
- Vite

### Desktop App
The desktop application is built with:
- Electron
- React
- TypeScript

### Server
The server is built with:
- Node.js
- Express
- Socket.IO

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Muhimin Osim - [GitHub](https://github.com/MuhiminOsim)

Project Link: [https://github.com/MuhiminOsim/Collaborative-Code-Editor](https://github.com/MuhiminOsim/Collaborative-Code-Editor) 