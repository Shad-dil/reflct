"use client";
import { deleteCollection } from "@/actions/collection";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const DeleteCollectionDialog = ({ collection, entriesCount = 0 }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const {
    loading: isDeleting,
    data: deletedCollection,
    fn: deleteCollectionFn,
  } = useFetch(deleteCollection);

  useEffect(() => {
    if (deletedCollection && !isDeleting) {
      setOpen(false);
      toast.error(
        ` Collection ${collection.name} and all its entries is Deleted`
      );
      router.push("/dashboard");
    }
  }, [deletedCollection, isDeleting]);
  const handleDelete = () => {
    deleteCollectionFn(collection.id);
  };
  return (
    <div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete &quot;{collection.name}&quot;
            </AlertDialogTitle>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Are You Sure You Want To Delete?</p>
              <ul className="list-disc list-inside">
                <li>Collection &quot;{collection.name}&quot;</li>
                <li>
                  {entriesCount} journal{" "}
                  {entriesCount === 1 ? "entry" : "entries"}
                </li>
              </ul>
              <p className="text-red-600 font-semibold">
                This action can not be undone
              </p>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <Button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 "
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Collection"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteCollectionDialog;
