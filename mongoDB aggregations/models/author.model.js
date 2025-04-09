import mongoose, {Schema} from "mongoose";

const authorSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        required: true,
    }
});

const Author = mongoose.model("Author", authorSchema);
export default Author;