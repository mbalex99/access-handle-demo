import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import greenlet from "greenlet";
import { PrimaryButton, SecondaryButton } from "../components/Buttons";


const Home = () => {
  const [logs, setLogs] = useState<any[]>([]);

  const [textAreaText, setTextAreaText] = useState<string>("");
  // for reading
  const [textFromReadingFile, setTextFromReadingFile] = useState<string>("");

  async function saveText() {
    const saveBackground = greenlet(async (text: string) => {
      // @ts-ignore
      const root = await navigator.storage.getDirectory();
      // Create a new file handle.
      const fileHandle = await root.getFileHandle("foo.txt", {
        create: true,
      });
      const accessHandle = await fileHandle.createSyncAccessHandle();
      const encoder = new TextEncoder();
      const writeBuffer = encoder.encode(text)
      accessHandle.write(writeBuffer, { "at" : 0 })
      await accessHandle.close();
    });
    await saveBackground(textAreaText);
    console.log('saved')
  }

  async function getTextFromFile() {
    const readFromBackground = greenlet(async () => {
      // @ts-ignore
      const root = await navigator.storage.getDirectory();
      // Create a new file handle.
      const fileHandle = await root.getFileHandle("foo.txt", {
        create: true,
      });
      const accessHandle = await fileHandle.createSyncAccessHandle();
      const fileSize = await accessHandle.getSize();
    
      const readBuffer = new ArrayBuffer(fileSize);
      accessHandle.read(readBuffer, { "at": 0 });
      const decoder = new TextDecoder();
      const view = new Uint8Array(readBuffer);
      const text = decoder.decode(view);
      console.log(`text read from disk`, text)
      await accessHandle.close();
      return text
    });
    const text = await readFromBackground()
    setTextFromReadingFile(text)
  }

  useEffect(() => {
    getTextFromFile();
  }, []);

  return (
    <React.Fragment>
      <Header title="Access Handle Demo" />
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 grid grid-cols-2 gap-4">
          <div>
            <h2>File Editor</h2>
            <textarea
              value={textAreaText}
              onChange={(e) => {
                setTextAreaText(e.currentTarget.value);
              }}
              className="resize-y w-full rounded-md bg-black text-white p-4"
            />
            <div className="grid grid-cols-2 gap-2">
              <PrimaryButton
                className="mb-3"
                onClick={() => {
                  saveText();
                }}
              >
                Save
              </PrimaryButton>
            </div>
          </div>
          <div>
            <h2>File Reader</h2>
            <p className="w-full rounded-md bg-black text-white p-4 mb-3 font-mono">
              {textFromReadingFile}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <PrimaryButton
                className="mb-3"
                onClick={() => {
                  getTextFromFile();
                }}
              >
                Read from File
              </PrimaryButton>
            </div>
          </div>
        </div>
      </main>
    </React.Fragment>
  );
};

export default Home;
