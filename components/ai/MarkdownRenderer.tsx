"use client";

import { isValidElement, useCallback, useState, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Check, Clipboard, ExternalLink } from "lucide-react";
import AiImageViewer from "./AiImageViewer";
import styles from "./MarkdownRenderer.module.css";

import "highlight.js/styles/github.css";

type Props = {
  content: string;
  /** নতুন AI উত্তরে typewriter-এর মতো stagger animation */
  animate?: boolean;
};

function getTextContent(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getTextContent).join("");
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return getTextContent(node.props.children);
  }

  return "";
}

function getCodeLanguage(node: ReactNode): string {
  if (Array.isArray(node)) {
    for (const child of node) {
      const language = getCodeLanguage(child);
      if (language !== "code") return language;
    }
    return "code";
  }

  if (isValidElement<{ className?: string; children?: ReactNode }>(node)) {
    const languageClass = node.props.className?.split(" ").find((part) => part.startsWith("language-"));
    if (languageClass) return languageClass.slice("language-".length);
    return getCodeLanguage(node.props.children);
  }

  return "code";
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Use the legacy browser fallback below when clipboard permissions are denied.
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
  } catch {
    return false;
  }
}

function CodeBlock({ children }: { children: ReactNode }) {
  const [copied, setCopied] = useState(false);
  const codeText = getTextContent(children);
  const language = getCodeLanguage(children);

  const handleCopy = useCallback(async () => {
    const didCopy = await copyText(codeText);
    if (!didCopy) return;

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }, [codeText]);

  return (
    <div className={styles.codeBlock}>
      <div className={styles.codeToolbar}>
        <span className={styles.codeLanguage}>{language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className={styles.codeCopy}
          aria-label={copied ? "কোড কপি হয়েছে" : "কোড কপি করুন"}
        >
          {copied ? (
            <Check aria-hidden="true" className="h-3.5 w-3.5" />
          ) : (
            <Clipboard aria-hidden="true" className="h-3.5 w-3.5" />
          )}
          <span>{copied ? "কপি হয়েছে" : "কপি"}</span>
        </button>
      </div>
      <pre className={styles.codePre}>{children}</pre>
    </div>
  );
}

const markdownComponents: Components = {
  a: ({ href, children }) => {
    const isExternal = typeof href === "string" && (href.startsWith("https://") || href.startsWith("http://"));

    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      >
        {children}
        {isExternal && (
          <ExternalLink
            aria-hidden="true"
            className="ml-1 inline-block h-3.5 w-3.5 align-[-2px]"
          />
        )}
      </a>
    );
  },
  img: ({ src, alt }) => {
    if (typeof src !== "string" || !src.trim()) return null;

    return (
      <AiImageViewer src={src} alt={alt ?? ""}>
        <img
          src={src}
          alt={alt ?? ""}
          loading="lazy"
          className={styles.markdownImage}
        />
      </AiImageViewer>
    );
  },
  table: ({ children }) => (
    <div className={styles.tableWrap}>
      <table>{children}</table>
    </div>
  ),
  code: ({ children, className }) => {
    const isBlockCode = className?.split(" ").some(
      (part) => part === "hljs" || part.startsWith("language-"),
    );

    return (
      <code
        className={[
          !isBlockCode ? styles.inlineCode : "",
          className ?? "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
};

export default function MarkdownRenderer({ content, animate = false }: Props) {
  return (
    <div className={`${styles.prose} ${animate ? styles.responseNew : ""}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
