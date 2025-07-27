import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: 'AIzaSyBb-jH-a2jFYTIXMR8fwTJaAbIkShFD-ec' });
export const AiFinder = async (req, res) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        const prompt = `You are a food request classifier. Analyze each user message to extract:
1. The core food item requested
2. The corresponding category from this predefined list:

- Vegetables  
- Fruits  
- Dairy  
- Beverages  
- Bakery  
- Snacks  
- Grains & Cereals  
- Meat & Seafood  
- Spices & Condiments  
- Ready-to-eat  
- Others  

**Important**:  
- Always return the **food item name in English**, even if the user mentions it in another language (e.g., Hindi like "tamatar" → "tomato", "doodh" → "milk").  
- Ignore non-food phrases, greetings, and general messages.
- If no food item is present, output null for both fields.

Return the output in this exact format:  
* Food Item: [name in English or null]  
* Category: [category or null]

---

### Examples:

User Input: "Can I get 2 liters of milk?"  
* Food Item: milk  
* Category: Dairy  

User Input: "I need a dozen bananas."  
* Food Item: bananas  
* Category: Fruits  

User Input: "I would like a bottle of Coke."  
* Food Item: Coke  
* Category: Beverages  

User Input: "Hi, just checking your service hours."  
* Food Item: null  
* Category: null  

User Input: "Order me a garlic naan and butter paneer."  
* Food Item: garlic naan  
* Category: Bakery  

User Input: "I want masala chips."  
* Food Item: masala chips  
* Category: Snacks  

User Input: "Add rice to the order."  
* Food Item: rice  
* Category: Grains & Cereals  

User Input: "Mujhe tamatar chahiye."  
* Food Item: tomato  
* Category: Vegetables  

User Input: "${query}"  

Fill in based on user input above in the format:  
* Food Item: ...  
* Category: ...
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                thinkingConfig: {
                    thinkingBudget: 0,
                },
            }
        });
console.log('AI Finder Response:', response.candidates[0].content.parts[0].text); 
        return res.status(200).json({ data: response.candidates[0].content.parts[0].text });
    } catch (error) {
        console.error('AI Finder Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}