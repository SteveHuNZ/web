const database = require("./database.js");
const messagesDao = {
// task 1 create a message
    async createMessage(senderId, receiverId, content) {
        const db = await database;

        const result = await db.query(
            'INSERT INTO messages (sent_at, content, sender_id, receiver_id) VALUES (CURRENT_TIMESTAMP, ?, ?, ?)',
            [content, senderId, receiverId]
        );

// get the id which generated by database
        const messageId = result.insertId;

        return messageId;
    },

// task 2 find messages which send to the typical user
    // JSDoc - typehints
    /**
     *
     * @param userId {number}
     * @returns {Promise<Array<{sent_at, content, sender}>>}
     */
    async getReceivedMessages(userId) {
        const db = await database;

        const messages = await db.query(
            'select m.sent_at, m.content, u.username as sender from messages as m, web_users as u where m.sender_id = u.id and m.receiver_id = ?',
            [userId]
        );

        return messages;
    },

// 任务3：根据消息 ID 删除一条消息
    async deleteMessage(messageId) {
        const db = await database;

        const result = await db.query('DELETE FROM messages WHERE id = ?', [messageId]);

        return result.affectedRows > 0; // 如果删除了一行，则返回 true
    },

    async getUserIdByUsername(username) {
        const db = await database;
        const result = await db.query('SELECT id FROM web_users WHERE username = ?', [username]);
        return result.length > 0 ? result[0].id : null;
    },
};



module.exports = messagesDao;