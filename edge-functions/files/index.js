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

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers),
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: '代理请求失败: ' + err.message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
