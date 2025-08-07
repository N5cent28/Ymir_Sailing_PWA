import { sendMessage } from '../../chunks/database-postgres_A4NcQA_p.mjs';
export { renderers } from '../../renderers.mjs';

async function POST({ request }) {
  try {
    // Sample messages for testing
    const testMessages = [
      { from: '001', to: '002', message: 'Hey Jane! How was your sailing trip yesterday?' },
      { from: '002', to: '001', message: 'It was amazing! Perfect weather conditions. You should come next time!' },
      { from: '003', to: '001', message: 'John, are you free for a sailing session this weekend?' },
      { from: '004', to: '005', message: 'Charlie, I saw you out on the water today. Great form!' },
      { from: '005', to: '004', message: 'Thanks Alice! The wind was perfect for practicing my tacking.' },
      { from: '006', to: '007', message: 'Edward, do you want to join our group sailing trip next week?' },
      { from: '007', to: '006', message: 'Absolutely! What time are you planning to go out?' },
      { from: '008', to: '009', message: 'George, I noticed the Quest 2 needs some maintenance.' },
      { from: '009', to: '008', message: 'Thanks for the heads up, Fiona. I\'ll report it to the maintenance team.' },
      { from: '010', to: '001', message: 'John, congratulations on completing your 50th sailing trip!' }
    ];

    const createdMessages = [];

    // Create each message
    for (const msg of testMessages) {
      const messageId = await sendMessage(msg.from, msg.to, msg.message);
      createdMessages.push({
        id: messageId,
        from: msg.from,
        to: msg.to,
        message: msg.message
      });
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: `Created ${createdMessages.length} test messages`,
      messages: createdMessages
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Seed messages error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
