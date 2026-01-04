// import type { InjectionKey } from 'vue'

export interface AttributeContext {
  form: AttributeShowData
  loading: {
    init: boolean
    categories: boolean
  }
  activeName: Ref<string>
  paneName: Readonly<{
    Base: string
    AttributeValue: string
  }>
  resetFormData: (val: AttributeShowData) => Promise<void>
  id: string
  selectLanguage: Ref<LanguageData>
}

export const attributeKey: InjectionKey<AttributeContext> = Symbol('Attribute')
