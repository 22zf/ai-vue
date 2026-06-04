// EdgeOne Pages 边缘函数：代理 /api/* 请求到后端服务器
const BACKEND = 'http://159.75.169.224:1235'

export async function onRequest(context) {
  const { request } = context
  const url = new URL(request.url)

  // 拼接后端完整地址：/api/user/login → http://159.75.169.224:1235/api/user/login
  const targetUrl = BACKEND + url.pathname + url.search

  const proxyRequest = new Request(targetUrl, {
    method: request.method,
    headers: {
      'Content-Type': request.headers.get('Content-Type') || 'application/json',
      'token': request.headers.get('token') || '',
    },
    body: request.body,
  })

  const response = await fetch(proxyRequest)

  // 复制响应并添加 CORS 头
  const newResponse = new Response(response.body, response)
  newResponse.headers.set('Access-Control-Allow-Origin', '*')
  newResponse.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type,token')

  return newResponse
}
