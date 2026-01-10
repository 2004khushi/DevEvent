import mongoose from 'mongoose';

// Define the structure of our cached connection
interface MongooseCache {
  conn: typeof mongoose | null;   // Stores the actual active connection
  promise: Promise<typeof mongoose> | null;   // Stores the "handshake" process
}
// This keeps track of two things:
//                    1) The Connection (conn): Are we already connected?
//              2) The Promise (promise): Are we currently in the middle of connecting? (This prevents two different parts of your app from trying to connect at the exact same millisecond).




// the global object persists even when your code reloads.
declare global {
  var mongoose: MongooseCache | undefined;
}




// Retrieve MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;
// Validate that the MongoDB URI is defined
if (!MONGODB_URI) {
  throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
  );
}




// Initialize the cache on the global object to persist across hot reloads in development
// This prevents creating multiple connections during Next.js hot reloading
// By attaching our connection to global.mongoose, we "hide" it in a place where Next.js won't delete it during a hot reload.
let cached: MongooseCache = global.mongoose || {
  conn: null,
  promise: null,
};

if (!global.mongoose) {
  global.mongoose = cached; //now cached has conn and promise in it
}
//This looks at the global object. If a connection already exists from a previous reload, it uses it. If not, it creates a fresh empty object.




/**
 * Establishes and returns a cached MongoDB connection using Mongoose.
 * Reuses existing connections to avoid connection pool exhaustion.
 *
 * @returns {Promise<typeof mongoose>} The Mongoose instance with an active connection
 */
async function connectDB(): Promise<typeof mongoose> {

  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create a new connection promise if one doesn't exist
  if (!cached.promise) {
    if (!MONGODB_URI) {
      throw new Error(
          'Please define the MONGODB_URI environment variable inside .env.local'
      );
    }

    const opts = { bufferCommands: false, }; // Disable buffering to fail fast if not connected
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }


  try {
    cached.conn = await cached.promise; //pauses the function until the database "handshake" is successful.
  } catch (e) {
    // Reset the promise on connection failure to allow retry
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;




//and yes null and undefined is a literal type in here; is use for safety that if ntg there then they used (eg in starting of app start) so ts dont throw any error!


//MUST BE CONFUSED FOR LINE 38 TO 45 ->
// cached is like the tab you have open in your browser AND global.mongoose is the master link saved in your bookmarks.
//Even if you close your tab (let cached is destroyed on reload), the document still exists in the bookmarks (global). When you reopen the file, it checks the bookmarks first to see if the work was already started.
//
// "so cached itself means global.mongoose??"
// Yes! After those lines run, they are two different names for the same object.
// If you change cached.conn, global.mongoose.conn changes automatically because they are looking at the same thing.





//IF(!CACHED.PROMISE) ->
// Imagine two users visit your site at the exact same millisecond.
//
//     Without this: Your server would start two separate connection attempts to MongoDB.
//
//     With this: The first request sets cached.promise. When the second request arrives a millisecond later, it sees that a promise already exists and simply waits for that same promise to finish.


// BufferCommands: FALSE ->
// In a serverless function, you have a very short time to finish your task (usually 10–30 seconds).
//
// If bufferCommands is true: If your database is down or slow, your code won't throw an error immediately. It will just sit there waiting. Eventually, the Next.js function will "time out" and kill itself. You’ll get a generic "Task Timed Out" error, which is very hard to debug.
//
// If bufferCommands is false: If you aren't connected, Mongoose will throw an error immediately. You can catch that error and tell the user, "Database connection failed," instead of making them stare at a loading spinner for 30 seconds.