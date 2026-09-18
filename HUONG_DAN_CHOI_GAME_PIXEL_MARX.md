# PIXEL MARX: DẤU CHÂN TRIẾT GIA
## TÀI LIỆU PHÂN TÍCH GAME & HƯỚNG DẪN NGƯỜI CHƠI (GAME GUIDE & PLAN DOC)

> **Mục đích tài liệu:** Hướng dẫn chi tiết cách chơi, giải thích cơ chế hoạt động kỹ thuật và triết học của từng màn chơi, giúp người hướng dẫn/thuyết trình dễ dàng phổ biến luật chơi cho người mới hoặc làm bài thuyết trình sản phẩm sáng tạo MLN111.

---

## 1. TỔNG QUAN DỰ ÁN

- **Tên trò chơi:** PIXEL MARX: DẤU CHÂN TRIẾT GIA
- **Thể loại:** 2D Pixel Action-Adventure / Platformer-lite kết hợp Gamification kiến thức Triết học.
- **Nền tảng kỹ thuật:** Web App thuần (HTML5 Canvas, CSS3 Responsive, JavaScript Vanilla ES6+), không cần cài đặt Node.js hay thư viện ngoài, chơi offline hoàn toàn.
- **Bối cảnh cốt truyện:** Một sinh viên FPT thức đêm cày deadline môn Triết học Mác - Lênin (MLN111), ngủ gục trên bàn phím và bị hút vào **Aletheia — Vùng đất Chân lý**. Để trở về phòng thi đúng giờ, người chơi phải trang bị **“Cái cày Pixel”** (công cụ lao động) và **“Cuốn sách Triết”** (tri thức lý luận) để vượt qua 3 chương thử thách tương ứng với 3 quy luật cơ bản của phép biện chứng duy vật.

---

## 2. CÁCH KHỞI CHẠY GAME

### Cách 1: Chơi trực tiếp (Nhanh nhất)
1. Mở thư mục dự án trên máy tính.
2. Nhấp đúp chuột vào file `index.html` hoặc chuột phải chọn mở bằng trình duyệt (Google Chrome, Microsoft Edge, Cốc Cốc, Firefox).
3. Nhấn nút **"Bắt đầu deadline"** để vào game.

### Cách 2: Chạy qua Local Server (Khuyến nghị khi demo thuyết trình)
Mở terminal/cmd tại thư mục chứa `index.html` và gõ:
```bash
python -m http.server 5173
```
Sau đó truy cập: `http://localhost:5173`

---

## 3. BẢNG ĐIỀU KHIỂN & GIAO DIỆN (CONTROLS & HUD)

### 3.1. Phím điều khiển

| Phím | Thao tác | Mô tả chi tiết |
|---|---|---|
| **A / D** hoặc **← / →** | Di chuyển trái / phải | Điều khiển nhân vật di chuyển qua lại trên bản đồ |
| **W** / **Space** / **↑** | Nhảy | Nhảy qua chướng ngại vật hoặc nhảy lên các bục địa hình |
| **J** | Đánh thường (Chém Cận Chiến) | Sử dụng Cái Cày Pixel để tấn công quái, kích hoạt công tắc, chém phá đối thủ |
| **K** | Kỹ năng Triết học | Kỹ năng đặc biệt thay đổi theo từng chương (Bước nhảy Lượng - Chất, Điều hòa mâu thuẫn, Kế thừa biện chứng) |
| **Chuột Trái (Click)** | Bắn xa (Ranged Shot) | **Mở ở Màn 3**: Bắn chưởng năng lượng tầm xa theo hướng con trỏ chuột |
| **E** hoặc **Enter** | Tương tác / Tiếp tục | Tương tác với công tắc, đóng hộp thoại, đóng popup kiến thức, bước qua Cổng Nhận Thức sang màn mới |
| **Nút Đồ họa** | Chuyển Cao / Thấp | Nút bấm trên giao diện để tối ưu mượt mà cho máy cấu hình yếu |

### 3.2. Giao diện người chơi (HUD)
- **Thanh Máu (HP đỏ):** Máu tối đa 100. Va chạm với quái, trúng đạn hoặc rơi khỏi map sẽ bị trừ HP. Khi HP = 0 sẽ hồi sinh lại đầu màn.
- **Thanh Năng Lượng / Kỹ Năng (Vàng/Xanh):** Thể hiện tiến độ sạc kỹ năng $K$ theo từng chương (Bình Độ %, % Mâu thuẫn, Điểm kế thừa).
- **Điểm số (Score):** Tích lũy khi nhặt vật phẩm, tiêu diệt quái, kích hoạt cơ chế và hạ gục Boss.
- **Thẻ Nhiệm Vụ (Objective Card):** Luôn hiển thị mục tiêu cần làm hiện tại ở góc trên màn hình.

---

## 4. PHÂN TÍCH CHI TIẾT 3 MÀN CHƠI & HƯỚNG DẪN VƯỢT MÀN

---

### 🟢 MÀN 1: QUY LUẬT LƯỢNG - CHẤT
*“Sự thay đổi dần dần về lượng dẫn tới sự thay đổi về chất thông qua bước nhảy tại điểm nút.”*

#### 1. Cơ chế hoạt động & Nhiệm vụ:
- **Tình huống:** Người chơi gặp quái vật bọc thép và **Golem Bảo Thủ**. Ở trạng thái bình thường, đòn đánh thường `J` gây **0 sát thương** vì giáp đối thủ quá dày (chất cũ chưa đổi).
- **Nhiệm vụ:**
  1. Di chuyển dọc bản đồ, nhặt các viên **Quặng Lượng (Ore)** rải rác trên đường.
  2. Mỗi viên quặng sẽ nạp thêm phần trăm vào **Bình Độ (Degree Bar)** hiển thị bên trái màn hình.
  3. Khi Bình Độ đạt **100% (Điểm Nút)**, nhấn phím **`K`** để kích hoạt **Bước Nhảy (Leap)**.
  4. Trong 10 giây Bước Nhảy (nhân vật phát sáng hào quang vàng, tốc độ di chuyển tăng 18%, lực chém tăng vọt), lập tức xông vào dùng **`J`** chém vỡ giáp quái và tiêu diệt Golem Bảo Thủ.
  5. Đóng popup tổng kết học thuật, di chuyển đến **Cổng Nhận Thức (Portal)** ở rìa phải và nhấn **`E`** để sang Màn 2.

> ⚠️ **CẢNH BÁO QUAN TRỌNG:** Nếu nhấn `K` khi Bình Độ **chưa đủ 100%**, người chơi sẽ bị trừ 12 HP và mất 10% Lượng kèm thông báo: *"Nôn nóng tả khuynh: chưa đủ lượng mà đòi nhảy chất!"*. Phải kiên nhẫn tích đủ 100%!

#### 2. Ý nghĩa Triết học MLN111:
- Minh họa các phạm trù **Chất - Lượng - Độ - Điểm Nút - Bước Nhảy**.
- **Ý nghĩa phương pháp luận:** Tránh tư tưởng nôn nóng, chủ quan duy ý chí (nhảy chất khi chưa đủ lượng) và tránh tư tưởng bảo thủ, trì trệ (đủ lượng rồi nhưng không dám thực hiện bước nhảy).

---

### 🟡 MÀN 2: QUY LUẬT MÂU THUẪN (THỐNG NHẤT & ĐẤU TRANH CỦA CÁC MẶT ĐỐI LẬP)
*“Sự thống nhất và đấu tranh của các mặt đối lập là nguồn gốc và động lực nội tại của sự phát triển.”*

#### 1. Cơ chế hoạt động & Nhiệm vụ:
- **Tình huống:** Phía trước bị chắn bởi **Cổng Đối Lập**. Bên trong là Boss **Song Sinh Thái Cực** (gồm 2 nửa: **Mặt Lửa** và **Mặt Băng**). Nếu chỉ đánh chết 1 bên, bên còn lại sẽ tự động **hồi sinh** cho bên kia sau 2.2 giây!
- **Nhiệm vụ:**
  1. Dùng **`J`** hoặc đi lại gần nhấn **`E`** để kích hoạt cả 2 công tắc: **Công tắc LỬA** (đỏ) và **Công tắc BĂNG** (xanh).
  2. Khi cả 2 mặt đối lập cùng bật, Cổng Đối Lập sẽ hạ xuống.
  3. Trong trận đánh Boss:
     - Hai mặt đối lập sẽ liên tục bắn các quả cầu năng lượng Lửa và Băng.
     - **Mẹo điều khiển:** Dụ cho đạn Lửa bắn trúng Mặt Băng hoặc đạn Băng bắn trúng Mặt Lửa để chúng tự triệt tiêu lẫn nhau và tăng nhanh thanh **% Mâu Thuẫn**.
     - Đánh xen kẽ cả 2 mặt để lượng máu giảm đều nhau.
  4. Khi thanh Mâu Thuẫn $\ge 50\%$, nhấn **`K` (Điều hòa mâu thuẫn)** để kéo máu cả 2 bên về mức trung bình và giáng đòn quyết định tiêu diệt cả hai cùng lúc!
  5. Bước qua Cổng Nhận Thức `E` để sang Màn 3.

#### 2. Ý nghĩa Triết học MLN111:
- Các mặt đối lập vừa **thống nhất** (nương tựa, làm tiền đề tồn tại cho nhau - thể hiện qua cơ chế nếu 1 bên chết thì bên kia hồi sinh), vừa **đấu tranh** (bài trừ, phủ định lẫn nhau - đạn bên này gây sát thương cho bên kia).
- **Ý nghĩa phương pháp luận:** Phải xem xét sự vật trong tính chỉnh thể toàn diện, không được giải quyết phiến diện, cắt khúc một mặt của mâu thuẫn.

---

### 🔴 MÀN 3: QUY LUẬT PHỦ ĐỊNH CỦA PHỦ ĐỊNH
*“Sự phát triển diễn ra theo đường xoáy ốc đi lên, cái mới ra đời kế thừa những hạt nhân hợp lý của cái cũ.”*

#### 1. Cơ chế hoạt động & Nhiệm vụ:
- **Tình huống:** Đối đầu với Boss bay **Phượng Hoàng Ouroboros** trên bầu trời qua **3 Pha liên tiếp (3 chu kỳ phủ định)**. Ouroboros bay lượn và dội đạn liên hoàn từ trên cao.
- **Nhiệm vụ:**
  1. **Tấn công tầm xa:** **Click chuột trái** để bắn đạn năng lượng vào Boss đang bay trên cao.
  2. **Dọn dẹp mặt đất:** Khi Boss triệu hồi *"Tàn dư phủ định"*, nhảy xuống dùng **`J`** chém cận chiến để vừa hồi phục thanh Kế thừa vừa tránh bị quái đẩy ngã.
  3. **Cơ chế 3 Pha xoáy ốc:**
     - **Pha 1 (Bắt đầu):** Boss màu cam, bắn đạn đơn. Bắn hạ Boss để chuyển pha.
     - **Pha 2 (Phủ định lần 1):** Boss tái sinh màu tím, máu dày hơn, bắn chùm 2 tia đạn. Ở pha này Boss có kháng cự 55% sát thương nếu người chơi chưa bật K. Khi thanh Kế thừa đạt 100%, nhấn **`K` (Kế thừa biện chứng)** để nhận buff kế thừa, tăng mạnh sát thương hạ Boss.
     - **Pha 3 (Phủ định của phủ định):** Boss tái sinh thành hình thái hoàng kim (màu vàng), tốc độ cao, bắn mưa 3 tia đạn. Nhấn **`K`** ngay khi đầy để được **+45% Sát thương cường hóa**, dứt điểm Boss hoàn toàn!
  4. Sau khi hạ gục Pha 3 của Boss Ouroboros, bước qua Cổng Nhận Thức cuối cùng để vào Ending chiến thắng!

#### 2. Ý nghĩa Triết học MLN111:
- Sự phát triển không đi theo đường thẳng và cũng không lặp lại vòng tròn khép kín, mà đi theo **đường xoáy ốc đi lên**. Mỗi lần phủ định dường như quay lại cái cũ nhưng ở trình độ cao hơn, tinh vi hơn và có tính kế thừa chọn lọc.

---

## 5. KẾT THÚC GAME (ENDING: HÀNH TRÌNH NHẬN THỨC)

Sau khi hoàn thành Màn 3, game sẽ đưa người chơi vào chuỗi hoạt cảnh tổng kết 3 quy luật biện chứng và 3 giai đoạn theo lý luận nhận thức duy vật biện chứng:

1. **Giai đoạn 1 — Trực quan sinh động (Nhận thức cảm tính):** Người học tiếp xúc với giáo trình, nhiệm vụ, hình ảnh trực quan và các thử thách cụ thể trong game.
2. **Giai đoạn 2 — Tư duy trừu tượng (Nhận thức lý tính):** Người học tổng hợp, khái quát các trải nghiệm trong game thành 3 quy luật triết học duy vật biện chứng khoa học.
3. **Giai đoạn 3 — Thực tiễn (Mục đích & Động lực của nhận thức):** Tri thức lý luận quay trở lại chỉ đạo hoạt động thực tiễn (sinh viên quay về phòng thi và áp dụng phương pháp luận vào học tập, cuộc sống).
4. **Mở khóa tính năng Chọn Màn (Level Select):** Sau khi xem hết Credits, người chơi có thể tự do chọn chơi lại bất kỳ màn nào từ 1 đến 3 để luyện tập hoặc demo.

---

## 6. MẸO CHƠI ĐẠT ĐIỂM CAO & TRÁNH MẤT MÁU (PRO TIPS)

1. **Giữ nhịp tấn công & Nhảy tránh đòn:** Đòn đánh `J` có thời gian hồi chiêu ngắn; khi bị quái áp sát, hãy kết hợp phím nhảy `Space` để vừa né đòn vừa chém từ trên xuống.
2. **Tận dụng Popup Kiến thức:** Sau mỗi màn, game dừng lại và hiển thị bảng tổng kết học thuật. Đây là lúc người chơi nghỉ ngơi, đọc lại quy luật để nắm trước gợi ý cho màn tiếp theo. Nhấn `E` hoặc `Enter` để đóng popup.
3. **Nhặt Ly Cà phê (Heart):** Trên bản đồ luôn có các biểu tượng ly cà phê giúp hồi ngay 18 HP khi chẳng may dính đòn.

---

## 7. KỊCH BẢN THUYẾT TRÌNH / HƯỚNG DẪN NHANH TRONG 1 PHÚT

Nếu bạn cần hướng dẫn nhanh cho người khác hoặc trình bày trước lớp/giảng viên, hãy dùng cấu trúc 3 phần sau:

- **Mở đầu (15s):** *"Pixel Marx là sản phẩm sáng tạo biến 3 quy luật cơ bản của Phép biện chứng duy vật (Triết học Mác - Lênin) khô khan thành 3 màn chơi giải đố hành động 2D. Người chơi nhập vai một sinh viên FPT dùng 'Cái cày pixel' và 'Sách triết' để giải quyết deadline."*
- **Trọng tâm (35s):** *"Mỗi màn chơi là một quy luật nền tảng: Màn 1 tích đủ lượng quặng mới được bật bước nhảy đổi chất; Màn 2 điều hòa hai mặt đối lập Lửa - Băng; Màn 3 dùng đòn bắn xa và kỹ năng kế thừa để đánh bại Boss Ouroboros qua 3 chu kỳ xoáy ốc phủ định của phủ định."*
- **Kết luận (10s):** *"Game giúp người học 'hiểu triết học bằng hành động' qua chu trình: Trực quan sinh động $\rightarrow$ Tư duy trừu tượng $\rightarrow$ Ứng dụng thực tiễn."*
