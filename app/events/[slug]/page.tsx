import { Suspense } from "react";
import EventDetails from "@/app/events/[slug]/EventDetailsPage";


//Because this file is inside a folder named [slug], Next.js automatically injects the URL information into the component for you.
//In Next.js, params(async) is a reserved prop that contains the dynamic route segments.
export default function Page({params,}: { params: Promise<{ slug: string }>;
}) {
    return (

        <Suspense fallback={<div>Loading event…</div>}>
            <EventDetails params={params} />
        </Suspense>
    );
}
