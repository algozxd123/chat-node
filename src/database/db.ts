import mongoose from 'mongoose';

export const setupDatabase = () => {
  const dbConnection = {
    url: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
  };

  if (process.env.NODE_ENV === 'development') {
    mongoose.set('debug', true);
  }

  mongoose.connect(dbConnection.url);
};
