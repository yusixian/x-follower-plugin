import { StyleProvider } from "@ant-design/cssinjs"
import Button from "antd/es/button"
import tailwindText from "data-text:~style.css"
import antdResetCssText from "data-text:antd/dist/reset.css"
import { AnimatePresence, motion } from "framer-motion"
import { useAtom } from "jotai"
import type { PlasmoCSConfig, PlasmoGetShadowHostId } from "plasmo"
import { FaTools } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"

import AddMember from "~components/AddMember"
import { toolPanelOpenAtom } from "~store/app"
import { ThemeProvider } from "~theme"

import ExportFollowers from "./components/ExportFollowers"

export const config: PlasmoCSConfig = {
  matches: ["*://twitter.com/*", "*://x.com/*"]
}

const HOST_ID = "engage-csui"
export const getShadowHostId: PlasmoGetShadowHostId = () => HOST_ID

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = tailwindText + antdResetCssText
  return style
}

const PlasmoOverlay = () => {
  const [open, setOpen] = useAtom(toolPanelOpenAtom)

  return (
    <ThemeProvider>
      <StyleProvider container={document.getElementById(HOST_ID).shadowRoot}>
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
              <ExportFollowers />
              <AddMember />
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
      </StyleProvider>
    </ThemeProvider>
  )
}

export default PlasmoOverlay
