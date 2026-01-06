// import type { InjectionKey } from 'vue'

export interface ParameterContext {
  form: ParameterShowData
  loading: {
    init: boolean
    categories: boolean
  }
  activeName: Ref<string>
  paneName: Readonly<{
    Base: string
    ParameterValue: string
  }>
  resetFormData: (val: ParameterShowData) => Promise<void>
  id: string
  selectLanguage: Ref<LanguageData>
}

export const parameterKey: InjectionKey<ParameterContext> = Symbol('Parameter')
