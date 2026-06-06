"use client";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  Pagination as PaginationWrapper,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Props {
  totalPages: number;

  currentPage: number;
}

export function Pagination({
  totalPages,
  currentPage,
}: Props) {
  const router = useRouter();

  const pathname =
    usePathname();

  const searchParams =
    useSearchParams();

  const createPageURL = (
    page: number
  ) => {
    const params =
      new URLSearchParams(
        searchParams
      );

    params.set(
      "page",
      page.toString()
    );

    return `${pathname}?${params.toString()}`;
  };

  const pages = Array.from(
    { length: totalPages },
    (_, i) => i + 1
  );

  return (
    <PaginationWrapper>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={
              currentPage <= 1
                ? "#"
                : createPageURL(
                    currentPage - 1
                  )
            }
            className={
              currentPage <= 1
                ? "pointer-events-none opacity-50"
                : ""
            }
          />
        </PaginationItem>

        {pages.map((page) => (
          <PaginationItem
            key={page}
          >
            <PaginationLink
              href={createPageURL(
                page
              )}
              isActive={
                currentPage === page
              }
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {totalPages > 5 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            href={
              currentPage >=
              totalPages
                ? "#"
                : createPageURL(
                    currentPage + 1
                  )
            }
            className={
              currentPage >=
              totalPages
                ? "pointer-events-none opacity-50"
                : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationWrapper>
  );
}
