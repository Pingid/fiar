import { create } from 'zustand'

export type OpenAiConfig = {}

export const useOpenAiConfig = create<OpenAiConfig>(() => ({}))
