import "dotenv/config";
import { Agent, run, tool } from "@openai/agents";
const customerSupportAgent = new Agent({
    name: "Customer Support Agent",
    instructions: `you are an expert Customer Support Agent`
});
async function main(query, ctx) {
    const res = await run(customerSupportAgent, query, { context: ctx });
    console.log(res.finalOutput);
}
main("I what is my name", {
    userID: "1",
    userName: "Prem"
});
//# sourceMappingURL=run-context.js.map