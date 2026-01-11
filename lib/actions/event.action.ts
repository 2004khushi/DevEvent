'use server';

import connectDB from "@/lib/mongodb";
import {Event} from "@/database";

export const getSimilarEventsBySlug = async(slug: string) => {
    try{
        await connectDB();
        const event = await Event.findOne({slug}); //yeto jo abhi upar dikhaare vo event h

        if (!event) {
            return [];
        }

        //ab me chaahri ke isme similar ka niche show hojaaye, to similar via tags pehchaanenge ki event me jo tags h usmese ek bhi matching tag kisi or me h to vo dikhaado
        return await Event.find({
            _id: { $ne: event._id },
            tags: { $in: event.tags }
        }).lean();

    }catch(err){
        console.error(err);
        return [];
    }
}