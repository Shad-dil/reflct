"use client";

import { collectionSchema } from "@/app/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BarLoader } from "react-spinners";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const CollectionForm = ({ onSuccess, open, setOpen, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    onSuccess(data);
  });
  const isLoading = loading;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Collection</DialogTitle>
        </DialogHeader>
        {isLoading && <BarLoader color="orange" width={"100%"} />}
        <form onSubmit={onSubmit} className="space-y-2">
          <div className="space-y-2">
            <label className="text-sm font-md">Name</label>
            <Input
              {...register("name")}
              disabled={isLoading}
              placeholder="Enter Collection Name..."
              className={` ${errors?.name ? "border-red-500" : ""}`}
            />
            {errors?.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-md">Description</label>
            <Textarea
              {...register("description")}
              disabled={isLoading}
              placeholder="Enter Description"
              className={`py-5 md:text-md ${
                errors?.description ? "border-red-500" : ""
              }`}
            />
            {errors?.description && (
              <span className="text-red-500 text-sm">
                {errors?.description.message}
              </span>
            )}
          </div>
          <div className="flex justify-end gap-4">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="journal" type="submit">
              Create Collection
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CollectionForm;
