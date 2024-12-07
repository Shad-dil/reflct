"use client";
import { deleteJournal } from "@/actions/journal";
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

const DeleteCollectionDialog = ({ entryId }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const {
    loading: isDeleting,
    data: deletedJournal,
    fn: deleteJournalFn,
  } = useFetch(deleteJournal);

  useEffect(() => {
    if (deletedJournal && !isDeleting) {
      setOpen(false);
      router.push(
        `/collection/${
          deletedJournal.collectionId
            ? deletedJournal.collectionId
            : "unorganized"
        }`
      );
      toast.error(`Entry ${deletedJournal.name} is Deleted`);
    }
  }, [deletedJournal, isDeleting]);
  const handleDelete = () => {
    deleteJournalFn(entryId);
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
              Delete
              {/* &quot;{deletedJournal.name}&quot; */}
            </AlertDialogTitle>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Are You Sure You Want To Delete?</p>

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
              {isDeleting ? "Deleting..." : "Delete Entry"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteCollectionDialog;
