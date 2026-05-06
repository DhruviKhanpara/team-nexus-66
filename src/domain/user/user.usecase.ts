import { useGetMyDetailsQuery } from "@/api/userApi";
import { useAppDispatch } from "@/app/store";
import { setUser } from "@/features/authSlice";
import { useEffect } from "react";
import { mapUserDtoToUserVO } from "./user.mapper";

const useHydrateMe = () => {
  const { data: user, isFetching } = useGetMyDetailsQuery();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      const userVo = mapUserDtoToUserVO(user);
      dispatch(setUser(userVo));
    }
  }, [user, dispatch]);

  return { isFetching, user };
};

export { useHydrateMe };
