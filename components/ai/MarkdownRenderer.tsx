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

    // Code copy buttons logic
    const preElements = rootRef.current.querySelectorAll("pre");

    preElements.forEach((pre) => {
      // যদি আগে থেকেই র‍্যাপ করা থাকে, তবে স্কিপ করুন
      if (pre.parentElement?.classList.contains("code-block-wrapper")) return;

      const code = pre.querySelector("code");
      if (!code) return;

      // ক্লাসনম থেকে ল্যাঙ্গুয়েজ বের করা
      const lang =
        [...code.classList]
          .find((c) => c.startsWith("language-"))
          ?.replace("language-", "") || "code";

      // র‍্যাপার তৈরি
      const wrapper = document.createElement("div");
      wrapper.className =
        "code-block-wrapper not-prose my-3 rounded-lg overflow-hidden border border-zinc-400/25 dark:border-zinc-700";

      // টুলবার তৈরি
      const toolbar = document.createElement("div");
      toolbar.className =
        "code-toolbar flex items-center justify-between p-2 text-xs";
      toolbar.innerHTML = `
        <span class="uppercase tracking-wider opacity-60">${lang}</span>
        <button type="button" class="code-copy-btn transition p-2 rounded">কপি</button>
      `;

      // কপি বাটন ইভেন্ট লিসেনার
      const btn = toolbar.querySelector("button");
      if (btn) {
        btn.addEventListener("click", () => {
          // textContent ব্যবহার করলে highlight এর span গুলো বাদ দিয়ে শুধু টেক্সট কপি হবে
          navigator.clipboard.writeText(code.textContent || "").then(() => {
            btn.textContent = "কপি হয়েছে ✓";
            btn.classList.add("");
            setTimeout(() => {
              btn.textContent = "কপি";
              btn.classList.remove("");
            }, 2000);
          });
        });
      }

      // DOM-এ নতুন এলিমেন্টগুলো যুক্ত করা
      if (pre.parentNode) {
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(toolbar);
        wrapper.appendChild(pre);
      }
    });
  }, [content]);

  return (
    <div
      ref={rootRef}
      className={`ai-prose prose prose-sm dark:prose-invert max-w-none
        prose-a: prose-pre:bg-zinc-900 prose-pre:p-0
        ${animate ? "ai-response-new" : ""}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
