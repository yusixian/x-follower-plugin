import { StyleProvider } from "@ant-design/cssinjs"
import tailwindText from "data-text:~style.css"
import antdResetCssText from "data-text:antd/dist/reset.css"
import type { PlasmoCSConfig, PlasmoGetShadowHostId } from "plasmo"

import { ThemeProvider } from "~theme"

import ExportFollowers from "../components/ExportFollowers"

export const config: PlasmoCSConfig = {
  matches: ["*://twitter.com/*/following", "*://x.com/*/following"]
}

const HOST_ID = "engage-csui"
export const getShadowHostId: PlasmoGetShadowHostId = () => HOST_ID

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = tailwindText + antdResetCssText
  return style
}

const PlasmoOverlay = () => {
  return (
    <ThemeProvider>
      <StyleProvider container={document.getElementById(HOST_ID).shadowRoot}>
        <ExportFollowers />
      </StyleProvider>
    </ThemeProvider>
  )
}

export default PlasmoOverlay
