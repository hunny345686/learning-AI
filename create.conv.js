import "dotenv/config"
import { OpenAI } from "openai"

const client = new OpenAI()

client.conversations.create({}).then((e)=>{
    // conv_6975b75160608195b98dd8bbde0212920f86775de0636a40
    console.log("Converstiom " + e.id)
})