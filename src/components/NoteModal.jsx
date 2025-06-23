import React from 'react';

const NoteModal = ({ noteContent, setNoteContent, onSave, onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#a64d79',
      border: '1px solid #ccc',
      padding: '2rem',
      boxShadow: '0 8px 16px rgba(0,0,0,0.25)',
      zIndex: 1000,
      width: '400px',
      borderRadius: '8px'
    }}>
      <h3>📝 Save Notes</h3>
      <textarea
        rows="5"
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
        placeholder="Write your note here..."
        style={{ width: '100%', marginBottom: '1rem' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={onSave} style={{ backgroundColor: '#4caf50', color: 'white' }}>💾 Save</button>
        <button onClick={onClose} style={{ backgroundColor: '#f44336', color: 'white' }}>❌ Close</button>
      </div>
    </div>
  );
};

export default NoteModal;
