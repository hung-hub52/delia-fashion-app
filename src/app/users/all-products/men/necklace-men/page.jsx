import { redirect } from "next/navigation";

export default function Page() {
  redirect("/users/all-products/collection/necklace-men");
  return null;
}
