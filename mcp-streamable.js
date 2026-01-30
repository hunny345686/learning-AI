import "dotenv/config"
import { Agent, run, MCPServerStreamableHttp } from "@openai/agents"

const githunMCPServer = new MCPServerStreamableHttp({
    name: "MCP document Server",
    url: "https://gitmcp.io.openai/codex"
})

const hostedMCPAgent = new Agent({
    name: "MCP Assitent",
    instructions: `you must use the  MCP tool to ans the questions from user`,
    mcpServers: [githunMCPServer]
})

async function main(q = "") {
    await githunMCPServer.connect()
    const res = await run(hostedMCPAgent, q)
    console.log(res.finalOutput)
    await githunMCPServer.close()

}

main("what is this repo about?")

