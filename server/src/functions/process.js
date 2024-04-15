const { app } = require("@azure/functions");
const { extraction_balance_pdf } = require("../process/extraction_balance_pdf");
const url = require("url");

app.http("process", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const pdfPath = request.query.get("pdfPath");

    if (!pdfPath) {
      context.res = {
        status: 400,
        body: "PDF path is required",
      };
      return;
    }

    const object = await extraction_balance_pdf(pdfPath);
    console.log("Object:", object);
    context.res = {
      status: 200,
      body: object,
    };
  },
});
