export const importTypes = [
  {
    id: 1,
    code: 'product',
    label: '产品',
    fileName: 'product_import_template.xlsx',
    importTemplateUrl: `${import.meta.env.VITE_RESOURCE_URL}/downloads/templates/product_import_template.xlsx`,
  },
]

export const importStatuses = [
  {
    id: 0,
    label: '未开始',
  },
  {
    id: 1,
    label: '正在导入',
  },
  {
    id: 2,
    label: '导入完成',
  },
  {
    id: 3,
    label: '导入失败',
  },
]

export const importLogStatuses = [
  {
    id: 0,
    label: '等待导入',
  },
  {
    id: 1,
    label: '正在导入',
  },
  {
    id: 2,
    label: '已导入',
  },
  {
    id: 9,
    label: '导入失败',
  },
]
