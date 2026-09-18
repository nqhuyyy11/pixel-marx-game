# Nội dung học thuật hiện tại — PIXEL MARX: DẤU CHÂN TRIẾT GIA

Tài liệu này mô tả lớp nội dung/kiến thức đang được trình bày trong game để người bảo trì hoặc agent sau này hiểu game đang dạy gì, lấy nguồn từ đâu và mỗi cơ chế gameplay ánh xạ với khái niệm Triết học Mác - Lênin nào.

## 1. Mục tiêu nội dung

Game là sản phẩm sáng tạo MLN111 dùng hình thức web game 2D để chuyển hóa 3 quy luật cơ bản của phép biện chứng duy vật thành trải nghiệm tương tác:

1. Quy luật chuyển hóa từ những thay đổi về lượng thành những thay đổi về chất và ngược lại (Quy luật Lượng - Chất).
2. Quy luật thống nhất và đấu tranh của các mặt đối lập (Quy luật Mâu thuẫn).
3. Quy luật phủ định của phủ định.

Sau mỗi màn, game mở popup “Tổng kết học thuật sau màn” để trình bày khái niệm, luận điểm chính, ý nghĩa phương pháp luận và ánh xạ gameplay.

## 2. Nguồn tài liệu đã đối chiếu

Các nội dung học thuật trong game được viết lại dựa trên giáo trình và tài liệu chuẩn MLN111:

- Quy luật Lượng - Chất: chất, lượng, độ, điểm nút, bước nhảy và ý nghĩa phương pháp luận.
- Quy luật Mâu thuẫn: mặt đối lập, thống nhất, đấu tranh, nguồn gốc & động lực phát triển, giải quyết mâu thuẫn.
- Quy luật Phủ định của Phủ định: phủ định biện chứng, phủ định của phủ định, đường xoáy ốc đi lên, tính kế thừa biện chứng.

## 3. Cấu trúc nội dung trong code

- `src/game.js`
  - Mảng `chapters`: chứa 3 chương (`title`, `concept`, `objective`, `tip`, `npc`, các hook gameplay và object `knowledge` cho popup học thuật).
  - `knowledge.paragraphs`: đoạn giải thích khái niệm cốt lõi.
  - `knowledge.points`: các luận điểm/ý nghĩa phương pháp luận.
  - `knowledge.mapping`: giải thích cơ chế gameplay đang tượng trưng cho nội dung nào.
  - `knowledge.source`: gợi ý tài liệu/dòng nguồn đã đối chiếu.
  - `showKnowledgePopup()` và `hideKnowledgePopup()`: điều khiển popup tổng kết sau màn.
- `index.html`
  - Menu chọn 3 chương + `#knowledgeModal` modal tổng kết học thuật.
- `styles.css`
  - `.knowledge-modal`, `.knowledge-card` và các class liên quan: giao diện popup.

## 4. Nội dung từng màn

### Màn 1: Quy luật Lượng - Chất

**Khái niệm trong game:** Sự thay đổi dần dần về lượng đến điểm nút dẫn tới sự thay đổi về chất thông qua bước nhảy.

**Luận điểm học thuật chính:**

- Chất là tính quy định khách quan vốn có của sự vật, là sự thống nhất hữu cơ của các thuộc tính làm cho sự vật là nó và phân biệt nó với sự vật khác.
- Lượng là tính quy định khách quan về số lượng, quy mô, trình độ, nhịp điệu, tốc độ vận động và phát triển của sự vật.
- Độ là khoảng giới hạn trong đó lượng thay đổi nhưng chất chưa thay đổi căn bản.
- Điểm nút là thời điểm lượng tích lũy đủ để làm thay đổi chất.
- Bước nhảy là sự chuyển hóa về chất do sự thay đổi lượng trước đó tạo ra; chất mới lại tác động trở lại lượng mới.
- Ý nghĩa phương pháp luận: tránh nóng vội duy ý chí khi chưa đủ lượng; đồng thời tránh bảo thủ trì trệ khi điều kiện đổi chất đã chín muồi.

**Ánh xạ gameplay:**

- Quặng tăng chỉ số `Bình Độ` — biểu tượng của quá trình tích lũy lượng.
- `Bình Độ` đạt 100% là điểm nút.
- Nhấn `K` đúng lúc tạo `Bước Nhảy`, làm năng lực nhân vật chuyển sang “chất” mới (sức mạnh tăng vọt phá giáp Boss).
- Nhấn kỹ năng quá sớm gây phản tác dụng (mất máu, mất lượng), tượng trưng cho tư tưởng nóng vội, chủ quan tả khuynh.

**Popup sau màn:** định nghĩa chất/lượng/độ/điểm nút/bước nhảy và cảnh báo hai sai lầm phương pháp luận.

### Màn 2: Quy luật Mâu thuẫn

**Khái niệm trong game:** Sự thống nhất và đấu tranh của các mặt đối lập là nguyên nhân, động lực bên trong của vận động và phát triển.

**Luận điểm học thuật chính:**

- Mặt đối lập là những mặt, thuộc tính hoặc khuynh hướng vận động trái ngược nhau cùng tồn tại trong một sự vật, hiện tượng.
- Mâu thuẫn biện chứng là mối liên hệ, tác động qua lại và chuyển hóa lẫn nhau giữa các mặt đối lập.
- Các mặt đối lập vừa thống nhất vừa đấu tranh.
- Thống nhất là sự liên hệ, nương tựa, ràng buộc và làm tiền đề tồn tại cho nhau; sự thống nhất có tính tương đối, tạm thời, có điều kiện.
- Đấu tranh là khuynh hướng tác động qua lại, bài trừ, phủ định nhau; đấu tranh có tính tuyệt đối, biểu hiện vận động tuyệt đối của sự vật.
- Khi mâu thuẫn phát triển gay gắt và gặp điều kiện thích hợp, các mặt đối lập chuyển hóa, mâu thuẫn được giải quyết, sự vật mới ra đời.

**Ánh xạ gameplay:**

- Công tắc Lửa/Băng là hai mặt đối lập.
- Người chơi phải kích hoạt cả hai, tạo tương tác giữa chúng và làm chỉ số mâu thuẫn phát triển lên cao trào.
- Kỹ năng `K` Điều hòa mâu thuẫn giúp hóa giải xung đột và mở ra bước phát triển mới.
- Boss Song Sinh cần được giải quyết trong tính chỉnh thể, tránh xử lý phiến diện một mặt tách khỏi mặt kia.

**Popup sau màn:** định nghĩa mặt đối lập, mâu thuẫn biện chứng, thống nhất/đấu tranh và phương pháp giải quyết mâu thuẫn.

### Màn 3: Quy luật Phủ định của Phủ định

**Khái niệm trong game:** Phủ định biện chứng tạo tiền đề cho phát triển; sự phát triển diễn ra theo đường xoáy ốc đi lên với tính kế thừa.

**Luận điểm học thuật chính:**

- Phủ định biện chứng là sự phủ định làm tiền đề và tạo điều kiện cho sự phát triển; đó là tự phủ định, tự phát triển của sự vật, hiện tượng.
- Phủ định của phủ định kết thúc một chu kỳ vận động, làm sự vật dường như quay lại cái cũ về hình thức nhưng trên cơ sở cao hơn, tiến bộ hơn về nội dung.
- Sự phát triển không đi theo đường thẳng giản đơn và cũng không quay vòng lặp lại nguyên trạng, mà theo đường xoáy ốc đi lên.
- Mỗi vòng khâu mới vừa có tính chu kỳ, vừa kế thừa chọn lọc yếu tố tích cực của cái cũ, vừa đạt tiến bộ mới về chất.
- Ý nghĩa phương pháp luận: cần nhận diện, ủng hộ cái mới; chống bảo thủ giáo điều; không phủ định sạch trơn và cũng không kế thừa nguyên xi cái cũ.

**Ánh xạ gameplay:**

- Boss Ouroboros có 3 pha (Hỗn mang → Đối lập → Tổng hợp), mỗi pha như một vòng khâu mới của quá trình phát triển.
- Các pha lặp lại một số hình thức cũ nhưng yêu cầu năng lực cao hơn, biểu thị “dường như quay lại cái cũ” ở trình độ cao hơn.
- Kỹ năng `K` Kế thừa biện chứng và đòn đánh tầm xa giúp giữ lại yếu tố hợp lý để vượt qua các pha biến hóa.

**Popup sau màn:** tóm tắt phủ định biện chứng, phủ định của phủ định, đường xoáy ốc và tính kế thừa.

## 5. Ending: hành trình nhận thức

Ending dùng ba nấc của quá trình nhận thức:

1. **Trực quan sinh động:** người học tiếp xúc với hiện tượng cụ thể, tình huống, hình ảnh, nhiệm vụ.
2. **Tư duy trừu tượng:** người học khái quát trải nghiệm thành phạm trù và quy luật.
3. **Thực tiễn:** tri thức quay trở lại chỉ đạo hoạt động thực tiễn, được kiểm nghiệm và phát triển trong thực tiễn.

Ending nhấn mạnh tinh thần: học Triết học Mác - Lênin không chỉ để ghi nhớ khái niệm, mà để hình thành phương pháp luận khoa học trong nhận thức và hành động.

## 6. Quy tắc bảo trì nội dung

- Khi sửa nội dung học thuật trong `src/game.js`, phải cập nhật `contents.md` và `notes.md` cùng lúc.
- Giữ tiếng Việt có dấu, dùng thuật ngữ học thuật thống nhất: vật chất, ý thức, chất, lượng, độ, điểm nút, bước nhảy, mặt đối lập, mâu thuẫn biện chứng, phủ định biện chứng, lực lượng sản xuất, quan hệ sản xuất, cơ sở hạ tầng, kiến trúc thượng tầng.
- Tránh dùng ẩn dụ gây sai lệch: đặc biệt không đồng nhất `cơ sở hạ tầng` với máy móc vật lý. Nếu dùng máy/nút trong gameplay, phải giải thích đó là biểu tượng cho quan hệ sản xuất hiện thực.
- Mỗi màn nên có đủ 4 lớp nội dung: định nghĩa, quan hệ/quy luật, ý nghĩa phương pháp luận, ánh xạ gameplay.
- Nếu thêm màn mới, thêm `knowledge` object trong `chapters`, cập nhật popup, README nếu cần, và bổ sung mục tương ứng trong tài liệu này.
