const express = require("express");
const { ensureAuthenticated } = require("../middlewares/auth.middlewares");
const {
    urlShortenReqBodyValidation,
} = require("../validations/url.validations");
const { db } = require("../db");
const { urlTable } = require("../models");
const { getNanoId } = require("../utils/nanoId");
const { eq } = require("drizzle-orm");
const router = express.Router();

router.post("/shorten", ensureAuthenticated, async (req, res) => {
    try {
        const validation = await urlShortenReqBodyValidation.safeParseAsync(
            req.body
        );

        if (!validation.success) throw Error("URL should be valid");

        const { url, code } = validation.data;

        const [doc] = await db
            .insert(urlTable)
            .values({
                code: code ?? getNanoId(),
                targetUrl: url,
                userId: req.user.id,
            })
            .returning({
                id: urlTable.id,
                code: urlTable.code,
                targetUrl: urlTable.targetUrl,
                userId: urlTable.userId,
            });

        res.status(201).json(doc);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message ?? "Something went wrong",
        });
    }
});

router.get("/:shortCode?", async (req, res) => {
    try {
        const { shortCode } = req.params;
        if (!shortCode) throw Error("Code is not there");

        const [doc] = await db
            .select({ targetUrl: urlTable.targetUrl })
            .from(urlTable)
            .where(eq(shortCode, urlTable.code));

        if (!doc) throw Error("Invalid code");
        res.redirect(doc.targetUrl);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message ?? "Something went wrong",
        });
    }
});

module.exports = router;
