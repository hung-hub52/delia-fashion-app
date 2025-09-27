import {
  nuItems,
  namItems,
  collectionSections as baseCollections,
} from "./menusForScript";
import { ImgIcon } from "@/utils/ImgIcon";

// Map thêm icon vào collection
export const collectionSections = baseCollections.map((section) => {
  let iconPath = "";
  switch (section.title) {
    case "Túi Xách":
      iconPath = "/icons/icons8-bag-100.png";
      break;
    case "Ví Da":
      iconPath = "/icons/icons8-wallet-100.png";
      break;
    case "Balo":
      iconPath = "/icons/icons8-backpack-100.png";
      break;
    case "Kính Mắt":
      iconPath = "/icons/icons9-glasses-100.png";
      break;
    case "Thắt Lưng":
      iconPath = "/icons/icons8-belt-100.png";
      break;
    case "Đồng Hồ":
      iconPath = "/icons/icons9-watches-front-view-100.png";
      break;
    case "Dây Chuyền":
      iconPath = "/icons/icons8-gold-necklace-100.png";
      break;
    case "Vòng Tay":
      iconPath = "/icons/icons8-bangles-gold 100.png";
      break;
    case "Khăn Lụa, Len":
      iconPath = "/icons/icons8-ninja-100.png";
      break;
    case "Mũ Nón":
      iconPath = "/icons/icons8-hat-man 100.png";
      break;
  }

  return {
    ...section,
    icon: ImgIcon(iconPath, section.title),
  };
});

export { nuItems, namItems };