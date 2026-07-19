// textNode.js
// Premium amber glassmorphism text node with auto-resize and dynamic {{ variable }} handles

import { useState, useEffect, useRef } from 'react';
import { BaseNode } from './baseNode';
import { useStore } from '../store';

// Regex: matches {{ validJSVarName }} — must be a valid JS identifier
const VARIABLE_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

/** Extract all unique variable names from a text string */
const parseVariables = (text) => {
  const vars = new Set();
  let match;
  // Re-instantiate the regex each call to reset lastIndex
  const re = new RegExp(VARIABLE_REGEX.source, 'g');
  while ((match = re.exec(text)) !== null) {
    vars.add(match[1]);
  }
  return Array.from(vars);
};

const MIN_WIDTH = 220;

/**
 * Measure the pixel width of a string using an off-screen canvas.
 * Falls back to character estimation if canvas is unavailable.
 */
const measureTextWidth = (text, font = '12px Inter, sans-serif') => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = font;
    return ctx.measureText(text).width;
  } catch {
    return text.length * 7.5; // fallback: ~7.5px per char at 12px
  }
};

/** Evenly space N handles vertically: returns top% for index i out of total N */
const handleTopPercent = (index, total) => {
  if (total === 0) return 50;
  const step = 100 / (total + 1);
  return step * (index + 1);
};

export const TextNode = ({ id, data, selected }) => {
  const [text, setText] = useState(data?.text ?? '{{input}}');
  const [variables, setVariables] = useState(() => parseVariables(data?.text ?? '{{input}}'));
  const [nodeWidth, setNodeWidth] = useState(MIN_WIDTH);
  const [focused, setFocused] = useState(false);

  const textareaRef = useRef(null);

  // ── 1. Parse variables on every text change ────────────────────────────────
  useEffect(() => {
    setVariables(parseVariables(text));
  }, [text]);

  // ── 2. Auto-resize textarea height AND node width on every text change ─────
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;

    // Height: shrink to auto first so scrollHeight reflects true content height
    ta.style.height = 'auto';
    ta.style.height = `${ta.scrollHeight}px`;

    // Width: find the longest line, measure its pixel width
    const lines = text.split('\n');
    const longestLine = lines.reduce((a, b) =>
      a.length >= b.length ? a : b, ''
    );

    // Get the font actually applied to the textarea
    const computedFont = window.getComputedStyle(ta).font || '12px Inter, sans-serif';
    const textPx = measureTextWidth(longestLine, computedFont);

    // Add padding (left+right body padding) + some breathing room
    const newWidth = Math.max(MIN_WIDTH, Math.ceil(textPx) + 64);
    setNodeWidth(newWidth);
  }, [text]);

  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleChange = (e) => {
    setText(e.target.value);
    updateNodeField(id, 'text', e.target.value);
  };

  // Construct dynamic handles array for BaseNode
  const dynamicHandles = variables.map((varName, index) => ({
    id: `var-${varName}`,
    type: 'target',
    position: 'left',
    topPercent: handleTopPercent(index, variables.length),
    label: varName
  }));

  const allHandles = [
    { id: 'output', type: 'source', position: 'right', label: 'output' },
    ...dynamicHandles
  ];

  // Manual focus ring simulation matching BaseNode's focusRing logic
  const focusStyle = focused
    ? { borderColor: 'rgba(255,255,255,0.3)', boxShadow: '0 0 0 3px rgba(245,158,11,0.25)' }
    : {};

  return (
    <BaseNode
      id={id}
      title="Text"
      icon="short_text"
      accent="amber"
      selected={selected}
      width={nodeWidth}
      handles={allHandles}
    >
      <div className="vs-field">
        <span className="vs-label">Text</span>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="vs-input nodrag nowheel"
          style={{ resize: 'none', overflow: 'hidden', minHeight: '38px', ...focusStyle }}
          rows={1}
          spellCheck={false}
        />
        
        {/* Variable pills — shows which handles have been created */}
        {variables.length > 0 && (
          <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {variables.map((v) => (
              <span key={v} style={{
                fontSize: '10px',
                background: 'rgba(245,158,11,0.15)',
                color: '#f59e0b',
                border: '1px solid rgba(245,158,11,0.35)',
                borderRadius: '4px',
                padding: '1px 6px',
                fontWeight: '600',
                letterSpacing: '0.3px',
              }}>
                {`{{ ${v} }}`}
              </span>
            ))}
          </div>
        )}
      </div>
    </BaseNode>
  );
};
