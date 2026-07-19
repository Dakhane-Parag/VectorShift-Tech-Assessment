// outputNode.js — Premium green glassmorphism output node

import { BaseNode } from './baseNode';

export const OutputNode = ({ id, data, selected }) => (
  <BaseNode
    id={id}
    title="Output"
    icon="logout"
    accent="green"
    selected={selected}
    fields={[
      {
        key: 'outputName',
        label: 'Name',
        type: 'text',
        defaultValue: data?.outputName || id.replace('customOutput-', 'output_'),
      },
      {
        key: 'outputType',
        label: 'Type',
        type: 'select',
        defaultValue: data?.outputType || 'Text',
        options: ['Text', 'Image'],
      },
    ]}
    handles={[
      { id: 'value', type: 'target', position: 'left', label: 'input' },
    ]}
  />
);
