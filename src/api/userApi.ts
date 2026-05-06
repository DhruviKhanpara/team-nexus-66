import { baseApi } from "./baseApi";
import { MyDetailDTO } from "@/types/user";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMyDetails: build.query<MyDetailDTO, void>({
      query: () => "/user/me",
      // providesTags: ["Me"],
    }),
  }),
});

export const { useGetMyDetailsQuery } = userApi;
