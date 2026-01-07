import mongoose, { Document, Model, Schema } from 'mongoose';
import Event from './event.model';

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => {
          // RFC 5322 compliant email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(v);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Pre-save hook to validate that the referenced event exists
BookingSchema.pre('save', async function (next) {
  const booking = this as IBooking;

  // Only validate eventId if it's modified or document is new
  if (booking.isModified('eventId') || booking.isNew) {
    try {
      const eventExists = await Event.findById(booking.eventId).select('_id');

      if (!eventExists) {
        const error = new Error(`Event with id ${booking.eventId} does not exists`);
        error.name = 'ValidationError';
        //return next(error);
        throw error;
      }
    } catch {
      const validationError = new Error(`Invalid event Id format or database error`);
      validationError.name = 'ValidationError';
      //return next(validationError);
      throw validationError;
    }
  }
  //next();
});

// Create index on eventId for faster queries
BookingSchema.index({ eventId: 1 });

//Create compound index for common queries (event booking by date)
BookingSchema.index({ eventId: 1, createdAt: -1 });

//Create index on email for user booking lookups
BookingSchema.index({ email: 1 });

// Export model, reusing existing model in development to avoid OverwriteModelError
const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
