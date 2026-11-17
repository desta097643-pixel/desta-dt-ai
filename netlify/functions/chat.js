
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({
        error: "POST method required"
      })
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const message = body.message;

    if (
      typeof message !== "string" ||
      !message.trim()
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Please enter a message"
        })
      };
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "AI key is not configured"
        })
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
            "You are Desta DT AI, a helpful multilingual AI assistant. Reply in the same language the user writes in. Support Amharic, English, Arabic, French and other languages. Be friendly, accurate and easy to understand.",
          input: message
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: data.error?.message || "AI request failed"
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
        error: "Something went wrong. Please try again."
      })
    };
  }
};
