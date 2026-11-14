
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "POST only" })
    };
  }

  try {
    const { message } = JSON.parse(event.body || "{}");

    if (!message || !message.trim()) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Message is required" })
      };
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "AI key is not configured" })
      };
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-6-astra",
          instructions:
            "You are Desta DT AI, a helpful multilingual assistant. Reply in the same language the user uses. Support Amharic, English, Arabic, French, and other languages. Be friendly and clear.",
          input: message
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: "AI request failed"
        })
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        reply: data.output_text || "No response received."
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Something went wrong."
      })
    };
  }
};
