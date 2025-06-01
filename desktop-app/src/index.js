import * as monaco from 'monaco-editor';

// Configure Monaco Editor
monaco.editor.defineTheme('custom-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#1e1e1e',
  }
});

// Configure language features for all supported languages
const languageFeatures = {
  javascript: {
    brackets: [['{','}'], ['[',']'], ['(',')']],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: '`', close: '`' }
    ]
  },
  typescript: {
    brackets: [['{','}'], ['[',']'], ['(',')'], ['<','>']],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: '`', close: '`' },
      { open: '<', close: '>' }
    ]
  },
  python: {
    brackets: [['{','}'], ['[',']'], ['(',')']],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: '"""', close: '"""' },
      { open: "'''", close: "'''" }
    ]
  },
  java: {
    brackets: [['{','}'], ['[',']'], ['(',')'], ['<','>']],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: '<', close: '>' }
    ]
  },
  cpp: {
    brackets: [['{','}'], ['[',']'], ['(',')'], ['<','>']],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: '<', close: '>' }
    ]
  },
  csharp: {
    brackets: [['{','}'], ['[',']'], ['(',')'], ['<','>']],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: '<', close: '>' }
    ]
  },
  go: {
    brackets: [['{','}'], ['[',']'], ['(',')']],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: '`', close: '`' }
    ]
  },
  rust: {
    brackets: [['{','}'], ['[',']'], ['(',')'], ['<','>']],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: '<', close: '>' }
    ]
  },
  ruby: {
    brackets: [['{','}'], ['[',']'], ['(',')']],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: '|', close: '|' }
    ]
  },
  php: {
    brackets: [['{','}'], ['[',']'], ['(',')']],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: '`', close: '`' }
    ]
  },
  html: {
    brackets: [['<','>']],
    autoClosingPairs: [
      { open: '<', close: '>' },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ]
  },
  css: {
    brackets: [['{','}'], ['[',']'], ['(',')']],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ]
  },
  json: {
    brackets: [['{','}'], ['[',']']],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '"', close: '"' }
    ]
  },
  markdown: {
    brackets: [['(',')'], ['[',']']],
    autoClosingPairs: [
      { open: '(', close: ')' },
      { open: '[', close: ']' },
      { open: '`', close: '`' },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ]
  },
  yaml: {
    brackets: [['{','}'], ['[',']']],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ]
  },
  sql: {
    brackets: [['(',')']],
    autoClosingPairs: [
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ]
  }
};

// Register all languages and their configurations
Object.entries(languageFeatures).forEach(([language, config]) => {
  // Register the language
  monaco.languages.register({ id: language });
  
  // Set language configuration
  monaco.languages.setLanguageConfiguration(language, {
    ...config,
    surroundingPairs: config.autoClosingPairs,
    wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
    comments: {
      lineComment: '//',
      blockComment: ['/*', '*/']
    },
    folding: {
      markers: {
        start: new RegExp("^\\s*//\\s*#?region\\b"),
        end: new RegExp("^\\s*//\\s*#?endregion\\b")
      }
    }
  });
});

// Set default editor options
monaco.editor.setTheme('custom-dark');

// Export configured monaco instance
export default monaco; 