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

// 根据文章 ID 删除一条文章==>需要同时删除所有与该文章相关评论和点赞【未处理】
    async deleteArticle(articleId) {
        const db = await database;
        await db.query('DELETE FROM lab_15_hits WHERE ArticleId = ?', [articleId]);
        await db.query('DELETE FROM lab_15_comments WHERE ArticleId = ?', [articleId]);
        await db.query('DELETE FROM lab_15_articles WHERE Id = ?', [articleId]);
        return true;

//        const result1 = await db.query('DELETE FROM lab_15_hits WHERE ArticleId = ?', [articleId]);
//        if(result1.affectedRows > 0){
//            const result2 = await db.query('DELETE FROM lab_15_comments WHERE ArticleId = ?', [articleId]);
//            if(result2.affectedRows > 0){
//                const result3 = await db.query('DELETE FROM lab_15_articles WHERE Id = ?', [articleId]);
//                if(result3.affectedRows > 0){
//                    return true;
//                }else{
//                    return false;
//                }
//            }else{
//                return false;
//            }
//        }else{
//            return false;
//        }
//        return false;
        // 如果删除了一行，result.affectedRows则返回 true
    },

    async getUserIdByUsername(username) {
        const db = await database;
        const result = await db.query('SELECT id FROM lab_15_users WHERE username = ?', [username]);
        return result.length > 0 ? result[0].id : null;
    },
};



module.exports = articlesDao;