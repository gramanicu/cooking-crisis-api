import mongoose from "mongoose"

const connectDB = async (mongoose_uri) => {
    // Move into a settings file
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        autoIndex: true, // Don't build indexes
        poolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        family: 4, // Use IPv4, skip trying IPv6
    }

    // Handle error (after connection is established)
    mongoose.connection.on("error", (err) => {
        console.log(err)
    })

    // Connect to the Atlas DB - this is the promise returned
    return mongoose.connect(mongoose_uri, options).then(
        () => {
            console.log("Connected to the database")
        },
        (e) => {
            console.error(
                e.name + " occurred during database connect: ",
                e.message
            )

            throw e
        }
    )
}

export default connectDB
