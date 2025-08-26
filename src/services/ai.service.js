const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
    // apiKey: process.env.GEMINI_API_KEY
});

async function generateResponse(content) {

    try{
        const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: content,
    });
 
    return response.text;
    }catch(err){
        // console.log(err, "AI SERVICE")
        const response = "Can't generate Response"
        return response;
} 
}

async function generateVector(content) {

    const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: content,
        config: {
            outputDimensionality : 768
            // By defalut it create 368 that why we config 
        }
    });

    // return response.embeddings;
    return response.embeddings[0].values
}



module.exports = {
    generateResponse,
    generateVector
}