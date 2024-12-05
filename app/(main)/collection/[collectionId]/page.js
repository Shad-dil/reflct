import { getSingleCollection } from "@/actions/collection";
import { getJournalEntries } from "@/actions/journal";
import DeleteCollectionDialog from "../_components/DeleteCollectionDialog";
import JournalFilter from "../_components/JournalFilter";

const CollectionPage = async ({ params }) => {
  const { collectionId } = await params;
  const entries = await getJournalEntries({ collectionId });
  const collection = await getSingleCollection({ collectionId });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between">
        <div className="flex justify-between">
          <h1 className="text-4xl font-bold title-gradient">
            {collectionId === "unorganized"
              ? "Unorganized Entry"
              : collection.name || "collection"}
          </h1>
          {collection && (
            <DeleteCollectionDialog
              collection={collection}
              entriesCount={entries.data.entries.length}
            />
          )}
        </div>
        {collection?.description && (
          <h2 className="font-extralight pl-1">{collection?.description}</h2>
        )}
      </div>
      <JournalFilter entries={entries.data.entries} />
    </div>
  );
};

export default CollectionPage;
