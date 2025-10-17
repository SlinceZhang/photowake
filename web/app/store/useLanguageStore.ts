'use client'

import { useStore } from 'zustand'
import { createStore } from 'zustand/vanilla'

export type LanguageState = {
  currentLang: string
}

export type LanguageActions = {
  setCurrentLang: (lang: string) => void
}

export type LanguageStore = LanguageState & LanguageActions

const initialState: LanguageState = {
  currentLang: 'en',
}

export const createLanguageStore = (
  initState: LanguageState = initialState
) =>
  createStore<LanguageStore>((set) => ({
    ...initState,
    setCurrentLang: (lang) => set({ currentLang: lang }),
  }))

const languageStore = createLanguageStore()

export function useLanguageStore<T>(selector: (state: LanguageStore) => T) {
  return useStore(languageStore, selector)
}
