import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import { Event } from '../../../../database';

type RouteParams = {
  params: Promise<{
    slug: string;
  }>
}


/**
 * GET /api/events/[slug]
 * Fetch a single events by its slug.
 */
export async function GET(_req: NextRequest, { params }: RouteParams):Promise<NextResponse> {
  try {

    await connectDB();
    const {slug} = await params;

    if (!slug || slug.trim() === '') {
      return NextResponse.json(
        { error: 'Missing required route parameter: slug' },
        { status: 400 }
      );
    }

    const sanitizedSlug = slug.trim().toLowerCase();

    const event = await Event.findOne({slug:sanitizedSlug}).lean();

    //Handle events not found
    if (!event) {
      return NextResponse.json(
        { error: `Event with slug '${sanitizedSlug}' not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(
        { message:'Event fetched successfully.', event: event },
        { status: 200 }
    );
  } catch (err) {

    //Log error for debugging
    if(process.env.NODE_ENV !== 'development') {
      console.error('Error fetching events by slug: ',err);
    }

    //Handle specific error types
    if(err instanceof Error) {
      if(err.message.includes('MONGODB_URI')) {
        return NextResponse.json(
            { message: 'DB config error' ,error:err.message},{status:500}
        );
      }

      return NextResponse.json(
          {message:'Error fetching events ',error:err.message},
          {status:500}
      )
    }

    //HANDLE unknown error
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
