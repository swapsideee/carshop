export function ErrorHandler(handler) {
  return async function (request, context) {
    try {
      return await handler(request, context);
    } catch (err) {
      console.error("API Error:", err);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
      });
    }
  };
}
