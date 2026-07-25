import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/forms";
import { usePersistCreateOrganization } from "@/domain/organization";
import {
  createOrganizationSchema,
  type CreateOrganizationFormData,
} from "@/schemas/organization.schema";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateOrganizationDialog = ({ open, onOpenChange }: Props) => {
  const { createOrganization, isLoading, isSuccess } =
    usePersistCreateOrganization();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateOrganizationFormData>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: { name: "", slug: "" },
  });

  useEffect(() => {
    if (isSuccess) {
      onOpenChange(false);
      reset();
    }
  }, [isSuccess, onOpenChange, reset]);

  const onSubmit = (data: CreateOrganizationFormData) => {
    createOrganization(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create organization</DialogTitle>
          <DialogDescription>
            Create a new workspace for your team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField
            label="Name"
            required
            error={errors.name?.message}
            {...register("name")}
          />
          <TextField
            label="Slug"
            required
            hint="Lowercase letters, numbers and hyphens."
            error={errors.slug?.message}
            {...register("slug")}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrganizationDialog;
