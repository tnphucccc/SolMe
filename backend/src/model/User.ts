import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the User document
interface IUser extends Document {
  name: string;
  email: string;
  publicKey?: string;
  privateKey?: string;
  userId: string;
  balance?: number;
}

// Define the schema for the User model
const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    publicKey: {
      type: String,
      required: false,
    },
    privateKey: {
      type: String,
      required: false,
    },
    userId: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      required: false,
    }
  },
  { collection: "Users", versionKey: false }
);

// Create and export the User model
const User = mongoose.model<IUser>('User', userSchema);
export default User;
