import ExploreBtn from "@/components/exploreBtn";
import {EventCard} from "@/components/EventCard";
import {IEvent} from "@/database";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Page = async () => {
    const response = await fetch(`${BASE_URL}/api/events`);
    const data = await response.json();
    const events: IEvent[] = data.events;

    return (
        <section>
            <h1 className="heading-1 text-center">The Hub for Every Dev <br /> Event You Can't Miss</h1>
            <p className="text-center mt-5">Hackathons, Meetups, and Conferences, All in One Place</p>

            <ExploreBtn/>

            <div className="mt-20 space-y-7">
                <h3 className="heading-3"> Featured Events </h3>

                <ul className="events">
                    {events.length > 0 ? (
                        events.map((event) => (
                            <li key={event.title}>
                                <EventCard {...event} />
                            </li>
                        ))
                    ) : (
                        <p>No events found</p>
                    )}
                </ul>
            </div>
        </section>
    )
}
export default Page
