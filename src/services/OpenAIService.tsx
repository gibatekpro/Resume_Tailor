import axios from "axios";


export const fetchOpenAIResponse = async (prompt: string): Promise<any> => {

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

    try {
        const response = await axios.post(
            OPENAI_API_URL,
            {
                model: "gpt-4o-2024-08-06", // Replace with the desired model
                messages: [{ role: "user", content: prompt }],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
            }
        );

        // Returning JSON response
        return response.data;
    }catch (error) {
        console.error("Error fetching OpenAI response:", error);
        throw error;
    }
};