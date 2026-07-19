// ui.js — ReactFlow canvas area (Application Shell design)

import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

// Original nodes
import { InputNode }     from './nodes/inputNode';
import { LLMNode }       from './nodes/llmNode';
import { OutputNode }    from './nodes/outputNode';
import { TextNode }      from './nodes/textNode';

// New demo nodes
import { ConditionNode } from './nodes/conditionNode';
import { ApiNode }       from './nodes/apiNode';
import { TransformNode } from './nodes/transformNode';
import { NoteNode }      from './nodes/noteNode';
import { TimerNode }     from './nodes/timerNode';

import 'reactflow/dist/style.css';

const proOptions = { hideAttribution: true };

const nodeTypes = {
  customInput:  InputNode,
  llm:          LLMNode,
  customOutput: OutputNode,
  text:         TextNode,
  condition:    ConditionNode,
  api:          ApiNode,
  transform:    TransformNode,
  note:         NoteNode,
  timer:        TimerNode,
};

const selector = (state) => ({
  nodes:         state.nodes,
  edges:         state.edges,
  getNodeID:     state.getNodeID,
  addNode:       state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect:     state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    nodes, edges,
    getNodeID, addNode,
    onNodesChange, onEdgesChange, onConnect
  } = useStore(selector, shallow);

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    const raw = event?.dataTransfer?.getData('application/reactflow');
    if (!raw) return;

    const { nodeType: type } = JSON.parse(raw);
    if (!type) return;

    const position = reactFlowInstance.project({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });

    const nodeID = getNodeID(type);
    addNode({
      id: nodeID,
      type,
      position,
      data: { id: nodeID, nodeType: type },
    });
  }, [reactFlowInstance]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div
      ref={reactFlowWrapper}
      className="canvas-area"
    >
      {/* Empty canvas hint — only shown when no nodes are present */}
      {nodes.length === 0 && (
        <div className="canvas-empty-hint">
          <div className="hint-card">
            <div className="hint-icon-wrap">
              <span className="hint-icon material-symbols-outlined">hub</span>
            </div>
            <h2>Blank Canvas</h2>
            <p>Drag and drop nodes from the library on the left to start building your AI pipeline.</p>
          </div>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[16, 16]}
        snapToGrid

        defaultEdgeOptions={{
          type: 'default',
          animated: true,
          style: { strokeWidth: 2, stroke: 'rgba(210,187,255,0.6)' }
        }}
        connectionLineStyle={{ stroke: '#d2bbff', strokeWidth: 3, strokeDasharray: '5,5' }}
        minZoom={0.1}
        maxZoom={2}
        fitView
      >
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const colors = {
              customInput:  '#3b82f6',
              customOutput: '#22c55e',
              llm:          '#a855f7',
              text:         '#f59e0b',
              condition:    '#f97316',
              api:          '#06b6d4',
              transform:    '#ec4899',
              note:         '#6b7280',
              timer:        '#14b8a6',
            };
            return colors[node.type] || '#6366f1';
          }}
          maskColor="rgba(124,58,237,0.1)"
        />
      </ReactFlow>
    </div>
  );
};
