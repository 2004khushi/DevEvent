import mongoose, { Document, Model, Schema } from 'mongoose';

// TypeScript interface for Event document
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
        maxLength: [100, 'Title can not exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
        maxLength: [1000, 'Description can not exceed 1000 characters'],
    },
    overview: {
      type: String,
      required: [true, 'Overview is required'],
      trim: true,
        maxLength: [500, 'Overview can not exceed 500 characters'],
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    mode: {
      type: String,
      required: [true, 'Mode is required'],
      enum: {
          values: ['online', 'offline','hybrid'],
          message: 'Mode must be either online or offline or hybrid',
      },
    },
    audience: {
      type: String,
      required: [true, 'Audience is required'],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, 'Agenda is required'],
      validate: {
        validator: (v: string[]) =>  v.length > 0,
        message: 'Agenda must contain at least one item',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, 'Tags are required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'Tags must contain at least one item',
      },
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Pre-save hook for slug generation and data normalization
//pre('save') lets you run logic automatically BEFORE MongoDB saves the document.
EventSchema.pre('save', function (next) {

    //Why function and NOT arrow function? -> Because Mongoose needs this. -> this = the actual MongoDB document that is ABOUT TO BE SAVED to MongoDB
    const event = this as IEvent; //abe this matlb jo bhi vo naya data aaya hai(form) uski jo bhi attributes h that can accessed with help of this.date and this.organizer
    // and all to vahi this ko bas naam dediya event. baaki this is just pointing to that data.

    // Generate slug only if title changed or document is new
    if (event.isModified('title') || event.isNew) {
        event.slug = generateSlug(event.title);
    }

    // Normalize date to ISO format if it's not already
    if (event.isModified('date')) {
        event.date = normalizeDate(event.date);
    }

    // Normalize time format (HH:MM)
    if (event.isModified('time')) {
        event.time = normalizeTime(event.time);
    }

    //sab jagah ismodified isliye h ki agar midify kiya h kisine bichme to us ko this me daalke accoridngly change krdenge fir vo chij
    //On a new document, all fields are considered “modified”.
    // so u m8 be asking y explicitly writing .isNew check for lsug -> it's just for extra care bcs slug pe hi apni kaafi saari chije depnd krti h

});

// Helper function to generate URL-friendly slug
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')         // Replace spaces with hyphens
        .replace(/-+/g, '-')          // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, '');     // Remove leading/trailing hyphens
}

// Helper function to normalize date to ISO format
function normalizeDate(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
    }
    return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
}

// Helper function to normalize time format
function normalizeTime(timeString: string): string {
    // Handle various time formats and convert to HH:MM (24-hour format)
    const timeRegex = /^(\d{1,2}):(\d{2})(\s*(AM|PM))?$/i;
    const match = timeString.trim().match(timeRegex);

    if (!match) {
        throw new Error('Invalid time format. Use HH:MM or HH:MM AM/PM');
    }

    let hours = parseInt(match[1]);
    const minutes = match[2];
    const period = match[4]?.toUpperCase();

    if (period) {
        // Convert 12-hour to 24-hour format
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
    }

    if (hours < 0 || hours > 23 || parseInt(minutes) < 0 || parseInt(minutes) > 59) {
        throw new Error('Invalid time values');
    }

    return `${hours.toString().padStart(2, '0')}:${minutes}`;
}



//Create compound index for common queries
EventSchema.index({date:1, mode:1});
// date:1 and mode:1 means ki ascending order me wo date and mode save rkhega apne paas taaki jab apanko cahhiye vo easily find krke dede.
// eg usage -> Event.find({ date: "2025-04-10", mode: "online" })


// Export model, reusing existing model in development to avoid OverwriteModelError
const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema); //this again bcs of nextjs hmr problem that u give it whats already there or make new one

//:model<ievent> nhi tha usme

export default Event;
