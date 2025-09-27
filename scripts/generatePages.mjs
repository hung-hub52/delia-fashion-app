// scripts/generatePages.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  nuItems,
  namItems,
  collectionSections,
} from "../src/data/menusForScript.js";
import { collectionProducts } from "../src/data/collections.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = path.join(__dirname, "../src/app/users/all-products");

// ---- Helpers ----
function getSlug(href) {
  return href.split("/").pop(); // vd: bag-men
}

// Map slug sang categoryKey (theo collections.js)
function getCategoryKey(slug) {
  if (slug === "balo" || slug.startsWith("balo")) return "balo";
  if (slug.startsWith("bag")) return "bag";
  if (slug.startsWith("wallet")) return "wallet";
  if (slug.startsWith("glasses")) return "glasses";
  if (slug.startsWith("belt")) return "belt";
  if (slug.startsWith("watch")) return "watch";
  if (slug.startsWith("necklace")) return "necklace";
  if (slug.startsWith("bracelet")) return "bracelet";
  if (slug.startsWith("scarf")) return "scarf";
  if (slug.startsWith("hat")) return "hat";

  throw new Error("❌ Không map được categoryKey cho slug: " + slug);
}

// ✅ Validate sản phẩm theo slug + gender
function validateProducts(slug, products, gender) {
  if (!products || products.length === 0) {
    console.error(`❌ ${slug} ERROR: Không có sản phẩm match`);
    process.exit(1);
  }

  if (gender) {
    const wrong = products.filter((p) => !p.gender.includes(gender));
    if (wrong.length > 0) {
      console.error(
        `❌ ${slug} ERROR: Có sản phẩm sai gender. Expect ${gender}, found:`,
        wrong.map((p) => `${p.id}:${p.gender}`)
      );
      process.exit(1);
    }
  }

  console.log(`✅ ${slug} OK (${products.length} sản phẩm)`);
}

// ✅ Trang cha (all products trong category)
function createCollectionPage(href, title, categoryKey) {
  const slug = getSlug(href);
  const dir = path.join(BASE, "collection", slug);
  fs.mkdirSync(dir, { recursive: true });

  const code = `import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

export default function Page() {
  return (
    <ProductsPage
      slug="${slug}"
      title="${title}"
      products={collectionProducts["${categoryKey}"]}
    />
  );
}
`;

  fs.writeFileSync(path.join(dir, "page.jsx"), code, "utf-8");

  // Validate cha
  validateProducts(slug, collectionProducts[categoryKey], null);
}

// ✅ Trang con (lọc theo gender + title)
// ✅ Trang con (lọc theo slug = key)
function createCollectionChildPage(href, title, categoryKey) {
  const slug = getSlug(href);
  const dir = path.join(BASE, "collection", slug);
  fs.mkdirSync(dir, { recursive: true });

  const code = `import ProductsPage from "@/components/users/ProductsPage";
import { collectionProducts } from "@/data/collections";

export default function Page() {
  let products = collectionProducts["${categoryKey}"] || [];
  // Lọc đúng theo key thay vì chỉ gender
  products = products.filter(p => p.key === "${slug}");

  return (
    <ProductsPage slug="${slug}" title="${title}" products={products} />
  );
}
`;

  fs.writeFileSync(path.join(dir, "page.jsx"), code, "utf-8");

  // Validate con (theo key luôn)
  let products = collectionProducts[categoryKey] || [];
  products = products.filter((p) => p.key === slug);
  validateProducts(slug, products, null);
}


// ✅ Redirect page
function createRedirectPage(gender, href, targetSlug) {
  const slug = getSlug(href);
  const dir = path.join(BASE, gender, slug);
  fs.mkdirSync(dir, { recursive: true });

  const code = `import { redirect } from "next/navigation";

export default function Page() {
  redirect("/users/all-products/collection/${targetSlug}");
  return null;
}
`;

  fs.writeFileSync(path.join(dir, "page.jsx"), code, "utf-8");
  console.log("➡️ Created redirect:", gender, slug, "->", targetSlug);
}

// ---- Generate ----
collectionSections.forEach((section) => {
  const parentSlug = getSlug(section.href);
  const parentCategoryKey = getCategoryKey(parentSlug);

  createCollectionPage(section.href, section.title, parentCategoryKey);

  section.items.forEach((item) => {
    const childSlug = getSlug(item.href);
    const childCategoryKey = getCategoryKey(childSlug);
    createCollectionChildPage(item.href, item.name, childCategoryKey);
  });
});

namItems.forEach((item) => {
  const targetSlug = getSlug(item.href);
  createRedirectPage("men", item.href, targetSlug);
});

nuItems.forEach((item) => {
  const targetSlug = getSlug(item.href);
  createRedirectPage("women", item.href, targetSlug);
});
