import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Typography } from "antd";

const { Text, Paragraph } = Typography;

const MarkdownComponents: Partial<Components> = {
  p: ({ children }) => <Paragraph>{children}</Paragraph>,
  strong: ({ children }) => <Text strong>{children}</Text>,
  em: ({ children }) => <Text italic>{children}</Text>,
  code: ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter
        style={tomorrow}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <Text code>{children}</Text>
    );
  },
  ul: ({ children }) => (
    <ul style={{ listStyleType: "disc", paddingLeft: 20 }}>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol style={{ listStyleType: "decimal", paddingLeft: 20 }}>{children}</ol>
  ),
  blockquote: ({ children }) => (
    <blockquote
      style={{
        borderLeft: "4px solid #ddd",
        paddingLeft: 16,
        margin: "16px 0",
        color: "rgba(0, 0, 0, 0.85)",
      }}
    >
      {children}
    </blockquote>
  ),
};

export const Markdown = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
      {children}
    </ReactMarkdown>
  );
};
