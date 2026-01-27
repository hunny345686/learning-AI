import "dotenv/config"
import { Agent, run, tool } from "@openai/agents"


const customerSupportAgent = new Agent({
    name:"Customer Support Agent",
    instructions:`you are an expert Customer Support Agent`
})


async function main(query:string) {
    const res = await run(customerSupportAgent,query)
    console.log(res.finalOutput)
}