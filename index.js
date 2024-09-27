const functions = require('@google-cloud/functions-framework');
const cors = require('cors');
const corsMiddleware = cors({ origin: true });
const fs = require('fs');
const path = require('path');

const { get_prompt } = require("./supabase/get_prompt");
const { text_to_ia } = require("./text_to_ia");

functions.http('ia_prescricao', async (req, res) => {
    corsMiddleware(req, res, async () => {
        try {
            if (!req.body.data || !req.body.data.key) {
                return res.status(400).json({ status: 0, erro: 'Parâmetro key não recebido' });
            }

            let json = {
                key: req.body.data.key
            }

            let prompt = await get_prompt();

            prompt = prompt.replace("[key]", json.key);
            let ia = await text_to_ia(prompt);  
            res.status(200).json({ status: 1, ia: ia });
        } catch (error) {
            console.error('Erro:', error);
            res.status(500).json({ status: 0, erro: error.message });
        }
    });
});