import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

export default function Page() {
  let products = [];
  Object.values(collectionProducts).forEach(list => {
    products = products.concat(list.filter(p => p.gender.includes("women")));
  });

  return (
    <ProductsPage slug="women" title="Sản phẩm Nữ" products={products} />
  );
}
