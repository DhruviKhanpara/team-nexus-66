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
import { usePersistUpdateChannel } from "@/domain/channel";
import {
  updateChannelSchema,
  type UpdateChannelFormData,
} from "@/schemas/channel.schema";
import type { ChannelSummaryVO } from "@/types/channel";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channel: ChannelSummaryVO;
}

const EditChannelDialog = ({ open, onOpenChange, channel }: Props) => {
  const { updateChannel, isLoading, isSuccess } = usePersistUpdateChannel();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateChannelFormData>({
    resolver: zodResolver(updateChannelSchema),
    defaultValues: {
      name: channel.name,
      description: channel.description ?? "",
    },
  });

  useEffect(() => {
    reset({ name: channel.name, description: channel.description ?? "" });
  }, [channel, reset]);

  useEffect(() => {
    if (isSuccess) onOpenChange(false);
  }, [isSuccess, onOpenChange]);

  const onSubmit = (data: UpdateChannelFormData) => {
    updateChannel({
      orgId: channel.orgId,
      teamId: channel.teamId,
      channelId: channel.id,
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
          <DialogTitle>Edit channel</DialogTitle>
          <DialogDescription>
            Update the channel name and description.
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

export default EditChannelDialog;
