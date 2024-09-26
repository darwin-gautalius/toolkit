import { OAuth2Client } from "google-auth-library";
import { createServer, IncomingMessage, ServerResponse } from "http";
import open from "open";

(async () => {
  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar.readonly"],
    prompt: "consent", // This forces a new refresh token to be issued
  });

  await open(authUrl);
  const code = await listenToAuthCode();
  const { tokens } = await oauth2Client.getToken(code);

  if (tokens.refresh_token) {
    console.log("Refresh Token:", tokens.refresh_token);
    // You can save this refresh token securely for future use
  } else {
    console.log(
      "No refresh token received. The user might have already granted permission."
    );
  }
})();

async function listenToAuthCode(timeoutMs: number = 60000): Promise<string> {
  return new Promise((resolve, reject) => {
    const server = createServer();
    const port = new URL(process.env.GOOGLE_REDIRECT_URI!).port || 80;

    const timeoutId = setTimeout(() => {
      server.close();
      reject(new Error("Authentication timeout"));
    }, timeoutMs);

    server.on("request", (req, res) => {
      const code = getCodeFromUrl(req.url!);

      if (code) {
        sendSuccessResponse(res);
        clearTimeout(timeoutId);
        server.close();
        resolve(code);
      } else {
        sendErrorResponse(res);
        clearTimeout(timeoutId);
        server.close();
        reject(new Error("Authentication failed"));
      }
    });

    server.listen(port);
  });
}

function getCodeFromUrl(urlString: string) {
  // Ensure the urlString starts with 'http://' or 'https://'
  if (!urlString.startsWith("http://") && !urlString.startsWith("https://")) {
    urlString = process.env.GOOGLE_REDIRECT_URI! + urlString;
  }
  const urlObj = new URL(urlString);
  return urlObj.searchParams.get("code");
}

function sendSuccessResponse(res: ServerResponse) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(`
      <html>
        <body>
          <h1>Authentication successful!</h1>
          <p>You can close this window now and go back to the terminal.</p>
        </body>
      </html>
    `);
}

function sendErrorResponse(res: ServerResponse) {
  res.writeHead(500, { "Content-Type": "text/html" });
  res.end(`
    <html>
      <body>
        <h1>Authentication failed!</h1>
      </body>
    </html>
  `);
}
