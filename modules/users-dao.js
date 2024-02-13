

const database = require("./database.js");
const bcrypt = require("bcrypt");

async function userExistsWithUsername(username) {
    const db = await database;

    const user = await db.query(
        "select username from lab_15_users where username = ?",
        [username]);

    return user.length > 0;
}
/**
 * Inserts the given user into the database. Then, reads the ID which the database auto-assigned, and adds it
 * to the user.
 *
 * @param user the user to insert
 */



async function createUser(user) {
    const db = await database;

    const result = await db.query(
        "insert into lab_15_users (username, password, name,description,birthday,avatar) values (?, ?, ?, ?, ?, ?)",
        [user.username, user.password, user.name,user.description, user.birthday, user.avatar]);

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
        "select * from lab_15_users where id = ?",
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
        "select * from lab_15_users where username = ?",
        [username]);

    if (user.length === 0) {
        return undefined;
    }

    let result = await bcrypt.compare(password, user[0].password);

    if (result === true) {
        return user[0];
    } else {
        return undefined;
    }
}

/**
 * Gets an array of all users from the database.
 */
async function retrieveAllUsers() {
    const db = await database;

    return db.query("select * from lab_15_users");
}

/**
 * Updates the given user in the database.
 *
 * @param user the user to update
 */
async function updateUser(user) {
    const db = await database;

    await db.query(
        "update lab_15_users set username = ?, password = ?, name = ?,description = ?, birthday = ?, avatar = ? where id = ?",
        [user.username, user.password, user.name,user.description, user.birthday, user.avatar, user.id]);
}

/**
 * Deletes the user with the given id from the database.
 *
 * @param {number} id the user's id
 */
async function deleteUser(id) {
    const db = await database;

    await db.query("delete from lab_15_users where id = ?", [id]);
}

async function updateUserName(user, name) {
    const db = await database;

    try {
        let result = await db.query("update lab_15_users set username = ? where id = ?", [name, user.id]);

        return result.rowsAffected !== 0;
    } catch (e) {
        return false;
    }
}

// Export functions.
module.exports = {
    createUser,
    retrieveUserById,
    retrieveUserWithCredentials,
    userExistsWithUsername,
    retrieveAllUsers,
    updateUser,
    deleteUser,
    updateUserName
};
