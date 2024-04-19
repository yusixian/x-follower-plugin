import Button from "antd/es/button"
import Card from "antd/es/card"
import type { InputNumberProps } from "antd/es/input-number"
import InputNumber from "antd/es/input-number"
import List from "antd/es/list"
import Tag from "antd/es/tag"
import { useCallback, useMemo, useState } from "react"
import { AiOutlinePlus } from "react-icons/ai"
import { MdOutlineContentPasteGo } from "react-icons/md"
import { RiDeleteBin5Fill } from "react-icons/ri"

import { useStorage } from "@plasmohq/storage/hook"

import { PREFIXED_STORAGE_KEY } from "~constants/storage"
import { useDomHandlers } from "~hooks/useDomHandlers"

const pageSize = 7
const AddMember = () => {
  const [list] = useStorage(PREFIXED_STORAGE_KEY.FOLLOW_USER_LIST, [])
  const [inListArr, setInListArr] = useStorage(
    PREFIXED_STORAGE_KEY.LISTS_FOLLOW_USER_LIST,
    []
  )
  const [disposalListArr, setDisposalListArr] = useStorage(
    PREFIXED_STORAGE_KEY.DISPOSAL_USER_LIST,
    []
  )
  const [curIndex, setCurIndex] = useState(0)
  const { pasteToInput, clickSubmit } = useDomHandlers()

  const onChange: InputNumberProps["onChange"] = (value) => {
    try {
      const num = Number(value)
      setCurIndex(num)
      pasteToInput(list[num])
    } catch (error) {
      console.error(error)
    }
  }

  const preItem = useCallback(() => {
    if (curIndex > 0) {
      setCurIndex(curIndex - 1)
      pasteToInput(list[curIndex - 1])
    }
  }, [curIndex, list])
  const nextItem = useCallback(() => {
    if (curIndex < (list?.length ?? 0) - 1) {
      setCurIndex(curIndex + 1)
      pasteToInput(list[curIndex + 1])
    }
  }, [curIndex, list])

  const isInList = useMemo(() => {
    if (!list?.length || !inListArr?.length) return false
    const cur = list[curIndex]
    return inListArr.includes(cur)
  }, [list, inListArr, curIndex])

  const isDisposal = disposalListArr.includes(list[curIndex])

  const [page, setPage] = useState(1)
  return (
    <Card className="rounded-ss-none rounded-se-none">
      <div className="px-3">
        <div className="flex items-center flex-col gap-2">
          <div className="flex justify-center items-center">
            {curIndex} - {list[curIndex]}
            <Button
              className="ml-1"
              size="small"
              onClick={() => {
                setCurIndex(curIndex)
                pasteToInput(list[curIndex])
              }}
              icon={<MdOutlineContentPasteGo />}
            />
            {isInList ? (
              <Tag color="blue" className="ml-1">
                已在列表
              </Tag>
            ) : (
              <>
                {isDisposal ? (
                  <Tag color="red" className="ml-1">
                    已排除
                  </Tag>
                ) : (
                  <>
                    <Button
                      className="ml-1"
                      size="small"
                      danger
                      onClick={() => {
                        setDisposalListArr((pre) => {
                          const newArr = [...pre]
                          newArr.unshift(list[curIndex])
                          return newArr
                        })
                      }}
                      icon={<RiDeleteBin5Fill />}
                    />
                    <Button
                      className="ml-1"
                      size="small"
                      type="primary"
                      onClick={() => {
                        setCurIndex(curIndex)
                        clickSubmit()
                        setInListArr((pre) => {
                          const newArr = [...pre]
                          newArr.unshift(list[curIndex])
                          return newArr
                        })
                      }}
                      icon={<AiOutlinePlus />}
                    />
                  </>
                )}
              </>
            )}
          </div>
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
        </div>
        <List
          className="mt-2"
          size="small"
          pagination={{
            align: "center",
            size: "small",
            simple: true,
            defaultPageSize: pageSize,
            showQuickJumper: true,
            total: list?.length ?? 0,
            current: page,
            onChange: (pageNum) => setPage(pageNum)
          }}
          dataSource={list}
          renderItem={(item, index) => {
            const idx = index + (page - 1) * pageSize
            const isInList = inListArr.includes(item)
            const isDisposal = disposalListArr.includes(item)

            return (
              <List.Item>
                {item}
                <Button
                  className="ml-1"
                  onClick={() => {
                    setCurIndex(idx)
                    pasteToInput(list[idx])
                  }}
                  icon={<MdOutlineContentPasteGo />}
                />
                {isInList ? (
                  <Tag color="blue" className="ml-1">
                    已在列表
                  </Tag>
                ) : (
                  <>
                    {isDisposal ? (
                      <Tag color="red" className="ml-1">
                        已排除
                      </Tag>
                    ) : (
                      <>
                        <Button
                          className="ml-1"
                          danger
                          onClick={() => {
                            setDisposalListArr((pre) => {
                              const newArr = [...pre]
                              newArr.unshift(item)
                              return newArr
                            })
                          }}
                          icon={<RiDeleteBin5Fill />}
                        />
                        <Button
                          className="ml-1"
                          type="primary"
                          onClick={() => {
                            setCurIndex(idx)
                            clickSubmit()
                            setInListArr((pre) => {
                              const newArr = [...pre]
                              newArr.unshift(item)
                              return newArr
                            })
                          }}
                          icon={<AiOutlinePlus />}
                        />
                      </>
                    )}
                  </>
                )}
              </List.Item>
            )
          }}
        />
      </div>
    </Card>
  )
}

export default AddMember
