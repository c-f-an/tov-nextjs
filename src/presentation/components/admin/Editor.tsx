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

  // 텍스트 포맷팅 함수들 - 개선된 버전
  const formatText = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleContentChange();
  };

  // 링크 추가 함수 - 메타정보 포함
  const insertLink = async () => {
    const url = prompt('링크 URL을 입력하세요:');
    if (!url) return;

    editorRef.current?.focus();

    const selection = window.getSelection();
    const selectedText = selection?.toString() || url;

    // URL에서 호스트명 추출 (안전하게)
    let hostname = url;
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      hostname = urlObj.hostname;
    } catch {
      hostname = url.replace(/^https?:\/\//, '').split('/')[0];
    }

    // 링크 카드 스타일로 삽입 - data 속성으로 타입 지정
    const linkHtml = `<div data-link-card="true" contenteditable="false" style="display: inline-block; margin: 8px 0;">
      <a href="${url.startsWith('http') ? url : `https://${url}`}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; padding: 10px 16px; border: 1px solid #d1d5db; border-radius: 8px; text-decoration: none; color: #2563eb; background-color: #f9fafb; font-size: 14px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
        <span style="display: inline-flex; margin-right: 8px; color: #6b7280;">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
        </span>
        <span style="font-weight: 500;">${selectedText}</span>
        <span style="margin-left: 8px; font-size: 12px; color: #9ca3af; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${hostname}</span>
      </a>
    </div>&nbsp;`;

    document.execCommand('insertHTML', false, linkHtml);
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

  // 키보드 이벤트 처리 - Enter 키로 블록 포맷 적용
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      // Enter 키 기본 동작 유지 (새 줄/블록 생성)
      // formatBlock이 자동으로 적용되도록 함
    }
  };

  // 초기 값 설정 및 외부 value 변경 감지
  useEffect(() => {
    if (editorRef.current && value !== lastValue.current) {
      // 포커스가 없을 때만 업데이트하거나, 에디터가 비어있을 때 업데이트
      const editorIsEmpty = !editorRef.current.innerHTML || editorRef.current.innerHTML === '<br>';
      const editorNotFocused = document.activeElement !== editorRef.current;

      if (editorIsEmpty || editorNotFocused) {
        editorRef.current.innerHTML = value;
        lastValue.current = value;
      }
    }
  }, [value]);

  // contentEditable 설정 강화
  useEffect(() => {
    if (editorRef.current) {
      // 리스트 스타일 적용을 위한 CSS 추가
      editorRef.current.style.cssText += `
        line-height: 1.6;
      `;
      // 초기값이 있으면 설정
      if (value && !editorRef.current.innerHTML) {
        editorRef.current.innerHTML = value;
        lastValue.current = value;
      }
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
            onClick={insertLink}
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
        className="p-4 focus:outline-none prose prose-slate max-w-none"
        style={{ minHeight }}
        onInput={handleContentChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          cursor: text;
        }

        [contenteditable] {
          outline: none;
        }

        [contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
          line-height: 1.2;
        }

        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
          line-height: 1.3;
        }

        [contenteditable] h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.83em 0;
          line-height: 1.4;
        }

        [contenteditable] p {
          margin: 0.5em 0;
          line-height: 1.6;
        }

        [contenteditable] ul {
          list-style-type: disc;
          margin: 1em 0;
          padding-left: 2em;
        }

        [contenteditable] ol {
          list-style-type: decimal;
          margin: 1em 0;
          padding-left: 2em;
        }

        [contenteditable] li {
          margin: 0.5em 0;
          line-height: 1.6;
        }

        [contenteditable] a {
          color: #3b82f6;
          text-decoration: underline;
        }

        [contenteditable] a:hover {
          color: #2563eb;
        }

        [contenteditable] img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          margin: 1em 0;
        }
      `}</style>
    </div>
  );
}