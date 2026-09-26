import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { MermaidDiagram } from "./mermaid-diagram"
import { CodeBlock } from "./code-block"

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground/80 prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:text-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-foreground mb-6 mt-8 first:mt-0 text-balance">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold text-foreground mb-4 mt-12 text-balance scroll-mt-20">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6 text-balance">{children}</h3>
          ),
          p: ({ children }) => <p className="text-foreground/80 leading-relaxed mb-6 text-pretty">{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-foreground/80 mb-6 space-y-2 ml-4">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-foreground/80 mb-6 space-y-2 ml-4">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          code: ({ children, className, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : ''
            const inline = props.inline
            
            // Handle inline code
            if (inline) {
              return (
                <code className="rounded bg-neon/15 px-1.5 py-0.5 font-mono text-[0.85em] text-cyan">{children}</code>
              )
            }
            
            // For block code, return the code element with data attributes
            // The pre component will handle the rendering
            return (
              <code className={className} data-language={language}>
                {children}
              </code>
            )
          },
          pre: ({ children }: any) => {
            // Get the code element from children
            const codeElement = React.Children.toArray(children).find((child: any) => 
              child?.type === 'code' || child?.props?.className?.includes('language-')
            ) as any
            
            if (codeElement) {
              const match = /language-(\w+)/.exec(codeElement.props?.className || '')
              const language = match ? match[1] : codeElement.props?.['data-language'] || ''
              const code = String(codeElement.props?.children || '').replace(/\n$/, '')
              
              // Handle mermaid diagrams
              if (language === 'mermaid') {
                return <MermaidDiagram chart={code} />
              }
              
              // Handle code blocks with syntax highlighting
              if (language) {
                return (
                  <CodeBlock language={language}>
                    {code}
                  </CodeBlock>
                )
              }
            }
            
            // Fallback for regular pre blocks
            return (
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-6 text-foreground">
                {children}
              </pre>
            )
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-cyan/70 bg-cyan/5 py-2 pl-4 pr-3 italic text-foreground/75 mb-6 rounded-r">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
