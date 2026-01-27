import "dotenv/config"
import { Agent ,run} from "@openai/agents";


const salesAgent = new Agent({
    name:"Sales Agent",
    description:"",
})