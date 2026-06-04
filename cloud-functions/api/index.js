const BACKEND = 'http://159.75.169.224:1235'

export default function onRequest(context) {
  const { request } = context
  const url = new URL(request.url)
  const targetUrl = BACKEND + url.pathname + url.search

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,token',
      },
    })
  }

  const headers = {
    'Content-Type': request.headers.get('Content-Type') || 'application/json',
  }
  const token = request.headers.get('token')
  if (token) headers['token'] = token

  return fetch(targetUrl, {
    method: request.method,
    headers,
    body: request.body,
  })
    .then(response => {
      const respHeaders = {}
      response.headers.forEach((v, k) => { respHeaders[k] = v })
      respHeaders['Access-Control-Allow-Origin'] = '*'
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: respHeaders,
      })
    })
    .catch(err => {
      return new Response(JSON.stringify({
        success: false,
        code: -1,
        msg: '代理失败: ' + err.message,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    })
}
