import fs from "fs";
import express from "express";
import bookModel from "./models/bookModel.js";
import { addBook } from "./controllers/bookController.js";
const sampleBookFile = "./src/sample_books.json";
async function MaybeInitializeBookCollection(){
    const count = await bookModel.countDocuments().exec();
    if (count) return;
    try {
        const data = JSON.parse(fs.readFileSync(sampleBookFile, { encoding: "utf-8", flags: "r" }));
        data.forEach((it) => {
            const {
                isbn,
                title,
                author,
                published,
                pages,
                description,
            } = it;
            const req =
                  {
                      body: {
                          isbn,
                          title,
                          author,
                          published,
                          pages: pages.toString(),
                          description,
                      }
                  };
            
            const res = {status: () => {return {json: () => {}}}};
            addBook(req, res);
        });
        
    } catch (e) {
        console.log(e);
    }    
}
export default MaybeInitializeBookCollection;
