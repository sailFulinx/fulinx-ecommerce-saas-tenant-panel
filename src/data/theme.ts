export const themeSettings: ThemeSettingDataType[] = [
  {
    id: 1,
    themeSettingCode: 'Global',
    themeSettingName: '全局设置',
    content: {} as ThemeSettingGlobal,
  },
]

export const menuTypes = [
  {
    id: 1,
    code: 'none',
    title: '无',
  },
  {
    id: 2,
    code: 'dropDown',
    title: '下拉菜单',
  },
  {
    id: 3,
    code: 'megaMenu',
    title: '超级菜单',
  },
]

export const linkTypes = [
  {
    id: 1,
    code: 'home',
    title: '首页',
  },
  {
    id: 2,
    code: 'category',
    title: '分类',
  },
  {
    id: 3,
    code: 'article',
    title: '内容',
  },
  // {
  //   id: 4,
  //   code: 'systemPage',
  //   title: '系统页面'
  // },
  {
    id: 9,
    code: 'externalLink',
    title: '外部链接',
  },
]

export const readContentTypes = [
  {
    id: 1,
    code: 'category',
    title: '分类',
  },
  {
    id: 2,
    code: 'article',
    title: '内容',
  },
]
