// inputNode.js — Premium blue glassmorphism input node

import { BaseNode } from './baseNode';

export const InputNode = ({ id, data, selected }) => (
  <BaseNode
    id={id}
    title="Input"
    icon="login"
    accent="blue"
    selected={selected}
    fields={[
      {
        key: 'inputName',
        label: 'Name',
        type: 'text',
        defaultValue: data?.inputName || id.replace('customInput-', 'input_'),
      },
      {
        key: 'inputType',
        label: 'Type',
        type: 'select',
        defaultValue: data?.inputType || 'Text',
        options: ['Text', 'File'],
      },
    ]}
    handles={[
      { id: 'value', type: 'source', position: 'right', label: 'output' },
    ]}
  />
);
