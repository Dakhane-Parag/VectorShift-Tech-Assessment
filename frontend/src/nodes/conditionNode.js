// conditionNode.js
// Premium orange glassmorphism condition node

import { BaseNode } from './baseNode';

export const ConditionNode = ({ id, data, selected }) => (
  <BaseNode
    id={id}
    title="Condition"
    icon="alt_route"
    accent="orange"
    selected={selected}
    fields={[
      {
        key: 'condition',
        label: 'Condition',
        type: 'text',
        defaultValue: data?.condition || '',
      },
    ]}
    handles={[
      { id: 'input', type: 'target', position: 'left', label: 'input' },
      { id: 'true', type: 'source', position: 'right', topPercent: 33, label: 'true' },
      { id: 'false', type: 'source', position: 'right', topPercent: 66, label: 'false' },
    ]}
  />
);
