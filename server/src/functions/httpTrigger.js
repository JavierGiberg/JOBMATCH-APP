const { app } = require("@azure/functions");
const extraction_balance_pdf = require("../process/extraction_balance_pdf");
app.http("httpTrigger", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const text = await extraction_balance_pdf();
    return { body: `Hello, ${text}!` };
  },
});
