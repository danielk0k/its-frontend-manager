import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';

export default function QuestionViewEditor({
  handleEditorChange,
}: {
  handleEditorChange: (value: string | undefined) => void;
}) {

  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  return (
    <div className="flex h-full items-center justify-center p-6">
      <Editor
        onChange={handleEditorChange}
        defaultLanguage="javascript"
        height="100%"
        width="100%"
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
