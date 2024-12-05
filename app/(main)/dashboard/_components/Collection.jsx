"use client";

import { createCollection } from "@/actions/collection";
import CollectionForm from "@/components/CollectionForm";
import useFetch from "@/hooks/use-fetch";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CollectionPreview from "./CollectionPreview";

const Collection = ({ collections, entriesByCollection }) => {
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);
  const {
    data: createdCollection,
    loading: createCollectionLoading,
    fn: createCollectionFn,
  } = useFetch(createCollection);

  useEffect(() => {
    if (createdCollection) {
      setIsCollectionDialogOpen(false);

      toast.success(`Collection ${createdCollection.name} is created`);
    }
  }, [createdCollection]);
  const handleCreateCollection = async (data) => {
    createCollection(data);
  };
  if (collections.length === 0) return <></>;

  return (
    <section id="collection" className="space-y-6">
      <h2 className="font-bold text-3xl title-gradient">Collections</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <CollectionPreview
          isCreateNew={true}
          onCreateNew={() => setIsCollectionDialogOpen(true)}
        />

        {entriesByCollection?.unorganized?.length > 0 && (
          <CollectionPreview
            name="unorganized"
            entries={entriesByCollection?.unorganized}
            isUnorganized={true}
          />
        )}
        {collections.map((collection) => {
          return (
            <CollectionPreview
              key={collection.id}
              id={collection.id}
              name={collection.name}
              entries={entriesByCollection[collection.id] || []}
            />
          );
        })}

        <CollectionForm
          loading={createCollectionLoading}
          onSuccess={handleCreateCollection}
          open={isCollectionDialogOpen}
          setOpen={setIsCollectionDialogOpen}
        />
      </div>
    </section>
  );
};

export default Collection;
