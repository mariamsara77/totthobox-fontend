"use client";

import { useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

type Props = {
  content: string;
  animate?: boolean;
};

function textContent(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textContent).join("");
  if (typeof node === "object" && "props" in node) return textContent(node.props.children);
  return "";
}

function CodeBlock({ children }: { children?: ReactNode }) {
  const [copied, setCopied] = useState(false);
  const source = textContent(children);

  const copy = async () => {
    await navigator.clipboard.writeText(source);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-zinc-400/25">
      <div className="flex items-center justify-end border-b border-zinc-400/25 p-2">
        <button
          type="button"
          onClick={copy}
          className="rounded-xl px-2 py-1 text-xs opacity-50 hover:bg-zinc-400/25 hover:opacity-100"
        >
          {copied ? "কপি হয়েছে" : "কপি"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-relaxed">{children}</pre>
    </div>
  );
}

export default function MarkdownRenderer({ content }: Props) {
  return (
    <div className="max-w-none space-y-2 text-sm leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
          a: ({ children, href }) => (
            <a href={href} className="underline opacity-50 hover:opacity-100">
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l border-zinc-400/25 pl-4 opacity-50">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => <ul className="list-inside list-disc space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-inside list-decimal space-y-1">{children}</ol>,
          p: ({ children }) => <p>{children}</p>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
