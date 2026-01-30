import "dotenv/config"
import { Agent, run, hostedMcpTool } from "@openai/agents"

const hostedMCPAgent = new Agent({
    name: "MCP Assitent",
    instructions: `you must use the  MCP tool to ans the questions from user`,
    tools: [
        hostedMcpTool({
            serverLabel: "gitmcp",
            serverUrl: "https://gitmcp.io.openai/codex"
        })
    ]
})

async function main(q = "") {
    const res = await run(hostedMCPAgent, q)
    console.log(res.finalOutput)
}

main("what is this repo about?")

