import "dotenv/config"
import { Agent, run, tool } from "@openai/agents"
import z from "zod"
import fs from "node:fs/promises"


// Tools for internet plan
const fetchAvailblePlans = tool({
    name:"Fetch_available_Plans",
    description:`fetch availble plans for the internet`,
    parameters:z.object({}),
    execute:async ()=>{
        console.log("Plans")
        return [
            {planID: 1, price:399,speed:"30mbps"},
            {planID: 2, price:499,speed:"50mbps"},  
            {planID: 3, price:599,speed:"70mbps"}
        ]
    }
})

// Tools for refund 

const processRefundTool = tool({
    name:'Process refund tool',
    description:`for refund proccessing tool`,
    parameters:z.object({
        customerId: z.string().describe("Customer ID"),
        reson:z.string().describe("resone for refonding")
    }),
    execute:async({customerId, reson})=>{
       await fs.appendFile("./refund.txt",`refund for ${customerId} for ${reson}`,"utf-8")

       return {refundIssue: true}
    }
})

// Refund Agent
const refundAgent =new Agent({
    name : "Refund Agent",
    instructions:`
    you are a refund expert agent you need to take the query regarding refund and proceed with it 
    `,
    tools:[processRefundTool]
})


// Sales Agent 
const  salesAgent = new Agent({
    name:"Sales Agent",
    instructions:`
    you are a expert sales agent for internet broadband company talk to the user
    `,
    tools:[fetchAvailblePlans,refundAgent.asTool({
        toolName:"Refund Expert",
        toolDescription:` handle refund questions and request`
    }) ]
})

// run the sales agent
async function runAgent(query="") {
    const res = await run(salesAgent ,query)
    console.log(res.finalOutput)
}

runAgent("I have 499 plan and you have overchanrge me 100 rs and i need my 100 rs as refund can do do it? cust123 is my csutomer id ")