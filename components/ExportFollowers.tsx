import Button from "antd/es/button"
import Card from "antd/es/card"
import { useSetAtom } from "jotai"
import { useCallback, useMemo, useState } from "react"
import { FaChevronLeft } from "react-icons/fa"
import { useCopyToClipboard } from "react-use"

import { toolPanelOpenAtom } from "~store/app"

const ExportFollowers = () => {
  const [list, setList] = useState<string[]>([])
  const setOpen = useSetAtom(toolPanelOpenAtom)

  const nextBatch = useCallback(() => {
    console.log("下一批！")

    const rootEleList = document.querySelectorAll(
      `div[data-testid="cellInnerDiv"]`
    )
    if (!rootEleList) return

    const list: any[] = []
    rootEleList.forEach((ele: Element) =>
      list.push(
        ele?.firstChild?.firstChild?.firstChild?.firstChild?.lastChild
          ?.firstChild?.firstChild?.firstChild?.lastChild?.textContent
      )
    )
    if (!list?.length) return
    window.scrollBy({
      top: window.innerHeight // 滚动一个视口的高度
    })
    setList((pre) => {
      const newList = [...pre]
      list.forEach((e) => {
        if (!pre.includes(e)) newList.push(e)
      })
      return newList
    })
  }, [])

  const isScrollAtBottom = () => {
    // 滚动条位置 + 视口高度
    const scrollPosition = window.pageYOffset + window.innerHeight
    // 文档总高度
    const bottomPosition = document.documentElement.scrollHeight

    return scrollPosition >= bottomPosition
  }
  const setTimer = () => {
    setTimeout(() => {
      if (isScrollAtBottom()) {
        // <FIXME>judge scroll bottom</FIXME>
        console.log("到底了")
        return
      }
      nextBatch()
      setTimer()
    }, 500)
  }
  const getAllUsername = useCallback(() => {
    nextBatch()
    setTimer()
  }, [])

  const listStr = useMemo(
    () => (list?.length ? list.reduce((pre, cur) => pre + `${cur}\n`, "") : ""),
    [list]
  )
  const [_, copy] = useCopyToClipboard()

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
          Get All Username (Next Batch)
        </Button>
        <Button type="primary" onClick={() => copy(listStr)}>
          Copy All
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
      <p className="my-2 text-lg">Count {list?.length ?? 0}</p>
      <textarea
        className="overflow-auto h-96 w-full p-2"
        value={listStr}
        readOnly
      />
    </Card>
  )
}

export default ExportFollowers
