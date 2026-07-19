// llmNode.js — Premium purple glassmorphism LLM node

import { BaseNode } from './baseNode';

export const LLMNode = ({ id, selected }) => (
  <BaseNode
    id={id}
    title="LLM"
    icon="psychology"
    accent="purple"
    selected={selected}
    handles={[
      { id: 'system',   type: 'target', position: 'left',  topPercent: 33, label: 'system' },
      { id: 'prompt',   type: 'target', position: 'left',  topPercent: 66, label: 'prompt' },
      { id: 'response', type: 'source', position: 'right', label: 'response' },
    ]}
  >
    <div style={{ padding: '4px 0', fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>
      This is a LLM
    </div>
  </BaseNode>
);
