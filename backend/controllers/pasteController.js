const { v4: uuidv4 } = require("uuid");
const PasteModel = require("../models/PasteModel");
const { validateCreatePaste } = require("../utils/validators");
const { getNow } = require("../utils/time");
const escapeHtml = require("../utils/escapeHtml");



const pasteController = {

    // ============================
    // POST /api/pastes
    // ============================
    createPaste: async (req, res) => {
        console.log("BODY:", req.body);
        try {
            const error = validateCreatePaste(req.body);
            if (error) {
                return res.status(400).json({ error });
            }

            const { content, ttl_seconds, max_views } = req.body;

            const id = uuidv4();
            const now = getNow(req);

            let expires_at = null;
            if (ttl_seconds !== undefined) {
                expires_at = new Date(now.getTime() + ttl_seconds * 1000);
            }

            await PasteModel.create({
                id,
                content,
                created_at: now,
                expires_at,
                max_views: max_views ?? null
            });

            return res.status(201).json({
                id,
                url: `${req.protocol}://${req.get("host")}/p/${id}`
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    // ============================
    // GET /api/pastes/:id
    // ============================

    getPasteApi: async (req, res) => {
        try {
            const { id } = req.params;

            // 1️⃣ Fetch paste
            const paste = await PasteModel.findById(id);
            if (!paste) {
                return res.status(404).json({ error: "Paste not found" });
            }

            const now = getNow(req);

            // 2️⃣ Check TTL expiry
            if (paste.expires_at && now > paste.expires_at) {
                return res.status(404).json({ error: "Paste expired" });
            }

            // 3️⃣ Check view limit
            if (
                paste.max_views !== null &&
                paste.view_count >= paste.max_views
            ) {
                return res.status(404).json({ error: "View limit exceeded" });
            }

            // 4️⃣ Increment view count
            await PasteModel.incrementView(id);

            // 5️⃣ Calculate remaining views
            let remaining_views = null;
            if (paste.max_views !== null) {
                remaining_views = paste.max_views - (paste.view_count + 1);
            }

            // 6️⃣ Send response (PDF EXACT)
            return res.status(200).json({
                content: paste.content,
                remaining_views,
                expires_at: paste.expires_at
                    ? paste.expires_at.toISOString()
                    : null
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    // ============================
    // GET /p/:id  (HTML)
    // ============================

    getPasteHtml: async (req, res) => {
        try {
            const { id } = req.params;

            const paste = await PasteModel.findById(id);
            if (!paste) {
                return res.status(404).send("Paste not found");
            }

            const now = getNow(req);

            // TTL check
            if (paste.expires_at && now > paste.expires_at) {
                return res.status(404).send("Paste expired");
            }

            // View limit check
            if (
                paste.max_views !== null &&
                paste.view_count >= paste.max_views
            ) {
                return res.status(404).send("View limit exceeded");
            }

            // Increment view
            await PasteModel.incrementView(id);

            const safeContent = escapeHtml(paste.content);

            return res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Paste</title>
        </head>
        <body>
          <pre>${safeContent}</pre>
        </body>
      </html>
    `);

        } catch (err) {
            console.error(err);
            return res.status(500).send("Internal server error");
        }
    }

};

module.exports = pasteController;
