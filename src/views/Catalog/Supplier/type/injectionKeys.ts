// import type { InjectionKey } from 'vue'

export interface SupplierContext {
  form: SupplierShowData
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
  resetFormData: (val: SupplierShowData) => Promise<void>
  id: string
  selectLanguage: Ref<LanguageData>
}

export const supplierKey: InjectionKey<SupplierContext> = Symbol('Supplier')
