import { MyDetailDTO, MyDetailVO } from "@/types/user";

export const mapUserDtoToUserVO = (dto: MyDetailDTO): MyDetailVO => ({
  id: dto.id,
  email: dto.email,
  name: dto.name,
  iconUrl: dto.iconUrl,
});
