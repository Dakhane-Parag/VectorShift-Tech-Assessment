// App.js — Application Shell layout based on Stitch design

import { PipelineToolbar } from './toolbar';
import { PipelineUI }      from './ui';
import { SubmitButton }    from './submit';

function App() {
  return (
    <div className="app-shell">
      {/* ── Left Sidebar ── */}
      <PipelineToolbar />

      {/* ── Main Content (Header + Canvas) ── */}
      <div className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="breadcrumb">
            <span className="workflow-name">Untitled Workflow</span>
          </div>

          <div className="header-actions">
            <div className="header-divider" />
            {/* Submit button lives here at the top-right */}
            <SubmitButton />
          </div>
        </header>

        {/* Canvas */}
        <PipelineUI />
      </div>
    </div>
  );
}

export default App;
