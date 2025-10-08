import type { Tool } from "@modelcontextprotocol/sdk/types.js"
import {createStatefulServer }from "@smithery/sdk"

export const init = () => {
  return

} 

export const remove = (): Tool => {
  return {
    description: "Remove a file or directory",
    title: "Remove",
    inputSchema: {
      type: "object",
      properties: {

      },
    },
    name: "remove",
  }

}

export const find = () => {

}