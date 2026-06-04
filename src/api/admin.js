import service from '@/utils/request'

export function userRegister(data) {
  return service.post('/api/user/add', data)
}

export function login(data) {
  return service.post('/api/user/login', data)
}
export function categoryTree() {
  return service.get('/api/knowledge/category/tree')
}
export function uploadFile(file, businessInfo) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('businessType', 'ARTICLE')
  formData.append('businessId', businessInfo.businessId)
  formData.append('businessField', 'cover')


  return service.post('/api/file/upload', formData)
}
export function articleAdd(data) {
  return service.post('/api/knowledge/article', data)
}

export function articlePage(params) {
  return service.get('/api/knowledge/article/page', { params })
}

export function articleDetail(id) {
  return service.get(`/api/knowledge/article/${id}`)
}

export function articleUpdate(data) {
  return service.put(`/api/knowledge/article/${data.id}`, data)
}

export function articleDelete(id) {
  return service.delete(`/api/knowledge/article/${id}`)
}

export function consultPage(params) {
  return service.get('/api/psychological-chat/sessions', { params })
}

export function consultDetail(id) {
  return service.get(`/api/psychological-chat/sessions/${id}`)
}

export function consultMessages(id) {
  return service.get(`/api/psychological-chat/sessions/${id}/messages`)
}

export function createSession(data) {
  return service.post('/api/psychological-chat/session/start', data)
}

export function streamChat(sessionId, userMessage, onChunk, onDone) {
  const token = localStorage.getItem('token')
  return fetch('http://159.75.169.224:1235/api/psychological-chat/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
      ...(token ? { token } : {})
    },
    body: JSON.stringify({ sessionId, userMessage })
  }).then(response => {
    if (!response.ok) throw new Error('网络请求失败')
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    function read() {
      return reader.read().then(({ done, value }) => {
        if (done) {
          if (onDone) onDone()
          return
        }
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()
        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed) continue
          if (trimmed.startsWith('data:')) {
            const payload = trimmed.slice(5).trim()
            if (payload === '[DONE]') {
              if (onDone) onDone()
              return
            }
            try {
              const json = JSON.parse(payload)
              onChunk(json)
            } catch {
              onChunk({ content: payload })
            }
          }
        }
        return read()
      })
    }

    return read()
  })
}

export function getSessionEmotion(sessionId) {
  return service.get(`/api/psychological-chat/session/${sessionId}/emotion`)
}

export function emotionDiaryCreate(data) {
  return service.post('/api/emotion-diary', data)
}

export function emotionDiaryPage(params) {
  return service.get('/api/emotion-diary/admin/page', { params })
}

export function emotionDiaryDetail(id) {
  return service.get(`/api/emotion-diary/${id}`)
}

export function emotionDiaryDelete(id) {
  return service.delete(`/api/emotion-diary/${id}`)
}

export function dataOverview() {
  return service.get('/api/data-analytics/overview')
}

export function logout() {
  return service.post('/api/user/logout')
}