const { app } = require("@azure/functions");
const { extraction_balance_pdf } = require("../process/extraction_balance_pdf");
app.http("process", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const object = await extraction_balance_pdf();
    return object;
  },
});
