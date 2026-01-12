import { use } from "react";
import api from "@/lib/axios";
import Link from "next/link";

type Gig = {
  _id: string;
  title: string;
  description: string;
  owner: { name: string };
};

async function fetchGigs(): Promise<Gig[]> {
  const { data } = await api.get("/gigs");
  return data.gigs;
}

export default function HomePage() {
  const gigs = use(fetchGigs());

  return (
    <main className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Open Gigs</h1>
      <div className="space-y-4">
        {gigs.map((gig) => (
          <Link href={`/gigs/${gig._id}`}>
            <div
            key={gig._id}
            className="p-4 border rounded hover:shadow cursor-pointer"
          >
            <h2 className="text-xl font-semibold">{gig.title}</h2>
            <p className="text-gray-600">{gig.description}</p>
            <p className="text-sm text-gray-500 mt-1">
              Owner: {gig.owner.name}
            </p>
          </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
