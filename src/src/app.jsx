import React, { useState } from 'react'

export default function App(){
  const [title, setTitle] = useState('My Video')
  const [scenes, setScenes] = useState([
    { character: 'Astro', tone: 'cheerful', text: 'Welcome to our show!' }
  ])
  const [backend, setBackend] = useState(import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000')
  const [status, setStatus] = useState('')
  const [driveLink, setDriveLink] = useState('')
  const [downloadUrl, setDownloadUrl] = useState('')

  const addScene = () => setScenes(prev => [...prev, { character: 'Nova', tone: 'serious', text: 'Next scene...' }])
  const updateScene = (i, key, value) => setScenes(prev => prev.map((s, idx) => idx===i ? ({...s, [key]: value}) : s))

  const renderVideo = async () => {
    setStatus('Rendering...')
    setDriveLink('')
    setDownloadUrl('')
    try {
      const res = await fetch(`${backend}/api/render`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, scenes })
      })
      if(!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setStatus('Done!')
      setDriveLink(data.driveFileUrl || '')
      setDownloadUrl(`${backend}/api/download/${data.jobId}`)
    } catch (e) {
      console.error(e)
      setStatus('Error: ' + e.message)
    }
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial', padding: 16, maxWidth: 900, margin: '0 auto' }}>
      <h1>Script → Video (Demo)</h1>
      <p>Enter your scenes. Each scene becomes a slide with voiceover. Characters and tones select a voice style.</p>

      <div style={{ marginBottom: 12 }}>
        <label>Title:&nbsp;</label>
        <input value={title} onChange={e=>setTitle(e.target.value)} style={{ width: 400 }}/>
      </div>

      {scenes.map((s, i) => (
        <div key={i} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 8 }}>
          <div>
            <label>Character:&nbsp;</label>
            <input value={s.character} onChange={e=>updateScene(i,'character', e.target.value)} />
            &nbsp;&nbsp;
            <label>Tone:&nbsp;</label>
            <select value={s.tone} onChange={e=>updateScene(i,'tone', e.target.value)}>
              <option>cheerful</option>
              <option>serious</option>
              <option>narration</option>
              <option>excited</option>
              <option>calm</option>
            </select>
          </div>
          <div style={{ marginTop: 8 }}>
            <label>Text:&nbsp;</label>
            <textarea value={s.text} onChange={e=>updateScene(i,'text', e.target.value)} style={{ width: '100%', height: 80 }} />
          </div>
        </div>
      ))}
      <button onClick={addScene}>+ Add Scene</button>

      <div style={{ marginTop: 16 }}>
        <label>Backend URL:&nbsp;</label>
        <input value={backend} onChange={e=>setBackend(e.target.value)} style={{ width: 400 }} />
      </div>

      <div style={{ marginTop: 16 }}>
        <button onClick={renderVideo}>Render & Upload to Drive</button>
      </div>

      <p style={{ marginTop: 16 }}><b>Status:</b> {status}</p>
      {downloadUrl && <p><a href={downloadUrl}>Download MP4</a></p>}
      {driveLink && <p><a href={driveLink} target="_blank" rel="noreferrer">Open in Google Drive</a></p>}

      <hr/>
      <p><b>Note:</b> This is an MVP. For high-quality avatars/animations, plug in your own assets and voices.</p>
    </div>
  )
}
