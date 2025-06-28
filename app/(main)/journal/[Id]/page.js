import { getJournalEntry } from "@/actions/journal";
import { getMoodById } from "@/app/lib/moods";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import DeleteDialog from "./_components/DeleteDialog";
import EditButton from "./_components/EditButton";

const Page = async ({ params }) => {
  const { Id } = await params;
  const entry = await getJournalEntry(Id);
  const mood = await getMoodById(entry.mood);
  const moodColor = mood?.color || "gray";
  const moodLabel = mood?.label || "Unknown";
  return (
    <>
      <div className="space-y-6 p-4">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-5xl font-bold title-gradient mt-4">
                {entry.title}
              </h1>
              <p className="text-gray-500">
                Created {format(new Date(entry.createdAt), "PPP")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <EditButton entryId={Id} />
              <DeleteDialog entryId={Id} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {entry.collection && (
              <Link href={`/collection/${entry.collection.id}`}>
                <Badge>Collection: {entry.collection.name}</Badge>
              </Link>
            )}
            <Badge
              variant={"outline"}
              style={{
                backgroundColor: `var(--${moodColor}-50)`,
                color: `var(--${moodColor}-700)`,
                borderColor: `var(--${moodColor}-200)`,
              }}
            >
              Feeling : {moodLabel}
            </Badge>
          </div>
        </div>
        <hr />
        <div className="ql-snow">
          <div
            className="ql-editor"
            dangerouslySetInnerHTML={{ __html: entry.content }}
          />
        </div>
        <div className="text-sm text-gray-500 pt-4 border-t">
          Last updated {format(new Date(entry.updatedAt), "PPP 'at' p")}
        </div>
      </div>
    </>
  );
};

export default Page;
