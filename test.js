// Import document loaders for different file formats
const { DirectoryLoader } = require("langchain/document_loaders/fs/directory");
const { TextLoader } = require("langchain/document_loaders/fs/text");
const { CSVLoader } = require("langchain/document_loaders/fs/csv");
const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
const { DocxLoader } = require("langchain/document_loaders/fs/docx");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
// 2. Import OpenAI language model and other related modules
const { OpenAI } = require("@langchain/openai");
const { RetrievalQAChain } = require("langchain/chains");
const { HNSWLib } = require("@langchain/community/vectorstores/hnswlib");
const { OpenAIEmbeddings } = require("@langchain/openai");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { ChatMessageHistory } = require("langchain/stores/message/in_memory");

// Import dotenv for loading environment variables and fs for file system operations
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();

//Initialize the document loader with supported file formats
const loader = new DirectoryLoader("./data", {
  ".json": (path) => new JSONLoader(path),
  ".txt": (path) => new TextLoader(path),
  ".csv": (path) => new CSVLoader(path),
  ".pdf": (path) => new PDFLoader(path),
  ".docx": (path) => new DocxLoader(path),
});

// Load documents from the specified directory
async function load_docs() {
  console.log("Loading docs...");
  const docs = await loader.load();
  console.log("Docs loaded.");

  return docs;
}

const VECTOR_STORE_PATH = "Data.index";

// Define a function to normalize the content of the documents
function normalizeDocuments(docs) {
  return docs.map((doc) => {
    if (typeof doc.pageContent === "string") {
      return doc.pageContent;
    } else if (Array.isArray(doc.pageContent)) {
      return doc.pageContent.join("\n");
    }
  });
}

const openPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are Emely,a personal securitry of Rahees Ahmed.Rahees ahmed is experienece Backend Developer and AI Automation Engineer .You will recieve the messages from whatsapp if to the messages in roman urdu you are friendly and very kind. if you dont know the answer dont try to make up the answer,just say i am Emely personal Assistant for Rahees Ahmed kinldy share your details Sir will respond you latter. Answer the user's questions based on the below context:\n\n{context}`,
  ],
  ["human", "{question}"],
]);

const messageHistory = new ChatMessageHistory();
// Define the main function to run the entire process
const chat_with_assistant = async (question) => {
  //  Initialize the OpenAI language model
  const model = new OpenAI({
    temperature: 0.7,
    maxTokens: 300,
    modelName: "gpt-4o-mini",
  });

  let vectorStore;

  //  Check if an existing vector store is available
  console.log("Checking for existing vector store...");
  if (fs.existsSync(VECTOR_STORE_PATH)) {
    //  Load the existing vector store
    console.log("Loading existing vector store...");
    vectorStore = await HNSWLib.load(VECTOR_STORE_PATH, new OpenAIEmbeddings());
    console.log("Vector store loaded.");
  } else {
    //  Create a new vector store if one does not exist
    console.log("Creating new vector store...");
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });
    const docs = load_docs();
    const normalizedDocs = normalizeDocuments(docs);
    const splitDocs = await textSplitter.createDocuments(normalizedDocs);

    //  Generate the vector store from the documents
    vectorStore = await HNSWLib.fromDocuments(
      splitDocs,
      new OpenAIEmbeddings()
    );
    //  Save the vector store to the specified path
    await vectorStore.save(VECTOR_STORE_PATH);

    console.log("Vector store created.");
  }
  await messageHistory.addMessage({
    content: question,
    additional_kwargs: {},
  });

  const prompt = openPrompt;
  // Create a retrieval chain using the language model and vector store
  console.log("Creating retrieval chain...");
  const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(), {
    prompt: prompt,
    messageHistory: messageHistory,
  });

  // Query the retrieval chain with the specified question
  console.log("Querying chain...");
  const res = await chain.invoke({ query: question });
  console.log({ res });
  return res;
};

const question = "Who are you?";

response = chat_with_assistant(question);

module.exports = { chat_with_assistant };
