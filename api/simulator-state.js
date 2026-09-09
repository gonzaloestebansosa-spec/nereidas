// Vercel Serverless Function para sincronización de estado del simulador entre mobile y desktop
let cachedState = null;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      let data = req.body;
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }

      if (data && typeof data === 'object') {
        cachedState = {
          ...data,
          serverTimestamp: Date.now()
        };
        return res.status(200).json({
          ok: true,
          message: 'Estado guardado correctamente en servidor',
          timestamp: cachedState.serverTimestamp
        });
      } else {
        return res.status(400).json({ ok: false, error: 'Cuerpo de petición inválido' });
      }
    } catch (err) {
      console.error('Error al parsear estado en /api/simulator-state:', err);
      return res.status(500).json({ ok: false, error: err.message });
    }
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      hasData: Boolean(cachedState),
      state: cachedState
    });
  }

  return res.status(405).json({ ok: false, error: 'Método no permitido' });
};
