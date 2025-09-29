import { redirect } from "next/navigation";

export default function Page() {
  redirect("/users/all-products/collection/scarf-women");
  return null;
}
