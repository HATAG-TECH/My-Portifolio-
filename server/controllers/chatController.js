import { generateChatResponse, getConversationKey } from '../services/chatService.js';
import { saveChatRecord } from '../models/jsonStore.js';

export async function postChatMessage(req, res, next) {
  try {
    const { message, sessionId = '' } = req.body;
    const sessionKey = getConversationKey(req, sessionId);

    const result = generateChatResponse({ sessionKey, message });
    await saveChatRecord({
      sessionKey,
      message,
      reply: result.reply,
      ipAddress: req.ip,
    });

    return res.json({
      ok: true,
      reply: result.reply,
      meta: { memorySize: result.memorySize },
    });
  } catch (error) {
    return next(error);
  }
}
