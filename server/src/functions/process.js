const { app } = require("@azure/functions");
const { extraction_balance_pdf } = require("../process/extraction_balance_pdf");
const {
  extractionMaazanPdfSapirColleg,
} = require("../process/download_balance_pdf");

app.http("process", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const textIn = request.query.get("pdfPath");

    if (!textIn) {
      context.res = {
        status: 400,
        body: "PDF path is required",
      };
      return;
    }

    const pdfPath = await extractionMaazanPdfSapirColleg(
      "Jango117",
      "aviG2445"
    );
    const object = await extraction_balance_pdf(pdfPath);

    if (object) {
      return (context.res = {
        body: JSON.stringify(object),
      });
    } else {
      context.res = {
        status: 404,
        body: "PDF not found",
      };
    }
  },
});
