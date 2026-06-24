const BASE = '/my-api'

async function request(path, options = {}) {
  const token = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json', ...(token ? { token } : {}), ...options.headers }
  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  if (!res.ok) throw new Error('请求失败')
  return res.json()
}

export function consultPage(params) {
  const qs = new URLSearchParams(params).toString()
  return request(`/sessions?${qs}`)
}

export function createSession(data) {
  return request('/sessions', { method: 'POST', body: JSON.stringify(data) })
}

export function consultMessages(id) {
  return request(`/sessions/${id}/messages`)
}

export function streamChat(sessionId, userMessage, onChunk, onDone) {
  const xhr = new XMLHttpRequest()
  xhr.open('POST', 'http://localhost:3001/api/chat/stream')
  xhr.setRequestHeader('Content-Type', 'application/json')
  const token = localStorage.getItem('token')
  if (token) xhr.setRequestHeader('token', token)

  let lastLength = 0

  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.LOADING || xhr.readyState === XMLHttpRequest.DONE) {
      const newData = xhr.responseText.substring(lastLength)
      lastLength = xhr.responseText.length
      const lines = newData.split('\n')
      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith('data:')) continue
        const payload = trimmed.slice(5).trim()
        if (payload === '[DONE]') return
        try {
          onChunk(JSON.parse(payload))
        } catch {
          onChunk({ content: payload })
        }
      }
    }
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (onDone) onDone()
    }
  }

  xhr.send(JSON.stringify({ sessionId, userMessage }))
}

export function getSessionEmotion(id) {
  const sessionId = String(id).startsWith('session_') ? id : 'session_' + id
  return request(`/sessions/${sessionId}/emotion`)
}
