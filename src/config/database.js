const mongoose = require('mongoose');

// Use Mongoose default configuration
mongoose.set('bufferCommands', true);

const connectDB = async () => {
  try {
    const mongoURI = process.env.WS_MONGODB_URI;

    if (!mongoURI) {
      throw new Error('WS_MONGODB_URI is not defined in environment variables');
    }

    console.log('🔄 Attempting to connect to MongoDB...');
    
    // Clean up the URI - remove any malformed query parameters
    let finalMongoURI = mongoURI;
    
    // Remove any existing malformed query parameters (anything after ?)
    if (finalMongoURI.includes('?')) {
      finalMongoURI = finalMongoURI.split('?')[0];
    }
    
    // Add clean query parameters
    finalMongoURI += '?retryWrites=true&w=majority';
    
    console.log('🔗 Final MongoDB URI:', finalMongoURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    
    const conn = await mongoose.connect(finalMongoURI, {
      // Use Mongoose default timeout settings
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected successfully');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    // Don't exit - let the server continue without database
    throw error;
  }
};

module.exports = connectDB;
