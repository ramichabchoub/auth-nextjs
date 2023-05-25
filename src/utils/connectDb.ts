import mongoose from 'mongoose'

if (!process.env.DB_URI) {
  throw new Error('please add the database url to the .env.local file')
}

const DATABASE_URL: string = process.env.DB_URI

let globalWithMongoose = global as typeof globalThis & {
  mongoose: any
}

let cashed = globalWithMongoose.mongoose

if (!cashed) {
  cashed = globalWithMongoose.mongoose = { conn: null, promise: null }
}

async function connectDb() {
  if (cashed.conn) {
    return cashed.conn
  }
  if (!cashed.promise) {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
    }
    cashed.promise = mongoose
      .connect(DATABASE_URL, options)
      .then((mongoose) => {
        console.log('Connection has been established successfully.')

        console.log('mongodb db name:', mongoose.connection.name)
        console.log('mongodb host:', mongoose.connection.host)
        console.log('mongodb connection:', mongoose.connection.readyState)
        return mongoose
      })
      .catch((err) => {
        console.log(err as Error)
      })
  }
  cashed.conn = await cashed.promise
  return cashed.conn
}

export default connectDb

// import mongoose from 'mongoose'

// const DATABASE_URL: string | undefined = process.env.DB_URI

// const connectDb = async () => {
//   const options = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     bufferCommands: false,
//   }
//   mongoose.set('strictQuery', false)
//   await mongoose.connect(DATABASE_URL || '', options).then((conn) => {
//     console.log(`Database Connected: ${conn.connection.host}`)
//   })
// }

// export default connectDb
