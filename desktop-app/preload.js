const { contextBridge, ipcRenderer } = require('electron');
const monaco = require('monaco-editor');

// Initialize Monaco Editor features
function initializeMonaco() {
  // Configure editor defaults
  monaco.editor.defineTheme('custom-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#1e1e1e',
    }
  });

  // Set default editor options
  const defaultOptions = {
    automaticLayout: true,
    fontSize: 14,
    lineHeight: 21,
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    roundedSelection: false,
    scrollbar: {
      verticalScrollbarSize: 12,
      horizontalScrollbarSize: 12
    },
    lineNumbers: 'on',
    glyphMargin: true,
    folding: true,
    bracketPairColorization: {
      enabled: true
    },
    guides: {
      bracketPairs: true,
      indentation: true,
      highlightActiveIndentation: true
    },
    cursorBlinking: 'smooth',
    cursorSmoothCaretAnimation: true,
    smoothScrolling: true,
    mouseWheelZoom: true,
    parameterHints: {
      enabled: true,
      cycle: true
    },
    quickSuggestions: {
      other: true,
      comments: true,
      strings: true
    },
    acceptSuggestionOnCommitCharacter: true,
    acceptSuggestionOnEnter: 'on',
    suggestOnTriggerCharacters: true,
    wordBasedSuggestions: true,
    wordBasedSuggestionsOnlySameLanguage: false
  };

  // Set the default options
  monaco.editor.setTheme('custom-dark');
  monaco.editor.EditorOptions = {
    ...monaco.editor.EditorOptions,
    ...defaultOptions
  };

  // Register language features for each supported language
  const languages = [
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

  languages.forEach(language => {
    monaco.languages.register({ id: language });
  });
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    ipcRenderer: {
      send: (channel, data) => {
        ipcRenderer.send(channel, data);
      },
      on: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    monaco: {
      initialize: () => initializeMonaco(),
      editor: monaco.editor
    }
  }
); 