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
import { TextField, TextareaField } from "@/components/forms";
import { usePersistUpdateTeam } from "@/domain/team";
import {
  updateTeamSchema,
  type UpdateTeamFormData,
} from "@/schemas/team.schema";
import type { TeamSummaryVO } from "@/types/team";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: TeamSummaryVO;
}

const EditTeamDialog = ({ open, onOpenChange, team }: Props) => {
  const { updateTeam, isLoading, isSuccess } = usePersistUpdateTeam();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateTeamFormData>({
    resolver: zodResolver(updateTeamSchema),
    defaultValues: {
      name: team.name,
      description: team.description ?? "",
    },
  });

  useEffect(() => {
    reset({ name: team.name, description: team.description ?? "" });
  }, [team, reset]);

  useEffect(() => {
    if (isSuccess) onOpenChange(false);
  }, [isSuccess, onOpenChange]);

  const onSubmit = (data: UpdateTeamFormData) => {
    updateTeam({
      orgId: team.orgId,
      teamId: team.id,
      body: {
        name: data.name,
        description: data.description?.trim() ? data.description : null,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit team</DialogTitle>
          <DialogDescription>Update team name and description.</DialogDescription>
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

export default EditTeamDialog;
