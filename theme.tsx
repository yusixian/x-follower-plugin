import ConfigProvider from "antd/es/config-provider"
import theme from "antd/es/theme"
import type { ReactNode } from "react"

export const ThemeProvider = ({ children = null as ReactNode }) => (
  <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
    {children}
  </ConfigProvider>
)
