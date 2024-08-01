import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { OpenAI } from "@langchain/openai";
import { RetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";

// Import dotenv for loading environment variables and fs for file system operations
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

//  Initialize the document loader with supported file formats
const loader = new DirectoryLoader("./data", {
  ".json": (path) => new JSONLoader(path),
  ".txt": (path) => new TextLoader(path),
  ".csv": (path) => new CSVLoader(path),
  ".pdf": (path) => new PDFLoader(path),
  ".docx": (path) => new DocxLoader(path),
});

// Load documents from the specified directory
console.log("Loading docs...");
const docs = await loader.load();
console.log("Docs loaded.");

const VECTOR_STORE_PATH = "Data.index";

//  Define a function to normalize the content of the documents
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
    `You are an AI trained to simulate the responses of Rahees Ahmed, a backend developer skilled in Node.js and Python with a deep focus on AI automation, API integration, REST API development, ChatGPT integration, custom trained chatbots, and web scraping. You are proficient in deploying AI capabilities within software applications to enhance user interactions and automate processes. Your responses should reflect expertise in these areas, offering technical advice, innovative solutions, and professional insight into developing robust AI-driven applications. You value precision, efficiency, and the practical application of emerging technologies to solve real-world problems. Your communication style is clear, concise, and focused, aimed at delivering valuable information and guidance to fellow developers and tech enthusiasts.You will recieve the messages from whatsapp if to the messages in roman urdu. if you dont know the answer dont try to make up the answer. always respond in short answers and  Answer the user's questions based on the below context:\n\n{context}`,
  ],
  ["human", "{question}"],
]);

const messageHistory = new ChatMessageHistory();
//  Define the main function to run the entire process
export const runModel = async (question, chatType) => {
  //  Initialize the OpenAI language model
  const model = new OpenAI({
    temperature: 0.7,
    maxTokens: 100,
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
    const normalizedDocs = normalizeDocuments(docs);
    const splitDocs = await textSplitter.createDocuments(normalizedDocs);

    //  Generate the vector store from the documents
    vectorStore = await HNSWLib.fromDocuments(
      splitDocs,
      new OpenAIEmbeddings()
    );
    // Save the vector store to the specified path
    await vectorStore.save(VECTOR_STORE_PATH);

    console.log("Vector store created.");
  }
  await messageHistory.addMessage({
    content: question,
    additional_kwargs: {},
  });

  //  Create a retrieval chain using the language model and vector store
  console.log("Creating retrieval chain...");
  const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(), {
    prompt: openPrompt,
    messageHistory: messageHistory,
  });

  //  Query the retrieval chain with the specified question
  console.log("Querying chain...");
  const res = await chain.invoke({ query: question });
  //console.log({ res });
  return res.text;
};

// const question = "who are you? ";

// await runModel(question);
