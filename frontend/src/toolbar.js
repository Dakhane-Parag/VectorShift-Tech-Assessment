// toolbar.js — Left Sidebar with styled node library chips
// Design: Stitch "Application Shell" glassmorphism sidebar

import { useState } from 'react';
import { DraggableNode } from './draggableNode';

// Node definitions: type (ReactFlow), label, Material Symbol icon, CSS chip class
const NODES = [
  { type: 'customInput',  label: 'Input',     icon: 'login',          chipClass: 'chip-input'     },
  { type: 'llm',          label: 'LLM',       icon: 'psychology',     chipClass: 'chip-llm'       },
  { type: 'customOutput', label: 'Output',    icon: 'logout',         chipClass: 'chip-output'    },
  { type: 'text',         label: 'Text',      icon: 'short_text',     chipClass: 'chip-text'      },
  { type: 'condition',    label: 'Condition', icon: 'alt_route',      chipClass: 'chip-condition' },
  { type: 'api',          label: 'API',       icon: 'api',            chipClass: 'chip-api'       },
  { type: 'transform',    label: 'Transform', icon: 'auto_fix_high',  chipClass: 'chip-transform' },
  { type: 'note',         label: 'Note',      icon: 'sticky_note_2',  chipClass: 'chip-note'      },
  { type: 'timer',        label: 'Timer',     icon: 'schedule',       chipClass: 'chip-timer'     },
];

export const PipelineToolbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <nav className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* ── Brand ── */}
      <div className="sidebar-brand">
        <div className="brand-text">
          <h1>VectorShift</h1>
        </div>
        <button 
          className="sidebar-toggle" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <span className="material-symbols-outlined">
            {isCollapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>
      </div>

      {/* ── Node Library ── */}
      <div className="node-library">
        <div className="sidebar-section-label">Node Library</div>
        <div className="node-chips-grid">
          {NODES.map(({ type, label, icon, chipClass }) => (
            <DraggableNode
              key={type}
              type={type}
              label={label}
              icon={icon}
              chipClass={chipClass}
            />
          ))}
        </div>
      </div>
    </nav>
  );
};
