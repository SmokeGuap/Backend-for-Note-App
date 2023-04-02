import mongoose from 'mongoose';

export default async (dbHost) => {
  try {
    await mongoose.connect(dbHost, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB database');
  } catch (error) {
    console.error('Error connecting to MongoDB database', error);
  }
};
