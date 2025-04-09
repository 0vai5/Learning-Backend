import mongoose, {Schema} from "mongoose";

const bookSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "Author",
        required: true,
    }
});

const Book = mongoose.model("Book", bookSchema);
export default Book;