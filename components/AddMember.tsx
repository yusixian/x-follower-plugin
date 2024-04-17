import Button from "antd/es/button"
import Card from "antd/es/card"
import type { InputNumberProps } from "antd/es/input-number"
import InputNumber from "antd/es/input-number"
import _ from "lodash-es"
import { useCallback, useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { PREFIXED_STORAGE_KEY } from "~constants/storage"

const AddMember = () => {
  const [list] = useStorage(PREFIXED_STORAGE_KEY.FOLLOW_USER_LIST, [])
  const [curIndex, setCurIndex] = useState(0)

  const pasteToInput = (cur?: number) => {
    const rootEle = document.querySelector(
      `form[aria-label="搜索用户"] input[aria-label="查询词条"]`
    ) as HTMLInputElement
    rootEle.focus()
    rootEle.value = "" // Clear the current content
    document.execCommand("inserttext", false, list[cur ?? curIndex].slice(1)) // remove @
  }

  const clickSubmit = () => {
    const addBtn = document.querySelector(
      `div[aria-label="添加"]`
    ) as HTMLDivElement
    addBtn?.click()
  }

  const submitAndNext = useCallback(() => {
    if (!list?.length || curIndex >= list.length || curIndex < 0) return
    clickSubmit()
    const ms = _.random(100, 130)
    setTimeout(() => {
      pasteToInput()
      setCurIndex(curIndex + 1)
    }, ms)
  }, [list, setCurIndex, curIndex])

  const onChange: InputNumberProps["onChange"] = (value) => {
    try {
      const num = Number(value)
      setCurIndex(num)
      pasteToInput(num)
    } catch (error) {
      console.error(error)
    }
  }

  const preItem = useCallback(() => {
    if (curIndex > 0) {
      setCurIndex(curIndex - 1)
      pasteToInput(curIndex - 1)
    }
  }, [curIndex, list])
  const nextItem = useCallback(() => {
    if (curIndex < (list?.length ?? 0) - 1) {
      setCurIndex(curIndex + 1)
      pasteToInput(curIndex + 1)
    }
  }, [curIndex, list])

  return (
    <Card className="px-3 rounded-ss-none rounded-es-none">
      <div className="flex items-center flex-col gap-2">
        <p>
          {curIndex + 1} - {list[curIndex]}
        </p>
        <div className="flex gap-2">
          <Button onClick={preItem}>Previous</Button>
          <InputNumber
            className="ml-2"
            min={0}
            max={list?.length ?? 0}
            value={curIndex}
            onChange={onChange}
          />
          <Button onClick={nextItem}>Next</Button>
        </div>
        <div className="flex justify-between flex-wrap gap-2">
          <Button type="primary" onClick={() => pasteToInput()}>
            Paste
          </Button>
          <Button type="primary" onClick={clickSubmit}>
            Submit
          </Button>
        </div>
        <Button type="primary" onClick={submitAndNext}>
          Submit And Next
        </Button>
      </div>
    </Card>
  )
}

export default AddMember
