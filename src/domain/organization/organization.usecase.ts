/**
 * Organization use case hooks — service layer.
 */

import { useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  useGetMyOrganizationsQuery,
  useGetOrganizationQuery,
  useGetOrganizationMembersQuery,
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
} from "@/api/organizationApi";
import {
  mapOrgSummaryDtoToVO,
  mapOrgDetailDtoToVO,
  mapOrgMembersListDtoToVO,
} from "./organization.mapper";
import {
  setOrganizations,
  setSelectedOrgId,
} from "@/features/organizationSlice";
import type { CreateOrgDTO, UpdateOrgDTO } from "@/types/organization";

const useHydrateMyOrganizations = (options?: { skip?: boolean }) => {
  const { data, isLoading, isFetching } = useGetMyOrganizationsQuery(undefined, {
    skip: options?.skip,
  });
  const dispatch = useAppDispatch();
  const selectedOrgId = useAppSelector((s) => s.organization.selectedOrgId);

  const organizations = useMemo(
    () => (data ? data.map(mapOrgSummaryDtoToVO) : []),
    [data],
  );

  useEffect(() => {
    if (data) {
      dispatch(setOrganizations(organizations));
    }
  }, [data, organizations, dispatch]);

  // Reconcile persisted selectedOrgId; auto-select first if none set.
  useEffect(() => {
    if (!data) return;
    if (
      selectedOrgId &&
      !organizations.some((o) => o.id === selectedOrgId)
    ) {
      dispatch(setSelectedOrgId(organizations[0]?.id ?? null));
    } else if (!selectedOrgId && organizations.length > 0) {
      dispatch(setSelectedOrgId(organizations[0].id));
    }
  }, [data, organizations, selectedOrgId, dispatch]);

  return { organizations, isLoading, isFetching };
};

const useHydrateOrganization = (orgId: string | null) => {
  const { data, isLoading, isFetching } = useGetOrganizationQuery(
    orgId as string,
    { skip: !orgId },
  );

  const organization = useMemo(
    () => (data ? mapOrgDetailDtoToVO(data) : null),
    [data],
  );

  return { organization, isLoading, isFetching };
};

/** Members of an organization — used by people pickers (DMs, groups). */
const useHydrateOrganizationMembers = (
  orgId: string | null,
  options?: { search?: string; pageSize?: number },
) => {
  const { data, isLoading, isFetching } = useGetOrganizationMembersQuery(
    {
      orgId: orgId as string,
      query: {
        search: options?.search,
        pageSize: options?.pageSize ?? 100,
        pageNumber: 1,
      },
    },
    { skip: !orgId },
  );

  const members = useMemo(
    () => mapOrgMembersListDtoToVO(data).data,
    [data],
  );

  return { members, isLoading, isFetching };
};

const useSelectOrganization = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (orgId: string | null) => {
      dispatch(setSelectedOrgId(orgId));
    },
    [dispatch],
  );
};

const usePersistCreateOrganization = () => {
  const [createMutation, { isLoading, isSuccess }] =
    useCreateOrganizationMutation();
  const dispatch = useAppDispatch();

  const createOrganization = useCallback(
    async (body: CreateOrgDTO) => {
      try {
        const res = await createMutation(body).unwrap();
        if (res?.org?._id) {
          dispatch(setSelectedOrgId(String(res.org._id)));
        }
      } catch {
        /* errors toasted in baseApi */
      }
    },
    [createMutation, dispatch],
  );

  return { createOrganization, isLoading, isSuccess };
};

const usePersistUpdateOrganization = () => {
  const [updateMutation, { isLoading, isSuccess }] =
    useUpdateOrganizationMutation();

  const updateOrganization = useCallback(
    async (args: { orgId: string; body: UpdateOrgDTO }) => {
      try {
        await updateMutation(args).unwrap();
      } catch {
        /* errors toasted in baseApi */
      }
    },
    [updateMutation],
  );

  return { updateOrganization, isLoading, isSuccess };
};

export {
  useHydrateMyOrganizations,
  useHydrateOrganization,
  useHydrateOrganizationMembers,
  useSelectOrganization,
  usePersistCreateOrganization,
  usePersistUpdateOrganization,
};
