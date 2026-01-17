import {NextRequest, NextResponse} from "next/server";
import {v2 as cloudinary} from 'cloudinary';
import connectDB from "@/lib/mongodb";
import {Event} from "@/database";

export async function POST(req:NextRequest) {
    try{
        await connectDB();

        const formData = await req.formData();

        let event;

        try{
            event = Object.fromEntries(formData.entries()); //.formEntries() -> Convert form fields → JS object and .entries() lets you loop through formData
        }catch(err){
            console.error(err);
            return NextResponse.json({message:"Invalid json data format"}, {status:400});
        }

        const file = formData.get('image') as File; //This file is a Web API File
        if(!file) return NextResponse.json({message:"Image file is required"},{status:400});

        const tags = JSON.parse(String(formData.get("tags")));
        const agenda = JSON.parse(String(formData.get("agenda")));

        // 🚨 CRITICAL FIX — remove bad string versions
        delete event.tags;
        delete event.agenda;


        const arrayBuffer = await file.arrayBuffer(); //convert webapi to 0s and 1s
        //Cloudinary is a Node.js library; Node.js does NOT understand web api file at all and does NOT understand ArrayBuffer well. AS Node.js expects: Buffer
        const buffer = Buffer.from(arrayBuffer); //Convert browser-style binary data into Node-style binary data.
        //Now: buffer is a Node.js Buffer; Cloudinary can stream it ; MongoDB / FS / AWS S3 can read it


        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({resource_type:'image', folder:'DevEvent'},(error, result) => {
                if(error) return reject(error);
                resolve(result);
            }).end(buffer);
        });

        event.image = (uploadResult as {secure_url:string}).secure_url;  //Replaces image: File with image: URL nd This is what you store in MongoDB


        const createdEvent = await Event.create({
            //.create() -> Shortcut for new Event(data) and then .save(). It pushes data to MongoDB.
            ...event,
            agenda,
            tags,
        });

        return NextResponse.json({message:"Successfully created events", event: createdEvent}, {status:201});

    }catch(e){
        console.log(e);
        return NextResponse.json({message:"Event Creation Failed", errors:e instanceof Error ? e.message : 'unknown'}, {status:500});
    }
}

export async function GET() {
    try{
        await connectDB();

        const events = await Event.find().sort({createdAt:-1});
        return NextResponse.json({message:"Successfully retrieved events", events}, {status:200});
    }catch(err){
        return NextResponse.json({message:"Event Fetching Failed",errors:err},{status:500});
    }
}


