import axios from "axios";
import {OpenAIInstruction} from "../models/OpenAIInstruction";

export const fetchOpenAIResponse = async (instruction: OpenAIInstruction): Promise<any> => {
    const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
    const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

    if (!OPENAI_API_KEY) {
        throw new Error("OpenAI API key is missing. Please check your environment variables.");
    }

    try {
        const response = await axios.post(
            OPENAI_API_URL,
            {
                model: "gpt-4o", // Use the latest or appropriate model
                messages: [{ role: "user", content: JSON.stringify(instruction) }],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
            }
        );

        // Validate and parse response
        if (response.data?.choices?.length > 0) {
            const content = response.data.choices[0].message.content;
            return JSON.parse(content);
        } else {
            throw new Error("Invalid response from OpenAI.");
        }
    } catch (error) {
        console.error("Error fetching OpenAI response:", error || "Details of Error not returned");
        throw error;
    }
};
