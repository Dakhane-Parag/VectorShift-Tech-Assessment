// draggableNode.js — Sidebar node chip with icon + label

export const DraggableNode = ({ type, label, icon, chipClass }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={`node-chip ${chipClass || ''}`}
      draggable
      onDragStart={(e) => onDragStart(e, type)}
      onDragEnd={(e) => { e.target.style.opacity = '1'; }}
      onDragStartCapture={(e) => { e.target.style.opacity = '0.7'; }}
    >
      {/* Material Symbol icon — uses ligature rendering */}
      <span className="chip-icon material-symbols-outlined">
        {icon || 'widgets'}
      </span>
      <span className="chip-label">{label}</span>
    </div>
  );
};