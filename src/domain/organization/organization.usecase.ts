/**
 * Organization use case hooks — service layer.
 *
 * Pattern mirrors auth/user:
 *  - useHydrateX → fetch + map DTO→VO + push into Redux
 *  - useSelectX  → action dispatcher returned as a callback
 */

import { useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  useGetMyOrganizationsQuery,
  useGetOrganizationQuery,
} from "@/api/organizationApi";
import {
  mapOrgSummaryDtoToVO,
  mapOrgDetailDtoToVO,
} from "./organization.mapper";
import {
  setOrganizations,
  setSelectedOrgId,
} from "@/features/organizationSlice";

/**
 * Hydrate the list of organizations the current user belongs to.
 */
const useHydrateMyOrganizations = () => {
  const { data, isLoading, isFetching } = useGetMyOrganizationsQuery();
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

  // Reconcile persisted selectedOrgId against the freshly loaded list
  useEffect(() => {
    if (!data) return;
    if (
      selectedOrgId &&
      !organizations.some((o) => o.id === selectedOrgId)
    ) {
      dispatch(setSelectedOrgId(null));
    }
  }, [data, organizations, selectedOrgId, dispatch]);

  return { organizations, isLoading, isFetching };
};

/**
 * Hydrate a single organization detail by id.
 */
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

/**
 * Returns a callback to set the currently selected organization.
 */
const useSelectOrganization = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (orgId: string | null) => {
      dispatch(setSelectedOrgId(orgId));
    },
    [dispatch],
  );
};

export {
  useHydrateMyOrganizations,
  useHydrateOrganization,
  useSelectOrganization,
};
