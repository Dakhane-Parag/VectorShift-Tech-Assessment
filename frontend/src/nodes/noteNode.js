// noteNode.js
// Premium gray glassmorphism note node

import { BaseNode } from './baseNode';

export const NoteNode = ({ id, data, selected }) => (
  <BaseNode
    id={id}
    title="Note"
    icon="sticky_note_2"
    accent="gray"
    selected={selected}
    fields={[
      {
        key: 'note',
        label: 'Note text',
        type: 'textarea',
        defaultValue: data?.note || '',
      },
    ]}
    handles={[]}
  />
);
