const { app } = require("@azure/functions");
const { extraction_balance_pdf } = require("../process/extraction_balance_pdf");
const {
  extractionMaazanPdfSapirColleg,
} = require("../process/download_balance_pdf");

app.http("process", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const username = request.query.get("username");
    const password = request.query.get("password");

    //const pdfPath = await extractionMaazanPdfSapirColleg(username, password);
    const object = await extraction_balance_pdf(
      "downloads_balance/Jango117grades.pdf"
    );

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
