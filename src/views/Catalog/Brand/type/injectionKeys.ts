// import type { InjectionKey } from 'vue'

export interface BrandContext {
  form: BrandShowData
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
  resetFormData: (val: BrandShowData) => Promise<void>
  id: string
  selectLanguage: Ref<LanguageData>
}

export const brandKey: InjectionKey<BrandContext> = Symbol('Brand')
