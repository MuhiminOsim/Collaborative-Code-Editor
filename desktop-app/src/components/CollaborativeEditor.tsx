import { useEffect, useRef, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { io, Socket } from 'socket.io-client';
import { editor } from 'monaco-editor';

// Get the server URL from environment or use a default
const SERVER_URL = import.meta.env.VITE_SERVER_URL || window.location.hostname;
const SERVER_PORT = import.meta.env.VITE_SERVER_PORT || '3001';
const SOCKET_URL = `http://${SERVER_URL}:${SERVER_PORT}`;

interface CursorPosition {
  lineNumber: number;
  column: number;
}

const CollaborativeEditor = () => {
  const socketRef = useRef<Socket | null>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const isUpdatingRef = useRef(false);
  const [connected, setConnected] = useState(false);
  const [editorValue, setEditorValue] = useState('// Loading...');

  useEffect(() => {
    // Initialize socket connection
    console.log('Connecting to server:', SOCKET_URL);
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setConnected(false);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    // Handle initial code
    socketRef.current.on('initial-code', (code: string) => {
      console.log('Received initial code:', code);
      setEditorValue(code);
      if (editorRef.current) {
        isUpdatingRef.current = true;
        editorRef.current.setValue(code);
        isUpdatingRef.current = false;
      }
    });

    // Handle code updates from other clients
    socketRef.current.on('code-update', (newCode: string) => {
      console.log('Received code update:', newCode);
      setEditorValue(newCode);
      if (editorRef.current && !isUpdatingRef.current) {
        isUpdatingRef.current = true;
        const position = editorRef.current.getPosition();
        editorRef.current.setValue(newCode);
        if (position) {
          editorRef.current.setPosition(position);
        }
        isUpdatingRef.current = false;
      }
    });

    // Handle cursor updates from other clients
    socketRef.current.on('cursor-update', (data: { userId: string; position: CursorPosition }) => {
      console.log('Cursor update received:', data);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    console.log('Editor mounted');

    // Set initial value if available
    if (editorValue !== '// Loading...') {
      editor.setValue(editorValue);
    }

    editor.onDidChangeModelContent(() => {
      if (!isUpdatingRef.current && socketRef.current?.connected) {
        const code = editor.getValue();
        console.log('Sending code change:', code);
        socketRef.current.emit('code-change', code);
      }
    });

    editor.onDidChangeCursorPosition((e) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit('cursor-position', {
          lineNumber: e.position.lineNumber,
          column: e.position.column
        });
      }
    });
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <div style={{ 
        padding: '8px', 
        backgroundColor: connected ? '#4caf50' : '#f44336',
        color: 'white',
        textAlign: 'center' 
      }}>
        {connected ? 'Connected to server' : 'Disconnected from server'}
      </div>
      <div style={{ height: 'calc(100% - 40px)' }}>
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={editorValue}
          theme="vs-dark"
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
          }}
          onChange={(value) => {
            if (value !== undefined) {
              setEditorValue(value);
            }
          }}
        />
      </div>
    </div>
  );
};

export default CollaborativeEditor; 