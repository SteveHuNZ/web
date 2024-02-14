const database = require("./database.js");
const articlesDao = {
// task 1 create a article
    async createArticle(article) {
        const db = await database;
        const result = await db.query(
            'INSERT INTO lab_15_articles (UserId, UserName, Title, Content, Hits, Comments) VALUES (?, ?, ?, ?, ?, ?)',
            [article.userId,article.userName, article.title, article.content, 0 , 0]
        );
        const articleId = result.insertId;
        return articleId;
    },
    async modifyArticle(article) {
            const db = await database;
            const result = await db.query(
                'UPDATE lab_15_articles SET Title=?, Content=? WHERE Id=?',
                [article.title, article.content, article.id]
            );
            return true;
        },

    async getAllArticles() {
            const db = await database;

            const articles = await db.query(
                'select * from lab_15_articles'
            );

            return articles;
        },

    async getMyArticles(userId) {
        const db = await database;
        const articles = await db.query(
            'select * from lab_15_articles as m, lab_15_users as u where m.UserId = u.id and m.UserId = ?',
            [userId]
        );
        return articles;
    },
    async getArticleById(articleId) {
            const db = await database;
            const articles = await db.query(
                'select * from lab_15_articles where Id = ?',
                [articleId]
            );
            return articles[0];//ONLY ONE RECORD.
        },


    //depending id to delete article
    async deleteArticle(articleId) {
        const db = await database;
        await db.query('DELETE FROM lab_15_hits WHERE ArticleId = ?', [articleId]);
        await db.query('DELETE FROM lab_15_comments WHERE ArticleId = ?', [articleId]);
        await db.query('DELETE FROM lab_15_articles WHERE Id = ?', [articleId]);
        return true;
    },

    async getUserIdByUsername(username) {
        const db = await database;
        const result = await db.query('SELECT id FROM lab_15_users WHERE username = ?', [username]);
        return result.length > 0 ? result[0].id : null;
    },
};



module.exports = articlesDao;