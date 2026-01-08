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
            event = Object.fromEntries(formData.entries());
        }catch(err){
            console.error(err);
            return NextResponse.json({message:"Invalid json data fomat"}, {status:400});
        }

        const file = formData.get('image') as File;
        if(!file) return NextResponse.json({message:"Image file is required"},{status:400});
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({resource_type:'image', folder:'DevEvent'},(error, result) => {
                if(error) return reject(error);
                resolve(result);
            }).end(buffer);
        });

        event.image = (uploadResult as {secure_url:string}).secure_url;


        const createdEvent = await Event.create(event);

        return NextResponse.json({message:"Successfully created event", event: createdEvent}, {status:201});

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