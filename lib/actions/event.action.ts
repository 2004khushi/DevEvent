'use server';

import connectDB from "@/lib/mongodb";
import {Event} from "@/database";

export const getSimilarEventsBySlug = async(slug: string) => {
    try{
        await connectDB();
        //First, you are fetching the specific event the user is currently looking at using its slug
        //therefore event becomes main event
        const event = await Event.findOne({slug}); //yeto jo abhi upar dikhaare vo event h

        if (!event) {
            return [];
        }

        return await Event.find({
            _id: { $ne: event._id }, //$ne = "Not Equal". show all similar events except itself
            tags: { $in: event.tags } //$in = IN. whatever tags of the main event are there if all those exist in similar event's tags too then give out that event
        }).lean();

    }catch(err){
        console.error(err);
        return [];
    }
}