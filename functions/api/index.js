// EdgeOne Pages 边缘函数：代理 /api/* 请求到后端服务器
const BACKEND = 'http://159.75.169.224:1235'

export async function onRequest(context) {
  const { request } = context

  // 处理 CORS 预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,token',
        'Access-Control-Max-Age': '86400',
      },
    })
  }

  const url = new URL(request.url)
  const targetUrl = BACKEND + url.pathname + url.search

  // 构建请求头，透传原始请求的关键头部
  const headers = new Headers()
  const forwardHeaders = ['Content-Type', 'token', 'Accept', 'Authorization']
  for (const key of forwardHeaders) {
    const val = request.headers.get(key)
    if (val) headers.set(key, val)
  }

  const proxyRequest = new Request(targetUrl, {
    method: request.method,
    headers,
    body: request.body,
  })

  try {
    const response = await fetch(proxyRequest)
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
