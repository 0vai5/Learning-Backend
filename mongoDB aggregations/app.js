import express from "express";
const app = express();
const PORT = 5000;
import mongoose from "mongoose";
import Author from "./models/author.model.js";
import Book from "./models/book.model.js";

const connection = mongoose
  .connect(
    process.env.MONGO_URI
  )
  .then((res) => console.log(`MongoDB Connected`))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post("/createAuthor", async (req, res) => {
    const { name, bio } = req.body;
    const author = new Author({ name, bio });
    await author.save();
    res.status(201).json(author);
});
app.post("/createBook", async (req, res) => {
    const { name, author } = req.body;
    const book = new Book({ name, author });
    await book.save();
    res.status(201).json(book);
});

app.get("/getBooks", async (req, res) => {
    const books = await Book.aggregate([
        {
            $lookup: {
                from: "authors",
                localField: "author",
                foreignField: "_id",
                as: "authorDetails",
            }
        }
    ]);
    res.status(200).json(books);
});

app.get("/getAuthors", async (req, res) => {
    const authors = await Author.aggregate([
        {
            $lookup: {
                from: "books",
                localField: "_id",
                foreignField: "author",
                as: "books"
            }
        }
    ]);

    res.status(200).json(authors)
})

app.listen(PORT, () => console.log(`Server Running on ${PORT}`));
