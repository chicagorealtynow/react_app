import { useState, useEffect, useRef } from 'react';

function App() {
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('notes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore parsing errors
    }
    return [{ id: Date.now(), title: '', subtitle: '', details: '' }];
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const fileInputRef = useRef(null);


  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const current = notes[currentIndex] || { id: Date.now(), title: '', subtitle: '', details: '' };

  const updateField = (field, value) => {
    setNotes((prev) => {
      const updated = [...prev];
      updated[currentIndex] = { ...current, [field]: value };
      return updated;
    });
  };

  function previous() {
    setCurrentIndex((i) => (i > 0 ? i - 1 : notes.length - 1));
  }

  function next() {
    setCurrentIndex((i) => (i < notes.length - 1 ? i + 1 : 0));
  }

  function shuffle() {
    if (notes.length > 1) {
      let idx = Math.floor(Math.random() * notes.length);
      setCurrentIndex(idx);
    }
  }

  function addNew() {
    setNotes((prev) => [...prev, { id: Date.now(), title: '', subtitle: '', details: '' }]);
    setCurrentIndex(notes.length);
  }

  function deleteCurrent() {
    if (notes.length <= 1) return;
    setNotes((prev) => prev.filter((_, idx) => idx !== currentIndex));
    setCurrentIndex((i) => (i > 0 ? i - 1 : 0));
  }

  function toCsvRow(note) {
    const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
    return `${note.id},${esc(note.title)},${esc(note.subtitle)},${esc(note.details)}`;
  }

  function saveAllCsv() {
    const header = 'id,title,subtitle,details\n';
    const rows = notes.map(toCsvRow).join('\n');
    downloadCsv(header + rows, 'notes.csv');
  }

  function saveCurrentCsv() {
    const header = 'id,title,subtitle,details\n';
    const rows = toCsvRow(current);
    downloadCsv(header + rows, 'note.csv');
  }

  function downloadCsv(data, filename) {
    const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function openFile() {
    if (fileInputRef.current) fileInputRef.current.click();
  }

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.trim().split(/\r?\n/);
    const entries = lines.slice(1).map((line) => {
      const parts = line.match(/(?:"[^"]*"|[^,])+/g);
      const cleaned = parts.map((p) => p.replace(/^"|"$/g, "").replace(/""/g, '"'));
      return {
        id: Number(cleaned[0]) || Date.now(),
        title: cleaned[1] || '',
        subtitle: cleaned[2] || '',
        details: cleaned[3] || '',
      };
    });
    if (entries.length > 0) {
      setNotes(entries);
      setCurrentIndex(0);
    }
    e.target.value = null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-center">React Note App</h1>
        <div className="space-y-2">
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Title"
            value={current.title}
            onChange={(e) => updateField('title', e.target.value)}
          />
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Subtitle"
            value={current.subtitle}
            onChange={(e) => updateField('subtitle', e.target.value)}
          />
          <textarea
            className="w-full p-2 border rounded h-40"
            placeholder="Details"
            value={current.details}
            onChange={(e) => updateField('details', e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={previous}>Previous</button>
          <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={next}>Next</button>
          <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={shuffle}>Shuffle</button>
          <button className="px-3 py-1 bg-green-500 text-white rounded" onClick={addNew}>Add New Entry</button>
          <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={deleteCurrent}>Delete Current Record</button>
          <button className="px-3 py-1 bg-gray-700 text-white rounded" onClick={saveAllCsv}>Save Records to CSV</button>
          <button className="px-3 py-1 bg-gray-700 text-white rounded" onClick={openFile}>Choose File to Open</button>
          <button className="px-3 py-1 bg-gray-700 text-white rounded" onClick={saveCurrentCsv}>Save Current File</button>
        </div>
        <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFile} className="hidden" />
      </div>
    </div>
  );
}

export default App;
