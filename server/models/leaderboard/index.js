import pkg from "mongoose"
const { Schema, model } = pkg

const leaderboardSchema = new Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        elo: {
            type: Number,
            required: true,
        }
    },
    { collection: "leaderboard" }
)

export default model("leaderboard", leaderboardSchema)
