# Agent Maintenance Notes — Pixel Marx

File này dành cho agent/dev đọc sau này để hiểu, chạy và bảo trì game **PIXEL MARX: DẤU CHÂN TRIẾT GIA**.

## 1. Mục tiêu sản phẩm

- Đây là sản phẩm sáng tạo MLN111 dạng web game 2D pixel.
- Trọng tâm không phải đồ họa AAA mà là **ánh xạ khái niệm triết học thành gameplay**:
  - Vật chất/ý thức → scan ảo ảnh để tìm lõi vật chất.
  - Lượng/chất → tích Bình Độ tới Điểm Nút rồi Bước Nhảy.
  - Mâu thuẫn → hai mặt đối lập Lửa/Băng vừa thống nhất vừa đấu tranh.
  - Phủ định của phủ định → boss 3 pha lặp lại trên nấc cao hơn.
  - Duy vật lịch sử → phát triển công cụ lao động, cải tạo quan hệ sản xuất lạc hậu, làm kiến trúc thượng tầng bảo thủ mất cơ sở duy trì.

## 2. Cách chạy

Không cần dependency.

```bash
python -m http.server 5173
```

Mở `http://localhost:5173`.

Có thể mở trực tiếp `index.html`, nhưng chạy qua local server vẫn tốt hơn khi demo.

## 3. Cấu trúc file

```text
index.html      # DOM shell, canvas, HUD, dialog box, knowledge modal
styles.css      # Pixel theme, responsive layout, HUD/modal styling
src/game.js     # Toàn bộ game engine, asset manifest, nội dung gameplay và knowledge data
assets/         # Texture/sprite CC0 lưu local + ATTRIBUTION.md
contents.md     # Bản đồ nội dung học thuật hiện tại trong game
README.md       # Hướng dẫn cho người dùng/nhóm thuyết trình
notes.md        # File này
.gitignore      # Ignore dependency/build/log/env/editor files
```

## 4. Kiến trúc `src/game.js`

Game được viết thuần JavaScript trong IIFE để tránh biến global.

Các phần chính:

- **Constants/state**:
  - `WIDTH`, `HEIGHT`, `GROUND_Y`, `GRAVITY`.
  - `state`: mode (`menu`, `playing`, `ending`), chapter, score, scene hiện tại.
  - `player`: vị trí, vận tốc, HP, cooldown, buff.
- **Assets**:
  - `ASSET_MANIFEST` map tên logic sang PNG local trong `assets/kenney/...`.
  - `loadAssets()` preload ảnh trước vòng lặp game; nếu ảnh lỗi thì chỉ cảnh báo và vẫn dùng fallback Canvas.
  - `drawImageAsset`, `drawTintedAsset`, `drawTiledAsset` là helper vẽ texture/pattern có fallback.
- **Input**:
  - `keys` lưu phím đang giữ.
  - `justPressed` lưu phím mới nhấn trong frame.
  - `consume([...])` dùng để xử lý hành động một lần.
- **Scene model**:
  - `makeScene()` tạo object có `platforms`, `enemies`, `bosses`, `pickups`, `cores`, `switches`, `gates`, `machines`, `projectiles`, `effects`, `slashes`, `local`.
  - Mỗi chapter tự thêm entity cần thiết vào scene.
- **Chapter registry**:
  - Mảng `chapters` chứa metadata và function hooks:
    - `setup(scene)`
    - `update(scene, dt)`
    - `skill(scene)`
    - `attack(scene, attackBox)`
    - `draw(scene)`
    - `skillValue(scene)` và `skillLabel(scene)` cho HUD.
    - `knowledge` chứa nội dung popup tổng kết học thuật sau màn (`title`, `concept`, `paragraphs`, `points`, `mapping`, `source`).
- **Knowledge popup**:
  - `index.html` có `#knowledgeModal` và các node title/concept/body/list/mapping/source.
  - `showKnowledgePopup(chapter)` render nội dung học thuật sau khi `markComplete(...)` mở portal.
  - `hideKnowledgePopup()` đóng popup; trong `updatePlaying(dt)`, khi popup đang mở, `E`/`Enter`/`Space`/`Escape` chỉ đóng popup và không xử lý gameplay frame đó.
- **Main loop**:
  - `gameLoop(timestamp)` chọn `updateMenu/drawMenu`, `updatePlaying/drawPlaying`, hoặc ending.
  - `updatePlaying(dt)` gọi input, physics, attack, skill, chapter update và generic entity update.

## 5. Thêm hoặc sửa chapter

1. Thêm object mới trong mảng `chapters` với title/concept/objective/tip/npc và hooks.
2. Viết các function `setupChapterX`, `updateChapterX`, `skillChapterX`, `attackChapterX`, `drawChapterX`.
3. Trong `setup`, thêm entity vào `scene`:
   - Enemy: `{ name, x, y, w, h, hp, maxHp, vx, minX, maxX, color, damage }`
   - Boss: `{ name, x, y, w, h, hp, maxHp, color, damage }`
   - Pickup: `{ kind, x, y, w, h }`
4. Khi điều kiện thắng đạt, gọi:

```js
markComplete('Lý do hoàn thành chương...');
```

5. Cổng nhận thức sẽ tự hiện ở bên phải; người chơi đứng vào và nhấn `E` để qua chương.
6. Nếu màn có nội dung học thuật mới, thêm/cập nhật object `knowledge` và đồng bộ lại `contents.md`.

## 6. Lưu ý gameplay hiện tại

- Game là MVP dạng arena/platformer-lite, không có tilemap dài.
- Đồ họa dùng Canvas thuần kết hợp texture/sprite CC0 local từ `assets/kenney/...`; rectangle fallback vẫn giữ để tránh hỏng demo nếu ảnh lỗi.
- Nguồn/license asset phải được cập nhật trong `assets/ATTRIBUTION.md` trước khi publish hoặc đem thuyết trình.
- Không có audio để tránh browser autoplay policy và rủi ro file ngoài.
- Không có lưu game; khi chết sẽ reload chương hiện tại.
- `contents.md` là nguồn đọc nhanh về nội dung học thuật hiện có; khi chỉnh triết học trong game phải cập nhật `contents.md` và `notes.md` cùng lúc.
- `notes.md`, `contents.md` và `README.md` đang cố tình giải thích rõ triết học để nhóm dùng khi thuyết trình.

## 7. Checklist debug nhanh

Nếu lỗi gameplay:

- Canvas trắng:
  - Kiểm tra `index.html` có load `src/game.js` đúng path.
  - Chạy `node --check src/game.js` để bắt lỗi syntax.
  - Nếu console báo ảnh lỗi, kiểm tra path trong `ASSET_MANIFEST`; game vẫn phải fallback được.
- Phím không hoạt động:
  - Kiểm tra browser focus đang ở trang, không phải DevTools.
  - Kiểm tra `keydown`/`keyup` có bị sửa mất `keys` hoặc `justPressed`.
- Không qua chương:
  - Đảm bảo chapter gọi `markComplete(...)`.
  - Đứng trong portal bên phải và nhấn `E`/`Enter`.
- Boss không mất máu:
  - Xem hook `attackChapterX(scene, attackBox)` của chapter đó.
  - Kiểm tra `overlap(attackBox, boss)` và shield condition.
- HUD không cập nhật:
  - Kiểm tra `skillValue`, `skillLabel`, và `updateHUD()`.
- Popup kiến thức không hiện/không đóng:
  - Kiểm tra `chapter.knowledge` có đủ field và `showKnowledgePopup(chapter)` được gọi trong `markComplete(...)`.
  - Kiểm tra `#knowledgeModal`, `#knowledgeClose` trong `index.html` và class `.knowledge-modal.is-visible` trong `styles.css`.
  - Đảm bảo khi popup mở, `updatePlaying(dt)` return sớm sau khi xử lý phím đóng popup.
- Nội dung học thuật lệch với game:
  - Đối chiếu `src/game.js` với `contents.md` và các nguồn trong `F:\tai lieu fpt ki 8\MLN111\tai lieu`.

## 8. Roadmap nếu phát triển thành bản lớn

Theo `F:\tai lieu fpt ki 8\plans.md`, có thể nâng cấp theo hướng:

1. Tách engine sang Phaser 3 + Vite.
2. Tách data chapter ra JSON/TypeScript config.
3. Thêm sprite sheet CC0 từ Kenney/OpenGameArt.
4. Thêm audio 8-bit và volume toggle.
5. Thêm save/load bằng localStorage trước, sau đó Supabase.
6. Thêm leaderboard và deploy Vercel.
7. Thêm mobile controls nếu demo trên điện thoại.

## 9. Quy ước khi agent khác chỉnh tiếp

- Giữ tiếng Việt có dấu cho nội dung game vì sản phẩm nộp môn bằng tiếng Việt.
- Khi thêm khái niệm triết học, luôn gắn với một hành động gameplay cụ thể.
- Tránh thêm dependency nếu chưa thật cần; MVP hiện tại chạy không cần build.
- Nếu migrate sang framework, giữ lại README/notes hoặc cập nhật đường dẫn tương ứng.
- Sau mỗi thay đổi lớn, chạy syntax check và test thủ công ít nhất một vòng qua các chương.

## 10. Nhật ký cập nhật nội dung

### 2026-06-08 — Chế độ đồ họa + polish combat kiếm

- Thêm tùy chỉnh chất lượng đồ họa trong menu: `Cao` giữ nguyên hiệu ứng, `Thấp` giảm animation/overlay để máy yếu chơi mượt hơn.
- Lưu lựa chọn đồ họa bằng `localStorage` với key `pixelMarxGraphicsQuality`; nếu người chơi chưa chọn, game tự gợi ý `Thấp` trên thiết bị yếu/mobile/reduced motion/mạng chậm.
- Low graphics mode giảm tải Canvas/CSS: giảm sao nền, bỏ decor grid, bỏ overlay gradient nặng, bỏ screen shake, giảm shadow chữ, đơn giản hóa effects, pickup bob, portal pulse và platform highlights.
- Sửa lỗi tiếng Việt có dấu ở màn 5 cho các cụm như `KIẾN TRÚC THƯỢNG TẦNG`, `LASER CƯỠNG CHẾ`, `Quan hệ SX cải tạo`, `Linh thạch` và popup liên quan cơ sở hạ tầng/quan hệ sản xuất/thượng tầng.
- Polish đòn `J`: bỏ slash/hitbox dạng ô vuông debug, chuyển sang kiếm cầm trên tay có afterimage theo lưỡi kiếm; logic `attackBox` vẫn giữ nguyên để không ảnh hưởng gameplay.
- Khi dùng kỹ năng `K` rồi chém, bỏ hiệu ứng ô vuông tầm đánh còn sót lại trong `attackChapter1`; hit chỉ tạo screen shake nhẹ ở đồ họa cao.
- Thu nhỏ sprite kiếm thành kiểu katana: lưỡi ngắn hơn, mảnh hơn, chuôi/guard nhỏ hơn; các function liên quan là `drawEquippedSword()`, `drawSwordAfterimage()`, `drawHeldSwordSprite()` và `drawSwordBladeOnly()` trong `src/game.js`.
- Tạo DOCX nộp bài `Gioi_thieu_SPST_MLN111_Pixel_Marx.docx` bằng `python-docx`, toàn bộ Times New Roman, nội dung giới thiệu SPST kèm link web `https://mln111philosophertrail.vercel.app/`.
- Kiểm thử sau chỉnh sửa: `node --check src/game.js` pass, không có output.

### 2026-06-08 — Tối ưu hiệu năng UI/game

- Bước 1: Đã đọc `README.md` và `notes.md` để nắm mục tiêu giữ nguyên UI/UX, kiến trúc Canvas thuần, quy ước cập nhật tài liệu và các điểm debug nhanh.
- Bước 2: Khảo sát `styles.css` và `src/game.js`; nguyên nhân lag chính là HUD DOM bị ghi lại mỗi frame, hiệu ứng CSS giữ compositor quá nhiều phần tử và Canvas vẽ lại tile nền/platform bằng nhiều lệnh drawImage mỗi frame.
- Bước 3: Tối ưu `src/game.js` bằng cache DOM write cho HUD, chỉ cập nhật text/width khi giá trị đổi; thêm cache pattern/tile nền Canvas để giảm số lệnh vẽ lặp lại nhưng giữ nguyên giao diện.
- Bước 4: Tối ưu `styles.css` nhẹ tay: bỏ `will-change` thường trực khỏi HUD card/knowledge section, giảm blur modal về mức ban đầu và giữ hover knowledge section không dịch chuyển layout; UI/UX trực quan vẫn như bản refresh.
- Bước 5: Kiểm thử bằng `node --check src/game.js` đã pass; `git diff` cho thấy chỉ chạm vào cache render/HUD và giảm overhead CSS, không đổi cấu trúc UI.

### 2026-06-05 — Đổi boss màn 5 sang boss bay + trụ

- Bỏ spawn `Drone luật lệ` ở màn 5 để tránh lính dồn sát thương khi người chơi đang né chiêu boss.
- Đổi boss `Thượng tầng Bảo thủ` sang bay trên cao theo quỹ đạo ngang/dọc, chủ yếu tạo áp lực bằng laser và đạn nảy.
- Thêm `Linh thạch Cơ sở hạ tầng` ở cuối map làm mục tiêu thắng: người chơi phải vừa né chiêu tầm xa vừa đánh gần để phá trụ.
- Tăng độ đậm laser, tăng tần suất laser, tăng số lượng đạn và tăng bounce của đạn thêm một nấc so với bản trước.

### 2026-06-05 — Làm rõ chuyển động boss màn 5

- Tăng tốc và mở rộng biên di chuyển ngang của boss màn 5 để người chơi nhìn rõ boss không còn đứng yên.
- Thêm cache-busting query cho `src/game.js` trong `index.html` để trình duyệt tải bản script mới sau khi chỉnh boss.
### 2026-06-05 — Tăng độ khó boss màn 5

- Giữ nguyên thông điệp học thuật của màn 5 về duy vật lịch sử, lực lượng sản xuất, quan hệ sản xuất và kiến trúc thượng tầng.
- Nâng boss `Thượng tầng Bảo thủ` trong `src/game.js`: tăng máu, tăng điểm thưởng, thêm di chuyển qua lại trong khu vực cuối màn thay vì đứng yên.
- Thêm cơ chế laser cảnh báo theo vị trí người chơi: boss khóa mục tiêu bằng vạch đỏ, sau thời gian nạp sẽ gây sát thương nếu người chơi không né.
- Thêm đạn `luật lệ` nảy quanh bản đồ, có hỗ trợ bounce trong hệ projectile chung; sau khi boss mất khiên, nhịp laser/đạn nhanh hơn và số đạn nhiều hơn.
- Mục tiêu thiết kế: boss màn 5 khó và có nhiều chiêu hơn, gần cảm giác boss màn 4 nhưng vẫn gắn với ý tưởng thượng tầng bảo thủ phản công khi cơ sở hạ tầng bị cải tạo.


### 2026-06-05 — Nâng cấp học thuật và popup tổng kết

- Đối chiếu tài liệu trong `F:\tai lieu fpt ki 8\MLN111\tai lieu` và `F:\tai lieu fpt ki 8\MLN111\slide`, trọng tâm là `_extracted_tomtat_full.txt` và `slide_anh_duc_thong_nhat_mat_doi_lap_v2.md`.
- Viết lại nội dung 5 màn theo hướng học thuật hơn:
  - Vật chất/ý thức dùng định nghĩa vật chất của V.I. Lênin, bản chất ý thức và quan hệ vật chất - ý thức.
  - Lượng/chất bổ sung chất, lượng, độ, điểm nút, bước nhảy và cảnh báo nóng vội/bảo thủ.
  - Mâu thuẫn bổ sung mặt đối lập, thống nhất, đấu tranh, tính tương đối của thống nhất và tính tuyệt đối của đấu tranh.
  - Phủ định của phủ định bổ sung phủ định biện chứng, kế thừa chọn lọc và đường xoáy ốc đi lên.
  - Duy vật lịch sử chỉnh lại thuật ngữ: cơ sở hạ tầng là hệ thống quan hệ sản xuất hiện thực, không đồng nhất với máy móc vật lý.
- Thêm popup “Tổng kết học thuật sau màn” trong `index.html`, styling trong `styles.css`, render bằng `showKnowledgePopup()`/`hideKnowledgePopup()` trong `src/game.js`.
- Tạo `contents.md` để ghi bản đồ nội dung học thuật, nguồn tài liệu, mục tiêu học tập, ánh xạ gameplay và quy tắc bảo trì.
- Cập nhật `README.md` để mô tả popup tổng kết học thuật, bảng 5 chương mới và `contents.md`.
- Lưu ý cho lần sau: mọi chỉnh sửa nội dung học thuật phải cập nhật `src/game.js`, `contents.md` và `notes.md` cùng lúc trước khi commit.
- Kiểm thử trước commit: VS Code diagnostics không báo lỗi cho `src/game.js`, `index.html`, `styles.css`, `README.md`, `notes.md`, `contents.md`; `git diff --check` không có lỗi whitespace; server tĩnh trả `200 OK` cho `index.html` và asset PNG. `node --check src/game.js` bị Claude Code auto-mode classifier chặn quyền nên không chạy được.
- Trạng thái commit/push: thực hiện trên branch `academic-content-upgrade` sau khi hoàn tất kiểm thử.
