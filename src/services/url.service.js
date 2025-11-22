const { eq, and } = require("drizzle-orm");
const { db } = require("../db");
const { urlTable } = require("../models");
const { getNanoId } = require("../utils/nanoId");

class URLService {
    async createShortenUrl(userId, url, code) {
        const [doc] = await db
            .insert(urlTable)
            .values({
                code: code ?? getNanoId(),
                targetUrl: url,
                userId,
            })
            .returning({
                id: urlTable.id,
                code: urlTable.code,
                targetUrl: urlTable.targetUrl,
                userId: urlTable.userId,
            });

        return doc;
    }

    async getShortenUrl(shortCode) {
        const [doc] = await db
            .select()
            .from(urlTable)
            .where(eq(shortCode, urlTable.code));

        return doc;
    }

    async getAllSpecificUserUrls(userId) {
        const docs = await db
            .select()
            .from(urlTable)
            .where(eq(userId, urlTable.userId));
        return docs;
    }

    async deleteShortenUrl(userId, code) {
        await db
            .delete(urlTable)
            .where(and(eq(userId, urlTable.userId), eq(code, urlTable.code)));
    }

    async checkUrlAuthorization(userId, code) {
        const doc = await this.getShortenUrl(code);

        if (!doc) throw Error("Invalid code");

        if (doc.userId !== userId) return false;
        return true;
    }

    async updateShortenUrl(userId, code, payload) {
        const [doc] = await db
            .update(urlTable)
            .set(payload)
            .where(and(eq(userId, urlTable.userId), eq(code, urlTable.code)))
            .returning({
                id: urlTable.id,
                code: urlTable.code,
                targetUrl: urlTable.targetUrl,
            });

        return doc;
    }
}

module.exports = new URLService();
