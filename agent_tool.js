import "dotenv/config"
import { Agent, run, tool } from "@openai/agents"
import z from "zod"
import axios from "axios"


const getWeatherRseSchema = z.object({
    city:z.string().describe("City name"),
    degree_c:z.number().describe("the degree should in celcius"),
    condition: z.string().optional().describe("Conditions of the wether")
})

const getWeatherTool = tool({
    name:"Weather_tool",
    description:"returns the cuurent info for the given city",
    parameters:z.object({
        city:z.string().describe("Name of the city")
    }),
    execute: async function ({city}) {
        const url = `https://wttr.in/${city.toLowerCase()}?format=%C+%t`
        const res = await axios.get(url,{responseType:"text"})
        return `The Weather of ${city} to ${res.data}`
    }
})
    

const agent = new Agent({
    name:"Weather Agent" ,
    instructions:`
    you are an expert weathet agent to help user to tell abou the weather
    `,   
    tools:[getWeatherTool],
    outputType:getWeatherRseSchema
})


async function main(qwery =""){
  const res = await run(agent,qwery)
  console.log(res.finalOutput)

}   
main("what is Weather of bangalore ?")