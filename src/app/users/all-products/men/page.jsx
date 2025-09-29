import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

export default function Page() {
  let products = [];
  Object.values(collectionProducts).forEach(list => {
    products = products.concat(list.filter(p => p.gender.includes("men")));
  });

  return (
    <ProductsPage slug="men" title="Sản phẩm Nam" products={products} />
  );
}
