'use server';

import connectDB from "@/lib/mongodb";
import {Booking} from "@/database";

export const createBooking = async ({eventId, email} : {eventId: string, email: string}) => {
    try{
        await connectDB();
        await Booking.create({eventId,email});


        return { success: true};

    }catch(err){
        console.error('create booking failed: ', err);
        return{success: false};
    }
}