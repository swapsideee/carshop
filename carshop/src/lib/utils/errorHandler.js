export function ErrorHandler(handler) {
    return async function (...args) {
        try {
            return await handler(...args);
        }
        catch (err) {
            console.error("API Error:", err);
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
                { status: 500 }
            );
        }
    };
}
