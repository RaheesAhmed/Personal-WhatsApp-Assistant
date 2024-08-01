import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode-terminal";
import { runModel } from "./chat_with_assistant.js";

const client = new Client({
  puppeteer: {
    headless: true,
    args: ["--no-sandbox"],
  },
  authStrategy: new LocalAuth(),
  webVersionCache: {
    type: "remote",
    remotePath:
      "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2411.2.html",
  },
  authTimeoutMs: 60000, // Optional: timeout for authentication in milliseconds
  qrTimeout: 30000, // Optional: timeout for QR code generation
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("authenticated", () => {
  console.log("Client is authenticated!");
});

client.on("auth_failure", (msg) => {
  console.error("Authentication failure", msg);
});

client.on("message", async (msg) => {
  console.log("MESSAGE RECEIVED", msg);

  try {
    await client.sendSeen(msg.from);
    await client.sendPresenceAvailable();

    // // Indicate typing
    // await client.sendPresenceAvailable();
    // await client.sendMessage(msg.from, "_typing..._", { waitForAck: true });

    const response = await runModel(msg.body);
    console.log("RESPONSE", response);

    // Send the response
    await client.sendMessage(msg.from, response);
  } catch (error) {
    console.error("Error in generating assessment", error);
    await client.sendMessage(
      msg.from,
      "There was an error processing your request. Please try again later."
    );
  }
});

client
  .initialize()
  .then(() => {
    console.log("Client initialized successfully");
  })
  .catch((err) => {
    console.error("Error initializing client", err);
  });
