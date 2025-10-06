'use client';

import { useEffect, useRef, useState } from 'react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function Editor({ value, onChange, placeholder = '내용을 입력하세요...', minHeight = '400px' }: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isComposing = useRef(false);
  const lastValue = useRef(value);

  // 텍스트 포맷팅 함수들
  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    handleContentChange();
  };

  const handleContentChange = () => {
    if (editorRef.current && !isComposing.current) {
      const newValue = editorRef.current.innerHTML;
      if (newValue !== lastValue.current) {
        lastValue.current = newValue;
        onChange(newValue);
      }
    }
  };

  // 한글 입력 처리를 위한 이벤트
  const handleCompositionStart = () => {
    isComposing.current = true;
  };

  const handleCompositionEnd = () => {
    isComposing.current = false;
    handleContentChange();
  };

  // 이미지 업로드 처리
  const handleImageUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = `<img src="${e.target?.result}" alt="uploaded image" style="max-width: 100%; height: auto;" />`;
      document.execCommand('insertHTML', false, img);
      handleContentChange();
    };
    reader.readAsDataURL(file);
  };

  // 붙여넣기 이벤트 처리
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    handleContentChange();
  };

  // 초기 값 설정 - 컴포넌트 마운트시에만
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
      lastValue.current = value;
    }
  }, []);

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* 툴바 */}
      <div className="bg-gray-50 border-b p-2 flex flex-wrap gap-1">
        <div className="flex items-center gap-1 border-r pr-2 mr-2">
          <button
            type="button"
            onClick={() => formatText('bold')}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="굵게"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h7a4 4 0 014 4 4 4 0 01-4 4H6v8m0-8h8a4 4 0 014 4 4 4 0 01-4 4H6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => formatText('italic')}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="기울임"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4h4l-4 16h-4m8-16h4" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => formatText('underline')}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="밑줄"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v8a5 5 0 0010 0V4M5 20h14" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => formatText('strikeThrough')}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="취소선"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9L7 19m0-10l10 10" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-1 border-r pr-2 mr-2">
          <select
            onChange={(e) => formatText('formatBlock', e.target.value)}
            className="px-2 py-1 border rounded text-sm"
            defaultValue=""
          >
            <option value="" disabled>제목</option>
            <option value="h1">제목 1</option>
            <option value="h2">제목 2</option>
            <option value="h3">제목 3</option>
            <option value="p">본문</option>
          </select>
        </div>

        <div className="flex items-center gap-1 border-r pr-2 mr-2">
          <button
            type="button"
            onClick={() => formatText('justifyLeft')}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="왼쪽 정렬"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => formatText('justifyCenter')}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="가운데 정렬"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M4 18h16" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => formatText('justifyRight')}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="오른쪽 정렬"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M4 18h16" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-1 border-r pr-2 mr-2">
          <button
            type="button"
            onClick={() => formatText('insertUnorderedList')}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="글머리 기호"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => formatText('insertOrderedList')}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="번호 매기기"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-1 border-r pr-2 mr-2">
          <button
            type="button"
            onClick={() => {
              const url = prompt('링크 URL을 입력하세요:');
              if (url) formatText('createLink', url);
            }}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="링크"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="이미지"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
          />
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => formatText('removeFormat')}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="서식 지우기"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* 에디터 영역 */}
      <div
        ref={editorRef}
        contentEditable
        className="p-4 focus:outline-none"
        style={{ minHeight }}
        onInput={handleContentChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onPaste={handlePaste}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          cursor: text;
        }
      `}</style>
    </div>
  );
}