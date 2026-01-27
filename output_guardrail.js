import "dotenv/config"
import { Agent, run, tool } from "@openai/agents"
import fs from "node:fs/promises"
import z from "zod"

const sqlGuadrailAgent = new Agent({
    name: "SQL Guardrail",
    instructions:`check the query is safe to excute, query msut be read only do not modify delete or drop tables`,
    outputType:z.object({
        resone:z.string().optional().describe("reseon if qurey is unsafe"),
        isSafe:z.boolean().optional().describe("if query is safe to execute")
    })
})

const sqlGaardial = {
    name:"SQL Guardrail",
    async execute({agentOutput}){
        const res = await run(sqlGuadrailAgent,agentOutput.sqlQuery)
        return {
            tripwireTriggered:!res.finalOutput.isSafe,
            outInfo:res.finalOutput.resone
        }
    }
}
const sqlAgent = new Agent({
    name: "SQL Schema Generator Agent",
    instructions: `
        You are an expert SQL agent. Generate a SQL schema for both a 'users' table and a 'comments' table.
        - The 'users' table should contain typical fields: 'id' (primary key), 'username', 'email', and 'created_at'.
        - The 'comments' table should have: 'id' (primary key), 'user_id' (foreign key referencing users.id), 'comment_text', and 'created_at'.
        - Make sure to define data types and establish the foreign key relationship.
        Output valid SQL CREATE TABLE statements to implement this schema.
    `,
    outputType:z.object({
        sqlQuery: z.string().optional().describe("SQl query")
    }),
    outputGuardrails:[sqlGaardial]
})


async function main(query='') {
    const res = await run(sqlAgent,query)
    console.log(res.finalOutput.sqlQuery)
}

main("get all the user")