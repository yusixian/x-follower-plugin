import Button from "antd/es/button"
import Card from "antd/es/card"
import { AnimatePresence, motion } from "framer-motion"
import { useCallback, useMemo, useState } from "react"
import { FaChevronLeft, FaTools } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import { useCopyToClipboard } from "react-use"

const ExportFollowers = () => {
  const [list, setList] = useState<string[]>([])
  const [open, setOpen] = useState<boolean>(false)

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
    <AnimatePresence mode="sync">
      {open ? (
        <motion.div
          key="panel-open"
          layoutId="followers-panel"
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          exit={{ x: -100 }}
          transition={{ duration: 0.5, ease: "linear" }}
          className="w-80 fixed left-0 top-8">
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
        </motion.div>
      ) : (
        <motion.div
          key="panel-close"
          layoutId="followers-panel"
          className="fixed left-0 top-8">
          <Button
            className="flex h-auto py-3 rounded-ss-none rounded-es-none px-2 flex-col gap-2"
            onClick={() => setOpen(true)}>
            <FaXTwitter size={22} />
            <FaTools size={22} />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ExportFollowers
