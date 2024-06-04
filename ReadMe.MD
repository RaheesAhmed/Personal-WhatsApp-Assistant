# OpenAI Assistant with WhatsApp Web

This project integrates OpenAI Assistant API with WhatsApp using the `whatsapp-web.js` library. Users can connect their WhatsApp to the OpenAI Assistant and interact with it seamlessly.

## Installation

### 1. Clone the Repository

First, clone the repository to your local machine using the following command:

```
git clone https://github.com/RaheesAhmed/openai-assistant-with-whatsapp-web.git
```

### 2. Navigate to the Project Directory

Move into the project directory:

```
cd openai-assistant-with-whatsapp-web
```

## 3. Install Packages

Install the required npm packages:

```
npm i
```
## Usage

### Run the Application

To start the application, run:


```
node web_chat.js
```

You will see a QR code in the console. Scan the QR code with your WhatsApp mobile app to establish the connection.

Once connected, you can send messages to your WhatsApp and get responses from the OpenAI Assistant.

## Project Structure

- \`web_chat.js\`: Main entry point of the application.
- \`chat_with_assistant.js\`: Contains the logic for interacting with the OpenAI Assistant API.

## Requirements

- Node.js
- npm

## Configuration

Ensure you have the necessary API keys and configuration set up for the OpenAI Assistant API and WhatsApp Web client. These settings can typically be added in an environment configuration file (e.g., \`.env\`).

## Features

- **WhatsApp Integration**: Connects WhatsApp to OpenAI Assistant.
- **Seamless Interaction**: Users can chat with the assistant directly from their WhatsApp.
- **Automatic Responses**: The assistant processes user messages and replies automatically.

## Troubleshooting

If you encounter any issues:

- Make sure your system meets the project requirements.
- Ensure that the necessary API keys and configurations are correctly set.
- Check the console for any error messages and follow the provided suggestions.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.
