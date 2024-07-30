import { AddDocumentButton } from "@/components/AddDocumentButton";
import { onGetDocuments } from "@/lib/actions/rooms.action";
import { Button } from "@/primitives/Button";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { DockIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const Home = async () => {
  const clerkUser = await currentUser()
  if (!clerkUser) redirect("/sign-in")

  const roomDocuments = await onGetDocuments(clerkUser.emailAddresses[0].emailAddress)
  
  return (
    <main className="home-container">
      <header className="sticky left-0 top-0">
        <div className="flex items-center gap-2 lg:gap-4">
          {/* TODO: Notifications */}
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>

      {roomDocuments?.data && roomDocuments.data.length > 0 ? (
        <div className="document-list-container">
          <div className="document-list-title">
            <h3 className="text-28-semibold">All Documents</h3>
            <AddDocumentButton
              userId={clerkUser.id}
              email={clerkUser.emailAddresses[0].emailAddress}
            />
          </div>
          <ul className="document-ul">
            {roomDocuments.data.map(({ id, metadata, createdAt }) => (
              <li key={id} className="document-list-iteù">
                <Link
                  href={`/document/${id}`}
                  className="flex flex-1 items-center gap-4"
                >
                  <div className="hidden rounded-md bg-gray-500 p-2 sm:block">
                    <DockIcon className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <p className="line-clamp-1 text-lg">{metadata.title}</p>
                    <p className="text-sm font-light text-blue-100">
                      {createdAt.toISOString()}
                    </p>
                  </div>
                </Link>
                {/* TODO: Delete Model */}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="document-list-empty">
          <DockIcon className="mx-auto w-10 h-10" />
          <AddDocumentButton
            userId={clerkUser.id}
            email={clerkUser.emailAddresses[0].emailAddress}
          />
        </div>
      )}
    </main>
  );
}

export default Home