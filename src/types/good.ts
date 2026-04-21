export interface SkuItem {
  sku_code: string;
  specs: Record<string, string>; // {"颜色":"红", "内存":"256G"}
  price: number;
  stock: number;
}