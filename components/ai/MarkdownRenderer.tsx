"use client";

import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

type Props = {
  content: string;
  /** নতুন AI উত্তরে typewriter-এর মতো stagger animation */
  animate?: boolean;
};

export default function MarkdownRenderer({ content, animate = false }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    // code copy buttons
    rootRef.current.querySelectorAll("pre").forEach((pre) => {
      if (pre.parentElement?.classList.contains("code-block-wrapper")) return;
      const code = pre.querySelector("code");
      if (!code) return;

      const lang =
        [...code.classList]
          .find((c) => c.startsWith("language-"))
          ?.replace("language-", "") || "code";

      const wrapper = document.createElement("div");
      wrapper.className = "code-block-wrapper not-prose my-3 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700";

      const toolbar = document.createElement("div");
      toolbar.className =
        "code-toolbar flex items-center justify-between px-3 py-1.5 bg-zinc-900 text-zinc-400 text-xs";
      toolbar.innerHTML = `
        <span class="uppercase tracking-wider opacity-60">${lang}</span>
        <button type="button" class="code-copy-btn hover:text-white transition px-2 py-0.5 rounded">কপি</button>
      `;
      const btn = toolbar.querySelector("button")!;
      btn.addEventListener("click", () => {
        navigator.clipboard.writeText(code.textContent || "").then(() => {
          btn.textContent = "কপি হয়েছে ✓";
          btn.classList.add("text-emerald-400");
          setTimeout(() => {
            btn.textContent = "কপি";
            btn.classList.remove("text-emerald-400");
          }, 2000);
        });
      });

      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(toolbar);
      wrapper.appendChild(pre);
    });
  }, [content]);

  return (
    <div
      ref={rootRef}
      className={`ai-prose prose prose-sm dark:prose-invert max-w-none
        prose-a:text-emerald-600 prose-pre:bg-zinc-900 prose-pre:p-0
        ${animate ? "ai-response-new" : ""}`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}