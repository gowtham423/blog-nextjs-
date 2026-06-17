'use client';
import { useEffect, useRef } from 'react';

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichEditor({ value, onChange }: RichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const quillRef = useRef<any>(null);

  useEffect(() => {
    if (initialized.current || !editorRef.current) return;
    initialized.current = true;

    const loadQuill = async () => {
      const Quill = (await import('quill')).default;
      
      // Load Quill CSS
      if (!document.querySelector('#quill-css')) {
        const link = document.createElement('link');
        link.id = 'quill-css';
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.snow.min.css';
        document.head.appendChild(link);
      }

      quillRef.current = new Quill(editorRef.current!, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['blockquote', 'code-block'],
            ['link', 'image'],
            [{ align: [] }],
            ['clean'],
          ],
        },
        placeholder: 'Write your blog content here...',
      });

      if (value) {
        quillRef.current.root.innerHTML = value;
      }

      quillRef.current.on('text-change', () => {
        onChange(quillRef.current.root.innerHTML);
      });
    };

    loadQuill();
  }, []);

  return (
    <div>
      <div ref={editorRef} style={{ minHeight: 300 }} />
    </div>
  );
}
