import axios from 'axios';

export async function chat(req, res, next) {
  try {
    const { message } = req.body;

    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3",
      prompt: message,
      stream: false,
    });

    res.json({ reply: response.data.response });
  } catch (err) {
    return next(err);
  }
}
