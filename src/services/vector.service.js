const { Pinecone } =  require('@pinecone-database/pinecone');

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

// Index where we store vector
// pc ---> pinecone 
// pc.index('chatgpt)  --> index name
const chatgptIndex = pc.index('chatgpt');

async function createMemory({ vectors, metadata, messageId }) {
    await chatgptIndex.upsert([ {
        id: messageId,
        values: vectors,
        metadata
    } ])
}

async function  queryMemory({ queryVector, limit = 5, metadata}) {

    const data = await chatgptIndex.query({
        vector: queryVector,
        topK : limit,   // how many nearest vector 
        filter: metadata ?  metadata  : undefined,
        includeMetadata: true
    })

    return data.matches
}


module.exports = {
    createMemory,
    queryMemory
}