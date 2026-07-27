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
import {
  TextField,
  TextareaField,
  SwitchField,
  SelectField,
} from "@/components/forms";
import { usePersistCreateChannel } from "@/domain/channel";
import {
  createChannelSchema,
  type CreateChannelFormData,
} from "@/schemas/channel.schema";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orgId: string;
  teamId: string;
}

const CreateChannelDialog = ({ open, onOpenChange, orgId, teamId }: Props) => {
  const { createChannel, isLoading, isSuccess } = usePersistCreateChannel();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateChannelFormData>({
    resolver: zodResolver(createChannelSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "text",
      isPrivate: false,
    },
  });

  useEffect(() => {
    if (isSuccess) {
      onOpenChange(false);
      reset();
    }
  }, [isSuccess, onOpenChange, reset]);

  const onSubmit = (data: CreateChannelFormData) => {
    createChannel({
      orgId,
      teamId,
      body: {
        name: data.name,
        description: data.description?.trim() ? data.description : null,
        type: data.type,
        isPrivate: data.isPrivate,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create channel</DialogTitle>
          <DialogDescription>
            Channels are where your team's conversations happen.
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
            name="type"
            render={({ field }) => (
              <SelectField
                label="Type"
                value={field.value}
                onValueChange={field.onChange}
                error={errors.type?.message}
                options={[
                  { label: "Text", value: "text" },
                  { label: "Announcement", value: "announcement" },
                ]}
              />
            )}
          />
          <Controller
            control={control}
            name="isPrivate"
            render={({ field }) => (
              <SwitchField
                fieldLabel="Private channel"
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
              {isLoading ? "Creating..." : "Create channel"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelDialog;
