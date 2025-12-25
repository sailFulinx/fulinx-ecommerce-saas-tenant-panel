// import type { InjectionKey } from 'vue'

export interface CategoryContext {
  form: CategoryShowData
  loading: {
    init: boolean
    categories: boolean
  }
  activeName: Ref<string>
  paneName: Readonly<{
    Base: string
    Seo: string
    Layout: string
    Slug: string
  }>
  resetFormData: (val: CategoryShowData) => Promise<void>
  id: string
  handleClickUpdateParentId: (val: CategoryShowData) => void
  selectLanguage: Ref<LanguageData>
}

export const categoryKey: InjectionKey<CategoryContext> = Symbol('Category')
