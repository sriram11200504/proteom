const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyDZqoD5-XRTJ5licp2qSMOuKJjo1pSLuR0');

async function analyzeSeverity(description, type) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      You are an emergency response AI. Analyze the incident report and categorize severity as LOW, MEDIUM, HIGH, or CRITICAL.
      
      Examples:
      - "Cat stuck in tree" -> LOW
      - "Car crash with injuries" -> HIGH
      - "Massive fire in building" -> CRITICAL
      - "Lost wallet" -> LOW

      Incident Type: ${type}
      Description: ${description}
      
      Return ONLY the category name.
    `;

        const result = await model.generateContent(prompt);
        const severity = result.response.text().trim().toUpperCase();

        const validSeverities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
        return validSeverities.includes(severity) ? severity : 'MEDIUM';
    } catch (error) {
        console.error('Gemini Error:', error.message);

        // Fallback if API fails
        const text = (description + ' ' + type).toLowerCase();
        if (text.includes('fire') || text.includes('explosion') || text.includes('gun') || text.includes('dead')) return 'CRITICAL';
        if (text.includes('accident') || text.includes('injury') || text.includes('blood')) return 'HIGH';
        if (text.includes('fight') || text.includes('theft')) return 'MEDIUM';
        return 'LOW';
    }
}

module.exports = { analyzeSeverity };
