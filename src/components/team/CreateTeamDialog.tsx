import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { TextField, TextareaField, SwitchField } from "@/components/forms";
import { usePersistCreateTeam } from "@/domain/team";
import {
  createTeamSchema,
  type CreateTeamFormData,
} from "@/schemas/team.schema";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orgId: string;
}

const CreateTeamDialog = ({ open, onOpenChange, orgId }: Props) => {
  const { createTeam, isLoading, isSuccess } = usePersistCreateTeam();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateTeamFormData>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: { name: "", description: "", isPrivate: false },
  });

  useEffect(() => {
    if (isSuccess) {
      onOpenChange(false);
      reset();
    }
  }, [isSuccess, onOpenChange, reset]);

  const onSubmit = (data: CreateTeamFormData) => {
    createTeam({
      orgId,
      body: {
        name: data.name,
        description: data.description?.trim() ? data.description : null,
        isPrivate: data.isPrivate,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create team</DialogTitle>
          <DialogDescription>
            Teams group related channels and members.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField
            label="Name"
            required
            error={errors.name?.message}
            {...register("name")}
          />
          <TextareaField
            label="Description"
            error={errors.description?.message}
            {...register("description")}
          />
          <Controller
            control={control}
            name="isPrivate"
            render={({ field }) => (
              <SwitchField
                fieldLabel="Private team"
                hint="Only invited members can see and join."
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
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
              {isLoading ? "Creating..." : "Create team"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTeamDialog;
