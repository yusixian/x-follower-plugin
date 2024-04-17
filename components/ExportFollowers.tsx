import Button from "antd/es/button"
import Card from "antd/es/card"
import { useSetAtom } from "jotai"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { FaChevronLeft } from "react-icons/fa"
import { useCopyToClipboard } from "react-use"

import { useStorage } from "@plasmohq/storage/hook"

import { PREFIXED_STORAGE_KEY } from "~constants/storage"
import { toolPanelOpenAtom } from "~store/app"

const ExportFollowers = () => {
  const [list, setList] = useStorage(PREFIXED_STORAGE_KEY.FOLLOW_USER_LIST, [])

  const setOpen = useSetAtom(toolPanelOpenAtom)
  const [stop, setStop] = useState(false)
  const timerRef = useRef(null)

  // 单独的处理列表数据的函数
  const processListItems = (previousList: string[], newListItems: string[]) => {
    const pattern = /关注了你/
    const existingItems = new Set(previousList) // 使用 Set 来存储已有元素，以便快速查找

    newListItems.forEach((item) => {
      const needModify = pattern.test(item) // TODO: 可以正则匹配一下推特用户名格式，不过感觉没必要
      const newItem = needModify ? item.replace(pattern, "") : item

      if (newItem && !existingItems.has(newItem)) {
        existingItems.add(newItem) // 添加新项目到 Set 和结果数组
      }
    })

    return Array.from(existingItems) // 将 Set 转换回数组以更新状态
  }

  const nextBatch = useCallback(() => {
    console.log("下一批！")

    const rootEleList = document.querySelectorAll(
      `div[data-testid="cellInnerDiv"]`
    )
    if (!rootEleList) return

    const list = Array.from(
      rootEleList,
      (ele) =>
        ele?.firstChild?.firstChild?.firstChild?.firstChild?.lastChild
          ?.firstChild?.firstChild?.firstChild?.lastChild?.textContent
    ).filter(Boolean)

    if (list?.length) {
      window.scrollBy({
        top: window.innerHeight // 滚动一个视口的高度
      })
      setList((prev) => processListItems(prev, list))
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
  const [_, copy] = useCopyToClipboard()

  useEffect(() => {
    if (stop) timerRef.current && clearTimeout(timerRef.current)
    return () => clearTimeout(timerRef.current) // 组件卸载时清除定时器
  }, [stop])

  return (
    <Card className="px-3 rounded-ss-none rounded-es-none">
      <div
        className="absolute transition rounded-se-lg rounded-es-lg cursor-pointer bg-[#141414] px-2 inset-y-0 right-0 flex justify-center items-center hover:brightness-50"
        onClick={() => {
          setOpen(false)
        }}>
        <FaChevronLeft />
      </div>
      <div className="flex gap-3 flex-col">
        <Button type="primary" onClick={getAllUsername}>
          Get All Username
        </Button>
        <Button type="primary" onClick={() => copy(listStr)}>
          Copy All
        </Button>
        <div className="flex gap-2">
          <Button danger onClick={() => setStop((p) => !p)}>
            Stop
          </Button>
          <Button
            onClick={() => {
              setList([])
              window.scrollTo({
                top: 0
              })
            }}>
            Clear
          </Button>
        </div>
      </div>
      <p className="my-2 text-lg">Count {list?.length ?? 0}</p>
      <textarea className="overflow-auto h-48 w-full p-2" value={listStr} />
    </Card>
  )
}

export default ExportFollowers
