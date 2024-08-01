# WhatsApp Personal AI Assistant

This project integrates a WhatsApp bot with Langchain and OpenAI gpt-4o-mini to provide intelligent responses to user messages. It uses the WhatsApp Web for messaging and it uses GPT-4o-mini for generating responses.

## Features

- WhatsApp integration using whatsapp-web.js
- QR code generation for easy WhatsApp Web authentication
- AI-powered responses using a langchain/openai
- Document loading and vectorization for enhanced AI context
- Persistent vector store for improved performance

## Installation

###  Clone the Repository

First, clone the repository to your local machine using the following command:

```
git clone https://github.com/RaheesAhmed/Personal-WhatsApp-Assistant.git
```

###  Navigate to the Project Directory
```
cd Personal-WhatsApp-Assistant
```

##  Install Packages

Install the required npm packages:

```
npm i
```

## Configuration

Ensure you have the necessary API keys and configuration set up for the OpenAI  API and WhatsApp Web client. These settings can typically be added in an environment configuration file (e.g., \`.env\`).

```
OPENAI_API_KEY=add your api key here
```
## Usage

### Run the Application

To start the application, run:

```
node index.js
```

2. Scan the generated QR code with your WhatsApp mobile app to authenticate.

3. Once authenticated, the bot will respond to incoming messages with AI-generated responses.

## Project Structure

- `index.js`: Main entry point for the WhatsApp bot
- `chat_with_assistant.js`: AI model integration and document processing
- `data/`: Directory for storing documents used for AI context
- `Data.index`: Persistent vector store for improved performance

## Customization

- To modify the AI's behavior, edit the system prompt in `chat_with_assistant.js`
- To add or remove supported document types, update the `DirectoryLoader` configuration in `chat_with_assistant.js`



## Troubleshooting

If you encounter any issues:

- Make sure your system meets the project requirements.
- Ensure that the necessary API keys and configurations are correctly set.
- Check the console for any error messages and follow the provided suggestions.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.
