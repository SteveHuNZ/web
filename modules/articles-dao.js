const database = require("./database.js");
const articlesDao = {
// task 1 create a article
    async createArticle(article) {
        const db = await database;
        const result = await db.query(
            'INSERT INTO web_articles (UserId, UserName, Title, Content, Hits, Comments) VALUES (?, ?, ?, ?, ?, ?)',
            [article.userId,article.userName, article.title, article.content, 0 , 0]
        );
        const articleId = result.insertId;
        return articleId;
    },

    async getAllArticles() {
            const db = await database;

            const articles = await db.query(
                'select * from web_articles'
            );

            return articles;
        },

    async getMyArticles(userId) {
        const db = await database;
        const articles = await db.query(
            'select * from web_articles as m, web_users as u where m.UserId = u.id and m.UserId = ?',
            [userId]
        );
        return articles;
    },
    async getArticleById(articleId) {
            const db = await database;
            const articles = await db.query(
                'select * from web_articles where Id = ?',
                [articleId]
            );
            return articles[0];//ONLY ONE RECORD.
        },

// 根据文章 ID 删除一条文章==>需要同时删除所有的相关评论和点赞【未处理】
    async deleteArticle(articleId) {
        const db = await database;

        const result = await db.query('DELETE FROM web_articles WHERE id = ?', [articleId]);

        return result.affectedRows > 0; // 如果删除了一行，则返回 true
    },

    async getUserIdByUsername(username) {
        const db = await database;
        const result = await db.query('SELECT id FROM web_users WHERE username = ?', [username]);
        return result.length > 0 ? result[0].id : null;
    },
};



module.exports = articlesDao;