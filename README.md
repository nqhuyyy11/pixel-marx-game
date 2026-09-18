# PIXEL MARX: DẤU CHÂN TRIẾT GIA

**Sản phẩm sáng tạo MLN111** — một web game 2D pixel action-adventure/platformer-lite biến kiến thức Triết học Mác - Lênin thành cơ chế chơi game.

> Sinh viên FPT chạy deadline MLN111, ngủ gục trên bàn phím và bị hút vào **Aletheia — Vùng đất Chân lý**. Muốn về phòng thi, người chơi phải dùng “Cái cày Pixel” và “Cuốn sách Triết” để đánh bại các thế lực duy tâm, bảo thủ, mâu thuẫn chưa được giải quyết và quan hệ sản xuất lạc hậu.

## Chạy game

Cách nhanh nhất:

1. Mở file `index.html` bằng trình duyệt Chrome/Edge/Firefox mới.
2. Nhấn **Bắt đầu deadline**.

Cách khuyến nghị khi thuyết trình hoặc test local:

```bash
python -m http.server 5173
```

Sau đó mở: <http://localhost:5173>

Game là static web app thuần HTML/CSS/JavaScript, không cần cài package. Texture/sprite được lưu local trong `assets/` nên demo offline được sau khi clone repo.

## Điều khiển

| Phím | Hành động |
|---|---|
| `A/D` hoặc `←/→` | Di chuyển |
| `W`, `Space`, hoặc `↑` | Nhảy |
| `J` | Đánh/cày bằng Cái cày Pixel |
| `K` | Kỹ năng triết học riêng của từng chương |
| `Chuột trái` | Bắn xa (Mở ở Màn 3) |
| `E` hoặc `Enter` | Tương tác, đóng thoại, qua cổng nhận thức |

## 3 chương và 3 quy luật cơ bản của phép biện chứng duy vật

| Chương | Khái niệm MLN111 | Cơ chế game |
|---|---|---|
| 1. Quy luật Lượng - Chất | Lượng tích lũy đến Điểm Nút dẫn tới biến đổi Chất thông qua Bước Nhảy | Nhặt quặng để đầy **Bình Độ** 100%; nhấn `K` đúng Điểm Nút để kích hoạt **Bước Nhảy**. Tránh nóng vội nhảy chất khi chưa đủ lượng! |
| 2. Quy luật Mâu thuẫn | Thống nhất và đấu tranh của các mặt đối lập là nguồn gốc, động lực của sự phát triển | Tương tác bật công tắc Lửa & Băng, đẩy mâu thuẫn lên cao trào rồi nhấn `K` **Điều hòa mâu thuẫn** để tiêu diệt Boss Song Sinh. |
| 3. Quy luật Phủ định của Phủ định | Phát triển theo đường xoáy ốc đi lên, kế thừa và lọc bỏ | Boss Ouroboros biến hóa qua 3 pha (Hỗn mang → Đối lập → Tổng hợp); dùng kỹ năng `K` **Kế thừa tinh hoa** và đạn bắn xa chuột trái để đánh bại. |

## Popup tổng kết học thuật

Sau mỗi màn, game hiện popup “Tổng kết học thuật sau màn” với 4 lớp nội dung:

- Định nghĩa/khái niệm cốt lõi theo tài liệu MLN111.
- Quan hệ biện chứng hoặc nội dung quy luật.
- Ý nghĩa phương pháp luận.
- Ánh xạ giữa kiến thức và cơ chế gameplay.

Nội dung chi tiết của từng màn được ghi trong `contents.md` để nhóm thuyết trình hoặc agent bảo trì tra cứu nhanh.

## Ending: hành trình nhận thức

Sau khi vượt qua cả 3 quy luật biện chứng, game trình bày sơ đồ tổng kết 3 quy luật cùng 3 nấc của quy luật nhận thức:

1. **Trực quan sinh động** — người học tiếp xúc với hiện tượng cụ thể, nhiệm vụ và hình ảnh trực quan trong game.
2. **Tư duy trừu tượng** — người học khái quát trải nghiệm thành phạm trù và 3 quy luật biện chứng duy vật.
3. **Thực tiễn** — tri thức quay trở lại định hướng hoạt động thực tiễn, được kiểm nghiệm và phát triển trong thực tiễn.

## Pitch thuyết trình gợi ý

- **Góc nhìn người trẻ FPT**: chúng em nhìn 3 quy luật Triết học Mác - Lênin qua góc nhìn code, pixel art, boss fight và game mechanics.
- **Tính sáng tạo**: gamification biến các quy luật trừu tượng (Lượng - Chất, Mâu thuẫn, Phủ định của Phủ định) thành trải nghiệm tương tác trực quan; người chơi “hiểu bằng hành động”, không chỉ học thuộc.
- **Tính cần thiết**: MLN111 thường khó vì thiếu trực quan sinh động. Game bổ sung cầu nối: chơi → hiểu quy luật → áp dụng tư duy biện chứng vào học tập và thực tiễn.

## Cấu trúc repo

```text
.
├── index.html      # UI shell + canvas (Menu chọn 3 chương)
├── styles.css      # Pixel theme responsive
├── src/game.js     # Canvas engine, 3 chương (3 quy luật biện chứng), boss, dialog, popup học thuật, ending
├── assets/         # Texture/sprite CC0 lưu local
├── contents.md     # Bản đồ nội dung học thuật 3 quy luật trong game
├── README.md       # Hướng dẫn người dùng/thuyết trình
├── notes.md        # Hướng dẫn bảo trì cho agent sau này
└── .gitignore
```

## Ghi chú phạm vi MVP

Đây là bản MVP tự chứa để nộp/thuyết trình nhanh. Game vẫn dùng Canvas thuần và không cần build tool, nhưng đã có lớp texture/sprite local để nền, platform, nhân vật, boss, item và cổng nhận thức đỡ “hình khối” hơn. Nếu texture nào lỗi, game tự fallback về nét vẽ Canvas đơn giản để không hỏng demo.

## Asset và license

- Asset chính nằm trong `assets/kenney/pixel-platformer/` và được map qua `ASSET_MANIFEST` trong `src/game.js`.
- Repo cũng có `assets/kenney/roguelike-rpg-pack/` làm pack CC0 dự phòng cho nâng cấp sau.
- Chi tiết nguồn và giấy phép nằm ở `assets/ATTRIBUTION.md`; các pack Kenney dùng giấy phép Creative Commons Zero (CC0).
- Khi thêm asset mới, hãy lưu local trong `assets/` và cập nhật `assets/ATTRIBUTION.md` trước khi publish/thuyết trình.

Nếu phát triển tiếp, có thể migrate sang Phaser 3 + Vite + Supabase theo `F:\tai lieu fpt ki 8\plans.md`.
