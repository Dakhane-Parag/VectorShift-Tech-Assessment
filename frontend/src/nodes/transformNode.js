// transformNode.js
// Premium pink glassmorphism transform node

import { BaseNode } from './baseNode';

export const TransformNode = ({ id, data, selected }) => (
  <BaseNode
    id={id}
    title="Transform"
    icon="auto_fix_high"
    accent="pink"
    selected={selected}
    fields={[
      {
        key: 'transformType',
        label: 'Transform',
        type: 'select',
        defaultValue: data?.transformType || 'Uppercase',
        options: ['Uppercase', 'Lowercase', 'JSON Parse', 'Trim'],
      },
    ]}
    handles={[
      { id: 'input', type: 'target', position: 'left', label: 'input' },
      { id: 'output', type: 'source', position: 'right', label: 'output' },
    ]}
  />
);
