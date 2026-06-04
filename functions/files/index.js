// EdgeOne Pages 边缘函数：代理 /files/* 请求到后端服务器
const BACKEND = 'http://159.75.169.224:1235'

export async function onRequest(context) {
  const { request } = context
  const url = new URL(request.url)

  const targetUrl = BACKEND + url.pathname + url.search

  const proxyRequest = new Request(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  })

  const response = await fetch(proxyRequest)

  const newResponse = new Response(response.body, response)
  newResponse.headers.set('Access-Control-Allow-Origin', '*')

  return newResponse
}
