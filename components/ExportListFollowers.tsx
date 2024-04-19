import Button from "antd/es/button"
import Card from "antd/es/card"
import { useSetAtom } from "jotai"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useCopyToClipboard } from "react-use"

import { useStorage } from "@plasmohq/storage/hook"

import { PREFIXED_STORAGE_KEY } from "~constants/storage"
import { toolPanelOpenAtom } from "~store/app"
import { isScrollBottom } from "~utils"

const ExportListFollowers = () => {
  const [list, setList] = useStorage(
    PREFIXED_STORAGE_KEY.LISTS_FOLLOW_USER_LIST,
    []
  )
  const [disposalListArr, setDisposalListArr] = useStorage(
    PREFIXED_STORAGE_KEY.DISPOSAL_USER_LIST,
    []
  )
  const setOpen = useSetAtom(toolPanelOpenAtom)
  const [stop, setStop] = useState(false)
  const timerRef = useRef(null)

  const getScrollListEle = () => {
    const listEle = document.querySelector(
      `div[aria-labelledby="modal-header"] div[data-viewportview="true"]`
    ) as HTMLDivElement
    return listEle
  }
  // 单独的处理列表数据的函数
  const processListItems = (previousList: string[], newListItems: string[]) => {
    const existingItems = new Set(previousList) // 使用 Set 来存储已有元素，以便快速查找

    newListItems.forEach((item) => {
      if (item && !existingItems.has(item)) {
        existingItems.add(item) // 添加新项目到 Set 和结果数组
      }
    })

    return Array.from(existingItems) // 将 Set 转换回数组以更新状态
  }

  const nextBatch = useCallback(() => {
    console.log("下一批！")

    const rootEleList = document.querySelectorAll(
      `div[aria-labelledby="modal-header"] div[data-testid="UserCell"]`
    )
    if (!rootEleList) return
    const list = Array.from(
      rootEleList,
      (ele) =>
        ele?.firstChild?.lastChild?.firstChild?.firstChild?.firstChild
          ?.lastChild?.lastChild?.textContent
    ).filter(Boolean)

    if (list?.length) {
      const listEle = getScrollListEle()
      listEle.scrollBy({
        // 可视范围高度
        top: 550
      })
      setList((prev) => processListItems(prev, list))
      if (isScrollBottom(listEle)) {
        setStop(true)
      }
    }
  }, [])

  const setTimer = useCallback(() => {
    if (!stop) {
      timerRef.current = setTimeout(() => {
        nextBatch()
        setTimer()
      }, 500)
    }
  }, [stop, nextBatch])

  const getAllUsername = useCallback(() => {
    setStop(false)
    timerRef.current && clearTimeout(timerRef.current) // 清除现有定时器
    nextBatch()
    setTimer()
  }, [setTimer, nextBatch])

  const listStr = useMemo(
    () => (list?.length ? list.reduce((pre, cur) => pre + `${cur}\n`, "") : ""),
    [list]
  )
  const disposeListStr = useMemo(
    () =>
      disposalListArr?.length
        ? disposalListArr.reduce((pre, cur) => pre + `${cur}\n`, "")
        : "",
    [disposalListArr]
  )
  const [_, copy] = useCopyToClipboard()

  useEffect(() => {
    if (stop) timerRef.current && clearTimeout(timerRef.current)
    return () => clearTimeout(timerRef.current) // 组件卸载时清除定时器
  }, [stop])

  return (
    <Card className="px-3 rounded-none">
      <div className="flex gap-3 flex-col">
        <div className="flex gap-2 items-center">
          {/* FIXME: 需要点两次才能自动往下滚 */}
          <Button type="primary" onClick={getAllUsername}>
            获取所有用户名（列表中）
          </Button>
          <Button danger onClick={() => setStop(true)}>
            停止
          </Button>
        </div>
        {/* <Button type="primary" onClick={() => copy(listStr)}>
          复制全部用户名
        </Button> */}
        <div className="flex gap-2">
          <Button
            danger
            type="primary"
            onClick={() => {
              setList([])
              const listEle = getScrollListEle()
              listEle.scrollTo({
                top: 0
              })
            }}>
            清空列表
          </Button>
          <Button danger type="primary" onClick={() => setDisposalListArr([])}>
            清空已排除
          </Button>
        </div>
      </div>
      <div className="grid mt-2 gap-2 grid-cols-2">
        <div className="flex flex-col gap-2">
          <div>列表用户({list?.length ?? 0})</div>
          <textarea className="overflow-auto h-24 w-full p-2" value={listStr} />
        </div>
        <div className="flex flex-col gap-2">
          <div>排除名单({disposalListArr?.length ?? 0})</div>
          <textarea
            className="overflow-auto h-24 w-full p-2"
            value={disposeListStr}
          />
        </div>
      </div>
    </Card>
  )
}

export default ExportListFollowers
