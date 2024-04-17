const { app } = require("@azure/functions");

const { mainProcess } = require("../process/mainProcess");

app.http("process", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    // const username = request.query.get("username");
    // const password = request.query.get("password");
    //const pdfPath = request.query.get("pdfPath");

    const result = await mainProcess();

    if (result) {
      return (context.res = {
        body: result,
      });
    } else {
      context.res = {
        status: 404,
        body: "PDF not found",
      };
    }
  },
});
