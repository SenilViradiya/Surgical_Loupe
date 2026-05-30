import { getInventorySnapshot } from "@/lib/inventory/inventory-service";

interface Props {
  searchParams?: Promise<{
    updated?: string;
    error?: string;
  }>;
}

export default async function AdminInventoryPage({ searchParams }: Props) {
  const inventory = await getInventorySnapshot();
  const resolvedSearchParams = await searchParams;
  const updated = resolvedSearchParams?.updated === "1";
  const hasError = Boolean(resolvedSearchParams?.error);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Inventory</h1>

      {updated ? (
        <div role="status" className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Inventory updated successfully.
        </div>
      ) : null}

      {hasError ? (
        <div role="status" className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          Inventory update failed.
        </div>
      ) : null}

      <div className="overflow-auto rounded-md border">
        <table className="w-full table-auto text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Product ID</th>
              <th className="px-4 py-2 text-left">Available</th>
              <th className="px-4 py-2 text-left">Reserved</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Updated</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {inventory.frames.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">Frame</td>
                <td className="px-4 py-2">{item.productId}</td>
                <td className="px-4 py-2">{item.available}</td>
                <td className="px-4 py-2">{item.reserved}</td>
                <td className="px-4 py-2">{item.status}</td>
                <td className="px-4 py-2">{item.updatedAt}</td>
                <td className="px-4 py-2">
                  <form action="/api/admin/inventory/update" method="post">
                    <input type="hidden" name="type" value="FRAME" />
                    <input type="hidden" name="id" value={item.productId} />
                    <input className="w-20 rounded border px-2 py-1" name="quantity" defaultValue={item.quantity} />
                    <button className="ml-2 rounded bg-slate-800 px-3 py-1 text-white">Save</button>
                  </form>
                </td>
              </tr>
            ))}

            {inventory.lenses.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">Lens</td>
                <td className="px-4 py-2">{item.productId}</td>
                <td className="px-4 py-2">{item.available}</td>
                <td className="px-4 py-2">{item.reserved}</td>
                <td className="px-4 py-2">{item.status}</td>
                <td className="px-4 py-2">{item.updatedAt}</td>
                <td className="px-4 py-2">
                  <form action="/api/admin/inventory/update" method="post">
                    <input type="hidden" name="type" value="LENS" />
                    <input type="hidden" name="id" value={item.productId} />
                    <input className="w-20 rounded border px-2 py-1" name="quantity" defaultValue={item.quantity} />
                    <button className="ml-2 rounded bg-slate-800 px-3 py-1 text-white">Save</button>
                  </form>
                </td>
              </tr>
            ))}

            {inventory.headlights.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">Headlight</td>
                <td className="px-4 py-2">{item.productId}</td>
                <td className="px-4 py-2">{item.available}</td>
                <td className="px-4 py-2">{item.reserved}</td>
                <td className="px-4 py-2">{item.status}</td>
                <td className="px-4 py-2">{item.updatedAt}</td>
                <td className="px-4 py-2">
                  <form action="/api/admin/inventory/update" method="post">
                    <input type="hidden" name="type" value="HEADLIGHT" />
                    <input type="hidden" name="id" value={item.productId} />
                    <input className="w-20 rounded border px-2 py-1" name="quantity" defaultValue={item.quantity} />
                    <button className="ml-2 rounded bg-slate-800 px-3 py-1 text-white">Save</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
