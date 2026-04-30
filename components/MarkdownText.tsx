import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

type MarkdownTextProps = {
  children: string;
};

/**
 * Lightweight Markdown renderer for React Native.
 * Handles: bold, italic, inline code, code blocks, headings, lists, blockquotes.
 * Zero external dependencies — pure RN components.
 */
export function MarkdownText({ children }: MarkdownTextProps) {
  const blocks = parseBlocks(children);
  return (
    <View style={styles.container}>
      {blocks.map((block, i) => (
        <View key={i} style={blockStyle(block.type)}>
          {block.type === 'code_block' ? (
            <Text style={styles.codeBlockText}>{block.content}</Text>
          ) : block.type === 'blockquote' ? (
            <View style={styles.blockquoteInner}>
              {renderInline(block.content)}
            </View>
          ) : block.type.startsWith('heading') ? (
            <Text style={headingStyle(block.type)}>{block.content}</Text>
          ) : (
            renderInline(block.content)
          )}
        </View>
      ))}
    </View>
  );
}

type BlockType = 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'code_block' | 'blockquote' | 'bullet' | 'ordered';

type Block = {
  type: BlockType;
  content: string;
  index?: number;
};

function parseBlocks(text: string): Block[] {
  const lines = text.split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block (```)
    if (line.startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'code_block', content: codeLines.join('\n') });
      i++;
      continue;
    }

    // Headings
    if (line.startsWith('### ')) {
      blocks.push({ type: 'heading3', content: line.slice(4) });
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      blocks.push({ type: 'heading2', content: line.slice(3) });
      i++;
      continue;
    }
    if (line.startsWith('# ')) {
      blocks.push({ type: 'heading1', content: line.slice(2) });
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      blocks.push({ type: 'blockquote', content: quoteLines.join('\n') });
      continue;
    }

    // Bullet list
    if (line.match(/^[-*] /)) {
      blocks.push({ type: 'bullet', content: line.replace(/^[-*] /, '') });
      i++;
      continue;
    }

    // Ordered list
    if (line.match(/^\d+\. /)) {
      const idx = parseInt(line, 10);
      blocks.push({ type: 'ordered', content: line.replace(/^\d+\. /, ''), index: idx });
      i++;
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Paragraph — collect consecutive non-special lines
    const paraLines: string[] = [];
    while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('#') && !lines[i].startsWith('```') && !lines[i].startsWith('> ') && !lines[i].match(/^[-*] /) && !lines[i].match(/^\d+\. /)) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ type: 'paragraph', content: paraLines.join('\n') });
    }
  }

  return blocks;
}

function renderInline(text: string) {
  const parts = splitInline(text);
  return (
    <Text style={styles.paragraphText}>
      {parts.map((part, i) => {
        if (part.type === 'bold') return <Text key={i} style={styles.bold}>{part.text}</Text>;
        if (part.type === 'italic') return <Text key={i} style={styles.italic}>{part.text}</Text>;
        if (part.type === 'code') return <Text key={i} style={styles.inlineCode}>{part.text}</Text>;
        return <Text key={i}>{part.text}</Text>;
      })}
    </Text>
  );
}

type InlinePart = { type: 'text' | 'bold' | 'italic' | 'code'; text: string };

function splitInline(text: string): InlinePart[] {
  const parts: InlinePart[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    // Inline code
    const codeMatch = remaining.match(/^(.*?)`([^`]+)`/);
    // Bold
    const boldMatch = remaining.match(/^(.*?)\*\*([^*]+)\*\*/);
    // Italic
    const italicMatch = remaining.match(/^(?!\*\*)_(.+?)_|^(?!\*\*)\*([^*]+)\*/);

    let firstMatch: { idx: number; end: number; type: 'bold' | 'italic' | 'code'; text: string } | null = null;

    function updateFirst(candidate: { idx: number; end: number; type: 'bold' | 'italic' | 'code'; text: string }) {
      if (firstMatch === null || candidate.idx < firstMatch.idx) {
        firstMatch = candidate;
      }
    }

    if (codeMatch && codeMatch[1] !== undefined) {
      const idx = codeMatch[1].length;
      updateFirst({ idx, end: idx + codeMatch[2].length + 2, type: 'code', text: codeMatch[2] });
    }
    if (boldMatch && boldMatch[1] !== undefined) {
      const idx = boldMatch[1].length;
      updateFirst({ idx, end: idx + boldMatch[2].length + 4, type: 'bold', text: boldMatch[2] });
    }
    if (italicMatch) {
      const itText = italicMatch[1] || italicMatch[2] || '';
      const prefix = italicMatch[0].match(/^(.*?)[_*]/);
      const idx = prefix ? prefix[1].length : 0;
      updateFirst({ idx, end: idx + itText.length + (italicMatch[0].length - (prefix ? prefix[1].length : 0)), type: 'italic', text: itText });
    }

    if (!firstMatch) {
      parts.push({ type: 'text', text: remaining });
      break;
    }

    const m = firstMatch as { idx: number; end: number; type: 'bold' | 'italic' | 'code'; text: string };
    if (m.idx > 0) {
      parts.push({ type: 'text', text: remaining.slice(0, m.idx) });
    }
    parts.push({ type: m.type, text: m.text });
    remaining = remaining.slice(m.end);
  }

  return parts;
}

function blockStyle(type: BlockType) {
  switch (type) {
    case 'bullet': return styles.bulletItem;
    case 'ordered': return styles.orderedItem;
    default: return undefined;
  }
}

function headingStyle(type: string) {
  switch (type) {
    case 'heading1': return styles.heading1;
    case 'heading2': return styles.heading2;
    case 'heading3': return styles.heading3;
    default: return styles.paragraphText;
  }
}

const styles = StyleSheet.create({
  container: { gap: 2 },
  paragraphText: { fontSize: 14, color: colors.textPrimary, lineHeight: 22 },
  heading1: { fontSize: 18, fontWeight: 'bold', color: colors.primary, lineHeight: 26 },
  heading2: { fontSize: 16, fontWeight: 'bold', color: colors.primary, lineHeight: 24 },
  heading3: { fontSize: 15, fontWeight: 'bold', color: colors.primary, lineHeight: 22 },
  bold: { fontWeight: 'bold' },
  italic: { fontStyle: 'italic' },
  inlineCode: { backgroundColor: colors.cardBg, color: colors.primary, fontFamily: 'monospace', fontSize: 13, paddingHorizontal: 3, borderRadius: 3 },
  codeBlockText: { fontFamily: 'monospace', fontSize: 12, color: colors.textPrimary, lineHeight: 18 },
  bulletItem: { flexDirection: 'row', paddingLeft: 8 },
  orderedItem: { flexDirection: 'row', paddingLeft: 8 },
  blockquoteInner: { borderLeftWidth: 3, borderLeftColor: colors.primary, paddingLeft: 10, opacity: 0.85 },
});
