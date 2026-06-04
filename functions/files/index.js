// EdgeOne Pages 边缘函数：代理 /files/* 请求到后端服务器
const BACKEND = 'http://159.75.169.224:1235'

export async function onRequest(context) {
  const { request } = context
  const url = new URL(request.url)
  const targetUrl = BACKEND + url.pathname + url.search

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    })

    const newHeaders = new Headers(response.headers)
    newHeaders.set('Access-Control-Allow-Origin', '*')

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Proxy error: ' + err.message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
