import { Schema, model } from "mongoose"
import { user_schema } from "../../constants/users"
import {
    leaderboard_schema,
    leaderboard_collection,
} from "../../constants/leaderboard"

const leaderboardSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: user_schema,
        required: true,
    },
    elo: {
        type: Number,
        required: true,
    },
})

export default model(
    leaderboard_schema,
    leaderboardSchema,
    leaderboard_collection
)
