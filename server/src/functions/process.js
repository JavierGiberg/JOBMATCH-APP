const { app } = require("@azure/functions");

const { mainProcess } = require("../process/mainProcess");

app.http("process", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const username = request.query.get("username");
    const password = request.query.get("password");
    const pdfPath = request.query.get("pdfPath");
    const usernameGitHub = request.query.get("usernameGitHub");
    const endPoint = request.query.get("endPoint");

    const result = await mainProcess(
      username,
      password,
      pdfPath,
      usernameGitHub,
      endPoint
    );

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
