import "dotenv/config"
import { Agent, run, tool } from "@openai/agents"
import fs from "node:fs/promises"
import z from "zod"


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
const refundAgent = new Agent({
    name:"Refund Agent",
    instructions:`You are an expert refund Angent you will issue refund to customer`,
    tools:[processRefundTool]
})



// Tools get Availble Plans
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


// Now Primary Agent Which Will deside which agent should call 
const primaryAgent = new Agent({
    name:"Primary Agent",
    instructions:` You are Cousmer Facing Agent will understand the coustomer query and route or handoff them to the perticular agent`,
    handoffDescription :`You have two agent availble 
    salesAgent => expert in handling in querys like Regarding Plan and price and all.
    refundAgent => expert in handling user queries for refund to existing users. 
    `,
    handoffs:[salesAgent,refundAgent]
})



async function main(query="") {
    const result = await run(primaryAgent,query)
    console.log("Result =>",result.finalOutput);
    console.log("History =>",result.history);
}

// main("I have 499 plan and you have overchanrge me 100 rs and i need my 100 rs as refund can do do it? cust123 is my csutomer id ")


main("Hello I m a customer I m facing a issue from last 1 month now i need my refund for last month my id is cust1234")