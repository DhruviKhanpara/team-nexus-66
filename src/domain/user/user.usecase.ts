import { useGetMyDetailsQuery } from "@/api/userApi";
import { useAppDispatch } from "@/app/store";
import { setUser } from "@/features/authSlice";
import { useCallback, useEffect } from "react";
import { mapUserDtoToUserVO } from "./user.mapper";

const useHydrateMe = (isAuthPage: boolean) => {
  const { data: user, isLoading } = useGetMyDetailsQuery(undefined, {
    skip: isAuthPage,
  });
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      const userVo = mapUserDtoToUserVO(user);
      dispatch(setUser(userVo));
    }
  }, [user, dispatch]);

  return { isLoading, user };
};

export { useHydrateMe };
