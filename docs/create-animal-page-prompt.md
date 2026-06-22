# Tạo trang Animal

Chỉ nhập tên **một lần** — ngay sau `Animal:` trong block bên dưới. Copy block → gõ tên → paste vào Cursor.

```
Animal: Panda

Tạo trang animal hoàn chỉnh cho repo kids-facts — cùng quy trình và chất lượng như tiger, red-panda, lion.

Đọc tên loài từ dòng "Animal:" duy nhất ở trên. Tự suy ra slug, scientific name (GBIF), family/diet hub links.

Hub có sẵn (chỉ link nếu phù hợp, không tạo mới): /diets/carnivore, /families/felidae, /habitats/savanna, /conservation-status/vulnerable, /topics/social-animals.

## Quy tắc

### Ảnh — web-based, không tải local
- URL Wikimedia Commons trực tiếp (https://upload.wikimedia.org/...)
- KHÔNG download vào public/ hay assets/
- Verify URL qua Wikimedia API trước khi ghi
- Đúng loài 100%, không sculpture/stamp/PDF/ảnh loài khác
- Đủ 9 imageType: hero, habitat, diet, baby, family, range, size, closeup, fun-fact
- Alt 6–16 từ; caption 1 câu có 1 fact; đủ attribution

### Editorial
- Kid-friendly, chính xác sinh học
- Style: content/animals/tiger/, content/animals/red-panda/
- core.mdx: không frontmatter, 5 section H2
- pages/diet, habitat, behavior: frontmatter YAML đầy đủ (faq 4 câu)
- Không embed ảnh trong MDX

## Thực hiện (theo thứ tự, không hỏi confirm)

1. npm run create-animal -- <tên từ dòng Animal> --force

2. Tạo scripts/update-<slug>-images.mjs (copy scripts/update-tiger-images.mjs), curate 9 ảnh, chạy node scripts/update-<slug>-images.mjs

3. Viết editorial: animal.json, core.mdx, pages/diet.mdx, habitat.mdx, behavior.mdx

4. npm run content:validate → mục tiêu 9/9 images, 3/3 pages, core body, hero image

5. Báo cáo 9 ảnh (role → filename), warnings. Không commit trừ khi user yêu cầu.

Làm hết. Chỉ dừng hỏi user nếu sau 3 lần search vẫn không có ảnh đúng loài cho slot bắt buộc.
```

**Ví dụ:** dòng đầu thành `Animal: tiger` — không cần sửa chỗ nào khác.

Terminal (cùng một tên): `npm run create-animal -- tiger --force`
