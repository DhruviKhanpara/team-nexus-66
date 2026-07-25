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
import { usePersistUpdateOrganization } from "@/domain/organization";
import {
  updateOrganizationSchema,
  type UpdateOrganizationFormData,
} from "@/schemas/organization.schema";
import type { OrgSummaryVO } from "@/types/organization";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization: OrgSummaryVO;
}

const EditOrganizationDialog = ({ open, onOpenChange, organization }: Props) => {
  const { updateOrganization, isLoading, isSuccess } =
    usePersistUpdateOrganization();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateOrganizationFormData>({
    resolver: zodResolver(updateOrganizationSchema),
    defaultValues: { name: organization.name },
  });

  useEffect(() => {
    reset({ name: organization.name });
  }, [organization, reset]);

  useEffect(() => {
    if (isSuccess) onOpenChange(false);
  }, [isSuccess, onOpenChange]);

  const onSubmit = (data: UpdateOrganizationFormData) => {
    updateOrganization({ orgId: organization.id, body: data });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Organization settings</DialogTitle>
          <DialogDescription>Update your organization details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField
            label="Name"
            required
            error={errors.name?.message}
            {...register("name")}
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
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditOrganizationDialog;
