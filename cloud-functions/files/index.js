const BACKEND = 'http://159.75.169.224:1235'

export default function onRequest(context) {
  const { request } = context
  const url = new URL(request.url)
  const targetUrl = BACKEND + url.pathname + url.search

  return fetch(targetUrl, {
    method: request.method,
    headers: request.headers,
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
      return new Response(JSON.stringify({ error: '代理失败: ' + err.message }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    })
}
