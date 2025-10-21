"use client"

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useState, useEffect } from 'react'

interface CodeBlockProps {
  children: string
  language?: string
  className?: string
}

export function CodeBlock({ children, language, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  // Extract language from className if provided
  const match = /language-(\w+)/.exec(className || '')
  const lang = language || (match ? match[1] : 'text')
  
  // Clean up the code content
  const code = String(children).replace(/\n$/, '')
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  // Show a fallback during SSR or initial render
  if (!isMounted) {
    return (
      <div className="relative group my-6">
        <div className="flex items-center justify-between bg-gray-800 text-gray-300 px-4 py-2 text-sm rounded-t-lg">
          <span className="font-mono text-xs uppercase tracking-wide">
            {lang === 'text' ? 'Code' : lang}
          </span>
        </div>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto">
          <code>{code}</code>
        </pre>
      </div>
    )
  }

  return (
    <div className="relative group my-6">
      <div className="flex items-center justify-between bg-gray-800 text-gray-300 px-4 py-2 text-sm rounded-t-lg">
        <span className="font-mono text-xs uppercase tracking-wide">
          {lang === 'text' ? 'Code' : lang}
        </span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs hover:bg-gray-700 transition-colors"
          title="Copy to clipboard"
        >
          {copied ? (
            <>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={lang}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: '0.5rem',
          borderBottomRightRadius: '0.5rem',
        }}
        showLineNumbers={code.split('\n').length > 10}
        wrapLines={true}
        wrapLongLines={true}
        PreTag="div"
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}