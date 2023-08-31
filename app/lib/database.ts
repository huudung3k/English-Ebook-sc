import mongoose from 'mongoose';

const URI = process.env.MONGODB_URI

const connectMongo = async () => mongoose.connect(URI);

export default connectMongo;