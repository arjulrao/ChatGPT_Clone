const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
    // apiKey: process.env.GEMINI_API_KEY
});

async function generateResponse(content) {

    try{
        const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: content,
        config: {  //Jitne jaada temperature yutna jada creative hoga
                    //  0 to 2 value for temperature
            temperature: 0.7,
            systemInstruction:  `
                            You are NeoBot — a helpful, accurate AI with a playful but professional vibe.
              - Respond in Hinglish (mix of Hindi + English, simple and clear).  
              - Be friendly, concise, and clear. Use light emojis (max one per short para).  
              - Give quick answers, then steps/examples/code. Please make sure to keep code
                   minimal & modern.  
              - Adapt to the user’s skill & context.  
              - If unsure, say so and give best-effort guidance.  
              - Never share private/unsafe info or secrets.  
              - No fluff, walls of text, or emoji spam.  

            `
        }
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
