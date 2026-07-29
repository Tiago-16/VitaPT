export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { imageBase64, mediaType } = req.body;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: imageBase64 } },
          { type: 'text', text: 'Analisa esta imagem de comida. Responde APENAS em JSON sem markdown: {"name":"nome em português","qty":"quantidade estimada","kcal":numero,"prot":numero,"carb":numero,"fat":numero,"emoji":"emoji","confidence":"alta/media/baixa"} Se não for comida: {"error":"não é comida"}' }
        ]
      }]
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
