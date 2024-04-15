const openai = require('openai');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

openai.apiKey = OPENAI_API_KEY;
