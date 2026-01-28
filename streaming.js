import "dotenv/config"
import { Agent , run} from "@openai/agents"

const storyTellerAgent = new Agent({
    name:"Story Teller Agent",
    instructions:`You are a story teller agent you will tell the story to the user`,
})


// using Genrator function 

async function* streamOut(q) {
    const res = await run(storyTellerAgent,q,{stream:true})
    const stream = res.toTextStream()

    for await (const val of stream) {
            yield {isComp:true, value: val}
    }

    yield {isComp:false, value: res.finalOutput}

    
}

async function main(query="") {

    // +++++++++++ One Way to stream it ++++++++++++++++++

//     const res = await run(storyTellerAgent,query,{stream:true})
//    const stream =  res.toTextStream()
//    for await (const val of stream) {
//        console.log(val.join())
//    }

//  Second way 
//    const res = await run(storyTellerAgent,query,{stream:true})
//    res.toTextStream({compatibleWithNodeStreams:true}).pipe(process.stdout)

// Using Genrator function
for await (const val of streamOut(query)) {
    console.log(val)
}

}

main("Tell me a story about a cat in 100 words")