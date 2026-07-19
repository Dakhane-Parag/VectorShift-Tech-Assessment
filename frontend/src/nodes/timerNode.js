// timerNode.js
// Premium teal glassmorphism timer node

import { BaseNode } from './baseNode';

export const TimerNode = ({ id, data, selected }) => (
  <BaseNode
    id={id}
    title="Timer"
    icon="schedule"
    accent="teal"
    selected={selected}
    fields={[
      {
        key: 'delay',
        label: 'Delay',
        type: 'number',
        defaultValue: data?.delay || 1000,
      },
      {
        key: 'unit',
        label: 'Unit',
        type: 'select',
        defaultValue: data?.unit || 'ms',
        options: ['ms', 'seconds', 'minutes'],
      },
    ]}
    handles={[
      { id: 'output', type: 'source', position: 'right', label: 'output' },
    ]}
  />
);
