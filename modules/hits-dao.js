const database = require("./database.js");
const hitsDao = {
    async createLike(like) {
        const db = await database;
        const result = await db.query(
            'INSERT INTO lab_15_hits (ArticleId, UserId) VALUES (?, ?)',
            [like.articleId, like.userId]
        );
        //modify the comments numbers of the article comments area
        await db.query(
            'UPDATE lab_15_articles SET Hits = Hits+1 WHERE Id = ?',[like.articleId]
        );
        const likeId = result.insertId;
        return likeId;
    },
    async deleteLike(userId) {
            const db = await database;
            const result = await db.query(
                'DELETE FROM lab_15_hits WHERE UserId = ?', [userId]
            );
            return result.affectedRows > 0; // if delete the first row , return true
    }
};
module.exports = hitsDao;