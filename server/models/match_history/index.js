import pkg from "mongoose"
const { Schema, model } = pkg

const matchHistorySchema = new Schema(
    {
        game_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        player1_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        player2_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        isWinnerFirst: {
            type: Number,
            require: false
        },
        chatHistory: {
            type: Array,
            required: false
        }
    },
    { collection: "match_history" }
)

export default model("match_history", matchHistorySchema)
