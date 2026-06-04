// EdgeOne Pages 边缘函数：代理 /api/* 请求到后端服务器
const BACKEND = 'http://159.75.169.224:1235'

export async function onRequest(context) {
  const { request } = context

  // CORS 预检
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

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'Content-Type': request.headers.get('Content-Type') || 'application/json',
        'token': request.headers.get('token') || '',
      },
      body: request.body,
    })

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers),
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (err) {
    return new Response(JSON.stringify({ code: -1, msg: '代理请求失败: ' + err.message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
