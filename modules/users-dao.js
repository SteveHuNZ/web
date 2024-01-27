const database = require("./database.js");

/**
 * Inserts the given user into the database. Then, reads the ID which the database auto-assigned, and adds it
 * to the user.
 *
 * @param user the user to insert
 */
async function createUser(user) {
    const db = await database;

    const result = await db.query(
        "insert into web_users (username, password, name) values (?, ?, ?)",
        [user.username, user.password, user.name]);

    // Get the auto-generated ID value, and assign it back to the user object.
    user.id = result.insertId;

    return user;
}

/**
 * Gets the user with the given id from the database.
 * If there is no such user, undefined will be returned.
 *
 * @param {number} id the id of the user to get.
 */
async function retrieveUserById(id) {
    const db = await database;

    const user = await db.query(
        "select * from web_users where id = ?",
        [id]);

    return await user[0];
}

/**
 * Gets the user with the given username and password from the database.
 * If there is no such user, undefined will be returned.
 *
 * @param {string} username the user's username
 * @param {string} password the user's password
 */
async function retrieveUserWithCredentials(username, password) {
    const db = await database;

    const user = await db.query(
        "select * from web_users where username = ? and password = ?",
        [username, password]);

    return user[0];
}

/**
 * Gets an array of all users from the database.
 */
async function retrieveAllUsers() {
    const db = await database;

    return db.query("select * from web_users");
}

/**
 * Updates the given user in the database.
 *
 * @param user the user to update
 */
async function updateUser(user) {
    const db = await database;

    await db.query(
        "update web_users set username = ?, password = ?, name = ? where id = ?",
        [user.username, user.password, user.name, user.id]);
}

/**
 * Deletes the user with the given id from the database.
 *
 * @param {number} id the user's id
 */
async function deleteUser(id) {
    const db = await database;

    await db.query("delete from web_users where id = ?", [id]);
}

// Export functions.
module.exports = {
    createUser,
    retrieveUserById,
    retrieveUserWithCredentials,
    retrieveAllUsers,
    updateUser,
    deleteUser
};
