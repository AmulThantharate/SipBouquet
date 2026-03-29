import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { drinks, recipientName, senderName } = body as {
      drinks: string[];
      recipientName: string;
      senderName: string;
    };

    const drinkList = drinks.join(', ');

    // Try Gemini API if key is available
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const prompt = `You are a warm, poetic gift message writer. Write a short, heartfelt message (2-3 sentences) for a digital coffee/matcha gift bouquet.

The sender "${senderName}" is gifting these drinks to "${recipientName}": ${drinkList}.

Rules:
- Keep it warm, personal, and sincere
- Reference the specific drinks naturally
- Add a cozy, aesthetic vibe
- Don't use generic phrases
- End with an emoji that fits the mood
- Keep it under 200 characters
- Return ONLY the message text, no quotes or extra formatting`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.8,
              maxOutputTokens: 200,
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const message =
          data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (message) {
          // Clean up any quotes the model might have added
          const cleaned = message.replace(/^["'`]+|["'`]+$/g, '');
          return Response.json({ message: cleaned });
        }
      }
    }

    // Fallback: generate a nice message locally
    const messages = [
      `Hey ${recipientName}, I thought of you today and picked out ${drinkList} — because every sip should remind you how wonderful you are. Enjoy it slowly and know you're loved. ☕💛`,
      `${recipientName}, here's a little warmth in a cup — ${drinkList}, handpicked just for you. May each sip feel like a gentle hug from afar. 🫶`,
      `To my dear ${recipientName}, pouring some love into your day with ${drinkList}. You deserve all the cozy moments in the world. Sip, smile, repeat. 🍵✨`,
      `${recipientName}! This ${drinkList} bouquet is my way of saying — you matter, you're amazing, and I hope today tastes as sweet as this gift. 💐☕`,
      `Sending you ${drinkList} wrapped in warmth and good vibes, ${recipientName}. Take a moment, breathe deep, and enjoy — you've earned it. 🌿💚`,
      `Dear ${recipientName}, I brewed this bouquet of ${drinkList} with extra care and all my love. Here's to you and all the little joys that make life beautiful. ☀️🧋`,
    ];

    const message = messages[Math.floor(Math.random() * messages.length)];
    return Response.json({ message });
  } catch (error) {
    console.error('Generate API error:', error);
    return Response.json(
      { error: 'Failed to generate message' },
      { status: 500 }
    );
  }
}
