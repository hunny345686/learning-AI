import "dotenv/config"
import { Agent, run, } from "@openai/agents"



const conversationAgent = new Agent({
    name: "Conversation Agent",
    instructions: "You are a helpful assistant that can answer questions and help with tasks.",
    tools: [],
})

async function main(query="") {
    const res = await run(conversationAgent, query)
    console.log(res.finalOutput)
}

main("what is the weather in tokyo?")