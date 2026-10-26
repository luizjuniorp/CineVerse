const TMDB_API_BASE = "https://api.themoviedb.org/3";

const SUPPORTED_ROUTES = [
  /^movie\/(popular|top_rated|upcoming)$/,
  /^trending\/all\/week$/,
  /^search\/multi$/,
  /^(movie|tv)\/\d+$/,
  /^(movie|tv)\/\d+\/recommendations$/,
];

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Método não permitido." });
  }

  const route = Array.isArray(req.query.path)
    ? req.query.path.join("/")
    : req.query.path;

  if (typeof route !== "string" || !SUPPORTED_ROUTES.some((pattern) => pattern.test(route))) {
    return res.status(404).json({ error: "Rota do TMDB não permitida." });
  }

  const token = process.env.TMDB_READ_ACCESS_TOKEN;
  if (!token) {
    console.error("TMDB_READ_ACCESS_TOKEN não está configurado no ambiente do servidor.");
    return res.status(500).json({ error: "A integração com o catálogo não está configurada." });
  }

  try {
    const requestUrl = new URL(req.url, "http://localhost");
    requestUrl.searchParams.delete("path");
    const query = requestUrl.searchParams.toString();
    const response = await fetch(
      `${TMDB_API_BASE}/${route}${query ? `?${query}` : ""}`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const body = await response.text();

    res.setHeader("Content-Type", response.headers.get("content-type") || "application/json");
    return res.status(response.status).send(body);
  } catch (error) {
    console.error("Falha ao consultar a API do TMDB.", error);
    return res.status(502).json({ error: "Não foi possível conectar ao catálogo." });
  }
}
