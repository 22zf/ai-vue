import router from '@/router'

/**
 * 获取后台菜单配置
 * 单一数据源：router meta
 * 自动过滤 meta.hidden = true 的路由
 */
export function getBackMenus() {
  const backRoute = router.options.routes.find(r => r.path === '/back')
  if (!backRoute || !backRoute.children) return []
  return backRoute.children
    .filter(child => !child.meta?.hidden)
    .map(child => ({
      path: `${backRoute.path}/${child.path}`,
      title: child.meta?.title || child.path,
      icon: child.meta?.icon || null
    }))
}
