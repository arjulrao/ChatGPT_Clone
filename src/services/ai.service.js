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

module.exports = {
    generateResponse
}