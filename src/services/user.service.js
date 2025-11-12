const { db } = require("../db/index");
const { userTable } = require("../models/user.model");
const { eq } = require("drizzle-orm");

class UserService {
    async getUserByEmail(email) {
        const [doc] = await db
            .select({
                id: userTable.id,
                firstname: userTable.firstname,
                lastname: userTable.lastname,
                email: userTable.email,
                salt: userTable.salt,
                password: userTable.password
            })
            .from(userTable)
            .where(eq(userTable.email, email));

        return doc;
    }

    async createUser({ firstname, lastname, email, password, salt }) {
        console.log({ firstname, lastname, email, password, salt })
        const [user] = await db
            .insert(userTable)
            .values({
                firstname,
                lastname,
                email,
                password,
                salt,
            })
            .returning({
                id: userTable.id,
                firstname: userTable.firstname,
                lastname: userTable.lastname,
                email: userTable.email,
            });

        return user;
    }
}

module.exports = new UserService();
