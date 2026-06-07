import { prisma } from "@/lib/prisma";

export async function assignDealer(
  pincode: string
) {
  try {
    const coverages =
      await prisma.dealerCoverage.findMany({
        where: {
          pincode,

          dealer: {
            isActive: true,
          },
        },

        include: {
          dealer: {
            include: {
              leads: {
                where: {
                  status: {
                    not: "CLOSED",
                  },
                },
              },
            },
          },
        },
      });

    if (
      coverages.length === 0
    ) {
      return null;
    }

    /*
      Smart balancing:
      assign dealer
      with lowest active leads
    */

    const sorted =
      coverages.sort(
        (a, b) =>
          a.dealer.leads
            .length -
          b.dealer.leads
            .length
      );

    return sorted[0].dealer;
  } catch (error) {


    return null;
  }
}
