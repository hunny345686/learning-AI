import "dotenv/config"
import { Agent, run, RunContext, tool } from "@openai/agents"
import z from "zod"

// type
interface myContext{
    userID : string,
    userName: string
}

// Tool
const getUserInfoTool = tool({
    name:"User info Tool",
    description:`Get the user info`,
    parameters:z.object({}),
    execute:async (_, ctx?:RunContext<myContext>):Promise<string> =>{
        return `UserID ${ctx?.userID} Username ${ctx?.userName}`
    }
}) 
// Agent
const customerSupportAgent = new Agent<myContext>({
    name:"Customer Support Agent",
    // +++++++ if not using tool for the Context use this
    
    // instructions:
    //     ({context})=>{
    //         return `you are AI expert for Customer Support Agent ${JSON.stringify(context)}  `
    //     },

    //+++++++++++++++ Tool is using Context
        instructions:`you are AI expert for Customer Support Agent`,
        tools:[getUserInfoTool]
    
})

// Run Agrnt
async function main(query:string, ctx:myContext) {
    const res = await run(customerSupportAgent,query,{context:ctx})
    console.log(res.finalOutput)
}

main("I what is my name",{
    userID:"1",
    userName:"Prem"
})