// Chiamata a Claude con uscita strutturata: JSON conforme a uno schema fisso (output_config.format).
// Nessun SDK: una fetch, così il fornitore si sostituisce in questo file.
// Lo schema inviato è volutamente semplice (niente minimi, pattern o anyOf, non supportati):
// i vincoli veri li controlla zod sull'uscita, e un'uscita non valida è un errore.

export type ToolSpec = { name: string; description: string; input_schema: Record<string, unknown> };
export type ToolCall = { system: string; user: string; tool: ToolSpec; maxTokens?: number };
export type ToolResult = { input: unknown; inputTokens: number; outputTokens: number };
export type ToolCaller = (call: ToolCall) => Promise<ToolResult>;

export const DEFAULT_MODEL = "claude-sonnet-5-5";

export function modelName(): string {
  return process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;
}

export function anthropicCaller(apiKey = process.env.ANTHROPIC_API_KEY, model = modelName()): ToolCaller {
  if (!apiKey) throw new Error("Manca ANTHROPIC_API_KEY in .env.local");
  return async ({ system, user, tool, maxTokens = 8192 }) => {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        system: `${system}\n\nCompito: ${tool.description}`,
        output_config: { format: { type: "json_schema", schema: tool.input_schema } },
        messages: [{ role: "user", content: user }],
      }),
    });
    if (!res.ok) {
      // Solo tipo e messaggio dell'errore: mai la richiesta, che contiene il testo del sopralluogo.
      let kind = "";
      try {
        const err = ((await res.json()) as { error?: { type?: string; message?: string } }).error;
        kind = `${err?.type ?? ""}: ${(err?.message ?? "").slice(0, 200)}`;
      } catch {}
      throw new Error(`Claude API: HTTP ${res.status} ${kind}`.trim());
    }
    const body = (await res.json()) as {
      content: Array<{ type: string; text?: string }>;
      stop_reason: string;
      usage: { input_tokens: number; output_tokens: number };
    };
    if (body.stop_reason === "max_tokens") throw new Error("Claude API: risposta troncata");
    const text = body.content.filter((b) => b.type === "text").map((b) => b.text ?? "").join("");
    let input: unknown;
    try {
      input = JSON.parse(text);
    } catch {
      throw new Error("Claude API: uscita non JSON");
    }
    return { input, inputTokens: body.usage.input_tokens, outputTokens: body.usage.output_tokens };
  };
}
