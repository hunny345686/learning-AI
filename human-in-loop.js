import "dotenv/config"
import { Agent, run, tool } from "@openai/agents"
import z from "zod"
import axios from "axios"
import { readline } from "node:readline/promises"



// / Get Weather Data Tool
const getWeatherTool = tool({
    name: "Weather_tool",
    description: "returns the cuurent info for the given city",
    parameters: z.object({
        city: z.string().describe("Name of the city")
    }),
    execute: async function ({ city }) {
        const url = `https://wttr.in/${city.toLowerCase()}?format=%C+%t`
        const res = await axios.get(url, { responseType: "text" })
        return `The Weather of ${city} to ${res.data}`
    }
})
// Email Tool

const sendEmailTool = tool({
    name: "Send Email Tool",
    description: `Send Email to the user`,
    needsApproval: true,
    parameters: z.object({
        to: z.string().describe("Email of User"),
        subject: z.string().describe("Subject of Email"),
        html: z.string().describe("html body for the email"),
    }),
    execute: async ({ to, subject, html }) => {
        const API_KEY = "AS_96ff4d19593f7fd170beed3c75e27bf517405854.bsSjv4bMH7buQTE-ZkN5KeC8VOx8rAJnVxFlNCA1XPA"
        const res = await axios.post("https://api.autosend.com/v1/mails/send", {
            from: {
                email: "hunny345686@gmail.com",
                name: "AI Wether Agent"
            },
            to: {
                email: to
            },
            subject,
            html,

        }, {
            headers: {
                "Authorization": `Bearer ${API_KEY}`, // Replace with your API key
                "Content-Type": "application/json",
            },
        }


        )
        return res.data
    }

})


const agent = new Agent({
    name: "Weather email Agent",
    instructions: `
    you are an expert weather agent to help user to send the email about the weather
    `,
    tools: [getWeatherTool, sendEmailTool],
})


async function main(qwery = "") {
    const res = await run(agent, qwery)
    console.log(res.finalOutput)


    async function askUserConf(question) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        const ans = await rl.question(`${question} (y/n):`)
        rl.close()

        return ans === "Y" || ans === "Yes"
    }

    let hasIntruptions = res.interruptions.length > 0

    while (hasIntruptions) {
        const curState = res.state

        for (const intr of res.interruptionsState) {
            await askUserConf(`Agent ${intr.agent.name} is asking for calling the tool`)
        }
    }

}
main("what is Weather of bangalore and send me on hunny345686@gmail.com the wether data")