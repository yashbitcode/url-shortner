const express = require("express");
const { ensureAuthenticated } = require("../middlewares/auth.middlewares");
const {
    urlShortenReqBodyValidation,
} = require("../validations/url.validations");
const URLService = require("../services/url.service");
const router = express.Router();

router.post("/shorten", ensureAuthenticated, async (req, res) => {
    try {
        const validation = await urlShortenReqBodyValidation.safeParseAsync(
            req.body
        );

        if (!validation.success) throw Error("URL should be valid");

        const { url, code } = validation.data;

        const doc = await URLService.createShortenUrl(req.user.id, url, code);

        res.status(201).json({
            success: true,
            doc,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message ?? "Something went wrong",
        });
    }
});

router.get("/getAllUrls", ensureAuthenticated, async (req, res) => {
    try {
        const docs = await URLService.getAllSpecificUserUrls(req.user.id);
        res.json({
            success: true,
            codes: docs,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message ?? "Something went wrong",
        });
    }
});

router.delete("/:shortCode", ensureAuthenticated, async (req, res) => {
    try {
        const { shortCode } = req.params;
        const isAuthorized = await URLService.checkUrlAuthorization(
            req.user.id,
            shortCode
        );

        if (!isAuthorized) throw Error("You not authorized to delete this URL");

        await URLService.deleteShortenUrl(req.user.id, shortCode);

        res.json({
            success: true,
            message: "URL deleted successfully!",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message ?? "Something went wrong",
        });
    }
});

/* 
    update: 
        - code up.
        - url up.

    - to do so:
        - auth. check
    
    - payload:
        - oldCode, newCode?, url? 
*/

router.patch("/updateUrl",ensureAuthenticated, async (req, res) => {
    try {
        const { oldCode, newCode, url } = req.body;
        if(!oldCode) throw Error("Old code is needed");

        const isAuthorized = await URLService.checkUrlAuthorization(
            req.user.id,
            oldCode
        );
        
        if(!newCode && !url) throw Error("Either new code or url is needed");
        if (!isAuthorized) throw Error("You not authorized to update this URL"); 
        
        const doc = await URLService.updateShortenUrl(req.user.id, oldCode, {
            ...(newCode && {code: newCode}),
            ...(url && {targetUrl: url}),
        });

        res.json({
            success: true,
            doc,
            message: "URL updated successfully!",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message ?? "Something went wrong",
        });
    }
});

router.get("/:shortCode", async (req, res) => {
    try {
        const { shortCode } = req.params;

        const doc = await URLService.getShortenUrl(shortCode);
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
