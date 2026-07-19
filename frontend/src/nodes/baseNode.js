// baseNode.js
// Premium glassmorphism base node with hover, selected, and handle-glow states.
// All node types use this as their foundation.

import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

const POSITION_MAP = {
  left:   Position.Left,
  right:  Position.Right,
  top:    Position.Top,
  bottom: Position.Bottom,
};

// Maps accent name → { header gradient, border color, glow, handle CSS class, focus ring }
const ACCENT_MAP = {
  blue: {
    gradient:   'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
    border:     'rgba(59,130,246,0.55)',
    glow:       '0 0 0 1px rgba(59,130,246,0.55), 0 0 28px rgba(59,130,246,0.22)',
    hoverGlow:  '0 0 0 1px rgba(59,130,246,0.7),  0 0 40px rgba(59,130,246,0.3)',
    handleClass:'handle-blue',
    focusRing:  'rgba(59,130,246,0.25)',
  },
  green: {
    gradient:   'linear-gradient(135deg, #15803d 0%, #22c55e 100%)',
    border:     'rgba(34,197,94,0.55)',
    glow:       '0 0 0 1px rgba(34,197,94,0.55), 0 0 28px rgba(34,197,94,0.2)',
    hoverGlow:  '0 0 0 1px rgba(34,197,94,0.7),  0 0 40px rgba(34,197,94,0.28)',
    handleClass:'handle-green',
    focusRing:  'rgba(34,197,94,0.25)',
  },
  purple: {
    gradient:   'linear-gradient(135deg, #7e22ce 0%, #a855f7 100%)',
    border:     'rgba(168,85,247,0.55)',
    glow:       '0 0 0 1px rgba(168,85,247,0.55), 0 0 28px rgba(168,85,247,0.22)',
    hoverGlow:  '0 0 0 1px rgba(168,85,247,0.7),  0 0 40px rgba(168,85,247,0.3)',
    handleClass:'handle-purple',
    focusRing:  'rgba(168,85,247,0.25)',
  },
  amber: {
    gradient:   'linear-gradient(135deg, #b45309 0%, #f59e0b 100%)',
    border:     'rgba(245,158,11,0.55)',
    glow:       '0 0 0 1px rgba(245,158,11,0.55), 0 0 28px rgba(245,158,11,0.2)',
    hoverGlow:  '0 0 0 1px rgba(245,158,11,0.7),  0 0 40px rgba(245,158,11,0.28)',
    handleClass:'handle-amber',
    focusRing:  'rgba(245,158,11,0.25)',
  },
  orange: {
    gradient:   'linear-gradient(135deg, #c2410c 0%, #f97316 100%)',
    border:     'rgba(249,115,22,0.55)',
    glow:       '0 0 0 1px rgba(249,115,22,0.55), 0 0 28px rgba(249,115,22,0.2)',
    hoverGlow:  '0 0 0 1px rgba(249,115,22,0.7),  0 0 40px rgba(249,115,22,0.28)',
    handleClass:'handle-orange',
    focusRing:  'rgba(249,115,22,0.25)',
  },
  cyan: {
    gradient:   'linear-gradient(135deg, #0e7490 0%, #06b6d4 100%)',
    border:     'rgba(6,182,212,0.55)',
    glow:       '0 0 0 1px rgba(6,182,212,0.55), 0 0 28px rgba(6,182,212,0.2)',
    hoverGlow:  '0 0 0 1px rgba(6,182,212,0.7),  0 0 40px rgba(6,182,212,0.28)',
    handleClass:'handle-cyan',
    focusRing:  'rgba(6,182,212,0.25)',
  },
  pink: {
    gradient:   'linear-gradient(135deg, #9d174d 0%, #ec4899 100%)',
    border:     'rgba(236,72,153,0.55)',
    glow:       '0 0 0 1px rgba(236,72,153,0.55), 0 0 28px rgba(236,72,153,0.2)',
    hoverGlow:  '0 0 0 1px rgba(236,72,153,0.7),  0 0 40px rgba(236,72,153,0.28)',
    handleClass:'handle-pink',
    focusRing:  'rgba(236,72,153,0.25)',
  },
  teal: {
    gradient:   'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
    border:     'rgba(20,184,166,0.55)',
    glow:       '0 0 0 1px rgba(20,184,166,0.55), 0 0 28px rgba(20,184,166,0.2)',
    hoverGlow:  '0 0 0 1px rgba(20,184,166,0.7),  0 0 40px rgba(20,184,166,0.28)',
    handleClass:'handle-teal',
    focusRing:  'rgba(20,184,166,0.25)',
  },
  gray: {
    gradient:   'linear-gradient(135deg, #374151 0%, #6b7280 100%)',
    border:     'rgba(107,114,128,0.45)',
    glow:       '0 0 0 1px rgba(107,114,128,0.45), 0 0 20px rgba(107,114,128,0.15)',
    hoverGlow:  '0 0 0 1px rgba(107,114,128,0.6),  0 0 28px rgba(107,114,128,0.2)',
    handleClass:'handle-gray',
    focusRing:  'rgba(107,114,128,0.2)',
  },
};

// ── NodeField ──────────────────────────────────────────────────────────────────
const NodeField = ({ field, value, onChange, accentFocus }) => {
  const [focused, setFocused] = useState(false);

  const focusStyle = focused
    ? { borderColor: 'rgba(255,255,255,0.3)', boxShadow: `0 0 0 3px ${accentFocus}` }
    : {};

  if (field.type === 'select') {
    return (
      <div className="vs-field">
        <span className="vs-label">{field.label}</span>
        <div className="vs-select-wrap">
          <select
            className="vs-select"
            value={value}
            style={focusStyle}
            onChange={(e) => onChange(field.key, e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          >
            {(field.options || []).map((opt) => {
              const v = opt.value ?? opt;
              const l = opt.label ?? opt;
              return <option key={v} value={v}>{l}</option>;
            })}
          </select>
        </div>
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div className="vs-field">
        <span className="vs-label">{field.label}</span>
        <textarea
          className="vs-input"
          value={value}
          rows={3}
          style={{ resize: 'vertical', ...focusStyle }}
          onChange={(e) => onChange(field.key, e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="vs-input nodrag nowheel"
          spellCheck={false}
        />
      </div>
    );
  }

  return (
    <div className="vs-field">
      <span className="vs-label">{field.label}</span>
      <input
        type={field.type || 'text'}
        className="vs-input nodrag"
        value={value}
        style={focusStyle}
        onChange={(e) => onChange(field.key, e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        spellCheck={false}
      />
    </div>
  );
};

// ── BaseNode ───────────────────────────────────────────────────────────────────
/**
 * Props:
 *   id        {string}
 *   title     {string}
 *   icon      {string}    Material Symbol ligature name
 *   accent    {string}    Key from ACCENT_MAP (default 'purple')
 *   fields    {Array}     Field config objects
 *   handles   {Array}     Handle config objects { id, type, position, topPercent?, label? }
 *   width     {number}    px (default 230)
 *   selected  {boolean}   Passed by ReactFlow
 *   children  {node}      Extra content below fields
 */
export const BaseNode = ({
  id,
  title,
  icon = 'widgets',
  accent = 'purple',
  fields = [],
  handles = [],
  width = 230,
  selected,
  children,
}) => {
  const [hovered, setHovered] = useState(false);
  const a = ACCENT_MAP[accent] || ACCENT_MAP.purple;

  // Build initial state from field defaults
  const [fieldValues, setFieldValues] = useState(() =>
    fields.reduce((acc, f) => ({ ...acc, [f.key]: f.defaultValue ?? '' }), {})
  );

  const handleChange = (key, val) =>
    setFieldValues((prev) => ({ ...prev, [key]: val }));

  // Compose box-shadow based on state priority: selected > hover > default
  const boxShadow = selected
    ? `${a.hoverGlow}, 0 8px 32px rgba(0,0,0,0.5)`
    : hovered
    ? `${a.hoverGlow}, 0 8px 32px rgba(0,0,0,0.45)`
    : `0 4px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)`;

  const borderColor = selected
    ? a.border
    : hovered
    ? a.border
    : 'rgba(255,255,255,0.07)';

  return (
    <div
      className="vs-node"
      style={{
        width: `${width}px`,
        borderColor,
        boxShadow,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Header ── */}
      <div
        className="vs-node-header"
        style={{ background: a.gradient, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span className="vs-node-icon material-symbols-outlined">{icon}</span>
          <span className="vs-node-title">{title}</span>
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation(); // prevent selecting the node when clicking delete
            useStore.getState().removeNode(id);
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.5)',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.target.style.color = '#fff'; e.target.style.background = 'rgba(255,255,255,0.1)'; }}
          onMouseLeave={(e) => { e.target.style.color = 'rgba(255,255,255,0.5)'; e.target.style.background = 'transparent'; }}
          title="Delete Node"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
        </button>
      </div>

      {/* ── Body ── */}
      <div className="vs-node-body">
        {fields.map((field) => (
          <NodeField
            key={field.key}
            field={field}
            value={fieldValues[field.key]}
            onChange={handleChange}
            accentFocus={a.focusRing}
          />
        ))}
        {children}
      </div>

      {/* ── Handles ── */}
      {handles.map((h) => (
        <Handle
          key={h.id}
          type={h.type}
          position={POSITION_MAP[h.position] ?? Position.Left}
          id={`${id}-${h.id}`}
          className={a.handleClass}
          style={
            h.topPercent !== undefined
              ? { top: `${h.topPercent}%` }
              : {}
          }
          title={h.label || h.id}
        />
      ))}
    </div>
  );
};
