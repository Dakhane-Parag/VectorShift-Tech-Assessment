// submit.js
// Part 4 — sends the pipeline to the backend and shows the result.

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { num_nodes, num_edges, is_dag }
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/pipelines/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to reach backend. Is it running on port 8000?');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setResult(null);
    setError(null);
  };

  // ── Styles ──────────────────────────────────────────────────────────────────

  const btnStyle = {
    padding: '8px 20px',
    fontSize: '13px',
    fontWeight: '700',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    color: '#fff',
    background: loading
      ? '#444'
      : 'linear-gradient(135deg, #7c3aed 0%, #EC4899 100%)',
    border: 'none',
    borderRadius: '8px',
    cursor: loading ? 'not-allowed' : 'pointer',
    boxShadow: loading ? 'none' : '0 0 16px rgba(124,58,237,0.35)',
    transition: 'all 0.2s ease',
    letterSpacing: '0.3px',
    whiteSpace: 'nowrap',
  };

  // ── Result / Error Modal ────────────────────────────────────────────────────

  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(8px)',
    animation: 'vs-fade-in 0.3s ease-out forwards',
  };

  const dagColor = result?.is_dag ? '#22c55e' : '#ef4444';
  const dagIcon = result?.is_dag ? 'check_circle' : 'error';
  
  // Use a subtle glow based on validity
  const modalBoxShadow = result?.is_dag 
    ? '0 16px 64px rgba(34,197,94,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
    : error 
    ? '0 16px 64px rgba(239,68,68,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
    : '0 16px 64px rgba(239,68,68,0.15), inset 0 1px 0 rgba(255,255,255,0.1)';

  const modalStyle = {
    background: 'rgba(22, 18, 32, 0.85)',
    border: `1px solid rgba(255,255,255,0.08)`,
    borderRadius: '20px',
    padding: '36px 40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: modalBoxShadow,
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
    animation: 'vs-slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
    position: 'relative',
    overflow: 'hidden',
  };

  const headerGradientStyle = {
    position: 'absolute',
    top: 0, left: 0, right: 0, height: '4px',
    background: error ? '#ef4444' : dagColor,
  };

  const modalTitleStyle = {
    fontSize: '22px',
    fontWeight: '700',
    color: '#fff',
    margin: 0,
    letterSpacing: '-0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const closeBtnStyle = {
    width: '100%',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  return (
    <>
      <style>{`
        @keyframes vs-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes vs-slide-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .vs-modal-btn:hover {
          background: rgba(255,255,255,0.15) !important;
        }
      `}</style>
      <button
        style={btnStyle}
        onClick={handleSubmit}
        disabled={loading}
        id="submit-pipeline-btn"
      >
        {loading ? 'Analyzing…' : 'Submit Pipeline'}
      </button>

      {/* ── Result Modal ── */}
      {(result || error) && createPortal(
        <div style={overlayStyle} onClick={handleClose}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={headerGradientStyle} />
            
            {error ? (
              <>
                <h2 style={modalTitleStyle}>
                  <span className="material-symbols-outlined" style={{ color: '#ef4444', fontSize: '28px' }}>error</span>
                  Connection Error
                </h2>
                <div style={{ ...statRowStyle, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <span style={{ fontSize: '14px', color: '#fca5a5', lineHeight: '1.5' }}>{error}</span>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '28px', padding: '10px 0' }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: `color-mix(in srgb, ${dagColor} 15%, transparent)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 48px color-mix(in srgb, ${dagColor} 30%, transparent), inset 0 0 0 1px color-mix(in srgb, ${dagColor} 40%, transparent)`
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '40px', color: dagColor }}>
                    {dagIcon}
                  </span>
                </div>
                
                <div>
                  <h2 style={{ margin: 0, fontSize: '24px', color: '#fff', fontWeight: '700', letterSpacing: '-0.5px' }}>
                    {result.is_dag ? 'Pipeline Ready!' : 'Cycle Detected'}
                  </h2>
                  <p style={{ margin: '10px 0 0 0', color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: '1.5' }}>
                    {result.is_dag 
                      ? 'Your workflow is a perfectly valid Directed Acyclic Graph. It is ready for execution.'
                      : 'We detected a closed loop in your workflow. Data must flow strictly in one direction.'}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '32px', fontWeight: '800', color: '#d2bbff', lineHeight: '1' }}>{result.num_nodes}</span>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '600' }}>Total Nodes</span>
                  </div>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '32px', fontWeight: '800', color: '#d2bbff', lineHeight: '1' }}>{result.num_edges}</span>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '600' }}>Connections</span>
                  </div>
                </div>
              </div>
            )}

            <button className="vs-modal-btn" style={closeBtnStyle} onClick={handleClose}>
              Dismiss
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

