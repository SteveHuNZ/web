const database = require("./database.js");
const commentsDao = {
// task 1 create a article
    async createComment(comment) {
        const db = await database;

        const result = await db.query(
            'INSERT INTO lab_15_comments (ArticleId, ParentId, UserId, UserName, Content, ReplyNum) VALUES (?, ?, ?, ?, ?, ?)',
            [comment.articleId, comment.parentId, comment.userId, comment.userName, comment.content, comment.replyNum]
        );
        //修改评论数
        await db.query(
            'UPDATE lab_15_comments SET ReplyNum = ReplyNum+1 WHERE Id = ?',[comment.parentId]
        );
        //修改文章表里的评论数
        await db.query(
            'UPDATE lab_15_articles SET Comments = Comments+1 WHERE Id = ?',[comment.articleId]
        );

        const commentId = result.insertId;
        return commentId;
    },
    async getReplies(parentId) {
                const db = await database;
                const comments = await db.query(//只获取顶层评论
                    'select * from lab_15_comments where ParentId = ?', [parentId]
                );
                return comments;
            },
    async getAllComments(articleId) {
            const db = await database;
            const comments = await db.query(//只获取顶层评论
                'select * from lab_15_comments where ParentId = -1 and ArticleId = ?', [articleId]
            );
            return comments;
        },

    async getMyComments(userId) {
                const db = await database;
                const comments = await db.query(//获取我的所有评论和回复
                    'select * from lab_15_comments where UserId = ?', [userId]
                );
                return comments;
            },

// 删除一篇文章的所有评论
    async deleteAllComments(articleId) {
        const db = await database;
        const result = await db.query('DELETE FROM lab_15_comments WHERE ArticleId = ?', [articleId]);
//修改文章表里的评论数
        await db.query(
            'UPDATE lab_15_articles SET Comments = Comments-1 WHERE Id = ?',[articleId]
        );
        return result.affectedRows > 0; // 如果删除了一行，则返回 true
    },

    async deleteComment_3(parentId,commentId) {
        const db = await database;

        const result = await db.query('DELETE FROM lab_15_comments WHERE Id = ?', [commentId]);
        //修改评论数
                await db.query(
                    'UPDATE lab_15_comments SET ReplyNum = ReplyNum-1 WHERE Id = ?',[parentId]
                );
        return result.affectedRows > 0; // 如果删除了一行，则返回 true
    },
    async deleteComment_2(parentId,commentId) {
        const db = await database;
        const result = await db.query('DELETE FROM lab_15_comments WHERE Id = ? OR ParentId = ?', [commentId,commentId]);
        //修改评论数
                await db.query(
                    'UPDATE lab_15_comments SET ReplyNum = ReplyNum-1 WHERE Id = ?',[parentId]
                );
        return result.affectedRows > 0; // 如果删除了一行，则返回 true
    },
    async deleteComment_1(commentId) {
        const db = await database;
        const ids = await db.query('SELECT Id FROM lab_15_comments WHERE ParentId = ?', [commentId]);//2级评论的IDS集合
        ids.forEach(function(id){
            deleteComment_2(id);//删除2级评论的ID以及所有与其关联的记录
        });
        const result = await db.query('DELETE FROM lab_15_comments WHERE Id = ?', [commentId]);
        //1级评论，不需要修改评论数
        return result.affectedRows > 0; // 如果删除了一行，则返回 true
    },
};



module.exports = commentsDao;