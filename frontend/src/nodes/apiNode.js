// apiNode.js
// Premium cyan glassmorphism API node

import { BaseNode } from './baseNode';

export const ApiNode = ({ id, data, selected }) => (
  <BaseNode
    id={id}
    title="API Request"
    icon="api"
    accent="cyan"
    selected={selected}
    fields={[
      {
        key: 'url',
        label: 'URL',
        type: 'text',
        defaultValue: data?.url || 'https://',
      },
      {
        key: 'method',
        label: 'Method',
        type: 'select',
        defaultValue: data?.method || 'GET',
        options: ['GET', 'POST', 'PUT'],
      },
    ]}
    handles={[
      { id: 'input', type: 'target', position: 'left', label: 'input' },
      { id: 'output', type: 'source', position: 'right', label: 'output' },
    ]}
  />
);
