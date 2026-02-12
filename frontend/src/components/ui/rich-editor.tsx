'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link,
  Image,
  Quote,
  Undo2,
  Redo2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

interface ToolbarButton {
  icon: React.ElementType;
  label: string;
  action: () => void;
}

function RichEditor({ value, onChange, placeholder = '', className }: RichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);

  // Sync external value into the editor when it changes from outside
  useEffect(() => {
    if (editorRef.current && !isInternalChange.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
      }
    }
    isInternalChange.current = false;
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      isInternalChange.current = true;
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const execCommand = useCallback((command: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, val);
    handleInput();
  }, [handleInput]);

  const insertLink = useCallback(() => {
    const url = prompt('Entrez l\'URL du lien :');
    if (url) {
      execCommand('createLink', url);
    }
  }, [execCommand]);

  const insertImage = useCallback(() => {
    const url = prompt('Entrez l\'URL de l\'image :');
    if (url) {
      execCommand('insertImage', url);
    }
  }, [execCommand]);

  const buttons: ToolbarButton[] = [
    { icon: Bold, label: 'Gras', action: () => execCommand('bold') },
    { icon: Italic, label: 'Italique', action: () => execCommand('italic') },
    { icon: Underline, label: 'Souligné', action: () => execCommand('underline') },
    { icon: Heading1, label: 'Titre 1', action: () => execCommand('formatBlock', 'h1') },
    { icon: Heading2, label: 'Titre 2', action: () => execCommand('formatBlock', 'h2') },
    { icon: Heading3, label: 'Titre 3', action: () => execCommand('formatBlock', 'h3') },
    { icon: List, label: 'Liste à puces', action: () => execCommand('insertUnorderedList') },
    { icon: ListOrdered, label: 'Liste numérotée', action: () => execCommand('insertOrderedList') },
    { icon: Link, label: 'Lien', action: insertLink },
    { icon: Image, label: 'Image', action: insertImage },
    { icon: Quote, label: 'Citation', action: () => execCommand('formatBlock', 'blockquote') },
    { icon: Undo2, label: 'Annuler', action: () => execCommand('undo') },
    { icon: Redo2, label: 'Rétablir', action: () => execCommand('redo') },
  ];

  const showPlaceholder = !value || value === '<br>';

  return (
    <div className={cn('rounded-md border border-input bg-background', className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b border-input p-2">
        {buttons.map((btn) => (
          <button
            key={btn.label}
            type="button"
            title={btn.label}
            onMouseDown={(e) => {
              e.preventDefault();
              btn.action();
            }}
            className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <btn.icon className="h-4 w-4" />
          </button>
        ))}
      </div>

      {/* Editor area */}
      <div className="relative">
        {showPlaceholder && (
          <div className="pointer-events-none absolute left-3 top-3 text-sm text-muted-foreground">
            {placeholder}
          </div>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          className="min-h-[300px] p-3 text-sm outline-none prose prose-sm max-w-none [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:mb-2 [&_blockquote]:border-l-4 [&_blockquote]:border-muted-foreground [&_blockquote]:pl-4 [&_blockquote]:italic [&_a]:text-primary [&_a]:underline [&_img]:max-w-full [&_img]:rounded-md [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
        />
      </div>
    </div>
  );
}

export { RichEditor };
export type { RichEditorProps };
