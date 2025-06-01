import React, { useEffect, useRef, useState } from 'react';
import { Editor, Monaco } from '@monaco-editor/react';
import { io, type Socket } from 'socket.io-client';
import * as monacoEditor from 'monaco-editor';

// Get the server URL from environment or use a default
const SERVER_URL = window.location.hostname;
const SERVER_PORT = '3001';
const SOCKET_URL = `http://${SERVER_URL}:${SERVER_PORT}`;

interface CursorPosition {
  lineNumber: number;
  column: number;
}

// Supported languages configuration
const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'csharp',
  'go',
  'rust',
  'ruby',
  'php',
  'html',
  'css',
  'json',
  'markdown',
  'yaml',
  'sql'
];

// Language-specific configurations
const LANGUAGE_CONFIGS: Record<string, monacoEditor.languages.LanguageConfiguration> = {
  cpp: {
    brackets: [
      ['[', ']'],
      ['(', ')'],
      ['{', '}']
    ] as [string, string][],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: '<', close: '>' }
    ]
  }
};

const CollaborativeEditor: React.FC = () => {
  const socketRef = useRef<Socket | null>(null);
  const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const isUpdatingRef = useRef(false);
  const [connected, setConnected] = useState(false);
  const [editorValue, setEditorValue] = useState('// Loading...');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');

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

  const handleEditorDidMount = (editor: monacoEditor.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    console.log('Editor mounted');

    // Configure editor features
    editor.updateOptions({
      autoIndent: 'advanced',
      autoClosingBrackets: 'always',
      autoClosingQuotes: 'always',
      autoClosingDelete: 'auto',
      autoSurround: 'brackets',
      formatOnPaste: true,
      formatOnType: true,
      lineNumbers: 'on',
      minimap: { enabled: true },
      fontSize: 14,
      wordWrap: 'on',
      automaticLayout: true,
      tabSize: 2,
      scrollBeyondLastLine: false,
      renderWhitespace: 'selection',
      suggestOnTriggerCharacters: true,
      quickSuggestions: {
        other: true,
        comments: true,
        strings: true
      },
      folding: true,
      foldingStrategy: 'indentation',
      matchBrackets: 'always',
      occurrencesHighlight: 'singleFile',
      guides: {
        indentation: true,
        bracketPairs: true,
        highlightActiveIndentation: true,
        highlightActiveBracketPair: true
      },
      snippetSuggestions: 'inline',
      wordBasedSuggestions: 'matchingDocuments',
      parameterHints: {
        enabled: true,
        cycle: true
      },
      suggest: {
        localityBonus: true,
        snippetsPreventQuickSuggestions: false,
        showIcons: true,
        showStatusBar: true,
        preview: true
      }
    });

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

  const handleLanguageChange = (newLanguage: string) => {
    setSelectedLanguage(newLanguage);
    if (editorRef.current && monacoRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        monacoRef.current.editor.setModelLanguage(model, newLanguage);
        
        // Apply language-specific configurations
        if (newLanguage === 'cpp') {
          monacoRef.current.languages.setLanguageConfiguration('cpp', LANGUAGE_CONFIGS.cpp);
        }
      }
    }
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <div style={{ 
        padding: '8px', 
        backgroundColor: '#2d2d2d',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ 
          padding: '4px 8px', 
          backgroundColor: connected ? '#4caf50' : '#f44336',
          borderRadius: '4px'
        }}>
          {connected ? 'Connected to server' : 'Disconnected from server'}
        </div>
        <select
          value={selectedLanguage}
          onChange={(e) => handleLanguageChange(e.target.value)}
          style={{
            padding: '4px 8px',
            backgroundColor: '#3d3d3d',
            color: 'white',
            border: '1px solid #505050',
            borderRadius: '4px'
          }}
        >
          {SUPPORTED_LANGUAGES.map(lang => (
            <option key={lang} value={lang}>
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div style={{ height: 'calc(100% - 40px)' }}>
        <Editor
          height="100%"
          language={selectedLanguage}
          value={editorValue}
          theme="vs-dark"
          onMount={handleEditorDidMount}
          onChange={(value) => {
            if (value !== undefined) {
              setEditorValue(value);
            }
          }}
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
};

export default CollaborativeEditor; 