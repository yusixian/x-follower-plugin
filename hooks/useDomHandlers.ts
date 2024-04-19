import { useCallback } from "react"

export const useDomHandlers = (config?: {
  inputEleQueryStr?: string
  addBtnQueryStr?: string
}) => {
  const {
    inputEleQueryStr = `form[aria-label="搜索用户"] input[aria-label="查询词条"]`,
    addBtnQueryStr = `div[aria-label="添加"]`
  } = config ?? {}
  const pasteToInput = useCallback((value?: string) => {
    const rootEle = document.querySelector(inputEleQueryStr) as HTMLInputElement
    if (rootEle) {
      rootEle.focus()
      rootEle.value = "" // Clear the current content
      document.execCommand("inserttext", false, value) // remove @
    }
  }, [])

  const clickSubmit = useCallback(() => {
    const addBtn = document.querySelector(addBtnQueryStr) as HTMLDivElement
    addBtn?.click()
  }, [])

  return { pasteToInput, clickSubmit }
}
