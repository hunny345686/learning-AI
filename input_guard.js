import "dotenv/config"
import { Agent, InputGuardrailTripwireTriggered, run } from "@openai/agents"
import z from "zod"


const mathInputAgent = new Agent({
    name:"Math Input Agent",
    instructions:` you are an input guardrail cheker that check the user input is it a math query or not 
    rules-> 
    - The question must be Math equation only
    - Reject any other Kind of request even it related to maths
    `,
    outputType: z.object({
        isValidMathQuetions:z.boolean().describe("question should be related to math only"),
        reason:z.string().optional().describe("reason for reject")
    })
})
const mathInputGuard = {
    name:"Math Homework Guadrial",
    execute:async ({input}) => {
        const res = await run(mathInputAgent,input)
        return{
            outputInfo:res.finalOutput.reason,
            tripwireTriggered: !res.finalOutput.isValidMathQuetions
        }
    }
}
const matheAgent = new Agent({
    name:"Math Agent",
    instructions:`You are an expert Math AI Agent`,
    inputGuardrails:[mathInputGuard]
})


async function Main(query=""){
 try {
    const res = await run(matheAgent, query)
    console.log(res.finalOutput)
 } catch (e) {
    if(e instanceof InputGuardrailTripwireTriggered){
        console.log(`Invalued Input due to ${e.message}`)
    }
    
 }
} 

Main("what is  node js ");