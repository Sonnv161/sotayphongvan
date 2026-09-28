(function () {
  const mod = MODULES.find((item) => item.id === "sql");
  mod.summary = "Lộ trình SQL cho mức khoảng 3 năm: câu lệnh, JOIN, NULL, chuẩn hóa, transaction, index, khóa, phân trang, rồi khác biệt PostgreSQL và Oracle. Đọc từ trên xuống.";
  mod.theory = [
    {
      h: "Cơ bản — Câu SELECT chạy theo thứ tự nào",
      html: `<p>Người viết SELECT theo thứ tự chọn cột, từ bảng, lọc, gom, sắp xếp. Máy lại hiểu một thứ tự khác:</p>
      <ol>
        <li><strong>FROM</strong> và JOIN — lấy các bảng ra.</li>
        <li><strong>WHERE</strong> — bỏ dòng không đạt, trước khi gom.</li>
        <li><strong>GROUP BY</strong> — gom dòng.</li>
        <li><strong>HAVING</strong> — bỏ nhóm không đạt.</li>
        <li><strong>SELECT</strong> — tính cột và alias.</li>
        <li><strong>ORDER BY</strong> — sắp xếp.</li>
        <li><strong>LIMIT / OFFSET</strong> hoặc <code>FETCH FIRST</code> — cắt trang.</li>
      </ol>
      <p>Vì WHERE chạy trước SELECT, alias cột trong SELECT không dùng được trong WHERE. Alias dùng được trong ORDER BY. HAVING mới thấy kết quả gom như <code>count(*)</code>.</p>
      <p><code>COUNT(*)</code> đếm dòng. <code>COUNT(cot)</code> đếm dòng mà cột đó không null. <code>COUNT(DISTINCT cot)</code> đếm giá trị khác nhau.</p>`
    },
    {
      h: "Cơ bản — JOIN",
      html: `<ul>
        <li><strong>INNER JOIN:</strong> chỉ dòng khớp cả hai phía.</li>
        <li><strong>LEFT JOIN:</strong> giữ mọi dòng bên trái, bên phải không khớp thì các cột đó là NULL.</li>
        <li><strong>RIGHT JOIN:</strong> ngược lại. Em thường đổi thành LEFT JOIN cho dễ đọc từ bảng chính.</li>
        <li><strong>FULL OUTER JOIN:</strong> giữ cả hai phía. PostgreSQL có. Hay dùng khi đối soát “bên nào có mà bên kia thiếu”.</li>
        <li><strong>CROSS JOIN:</strong> mọi cặp. Hữu ích khi chủ đích nhân lịch với danh mục, tai họa khi viết thiếu điều kiện nối.</li>
      </ul>
      <p>Bẫy hay gặp: LEFT JOIN đơn vị rồi viết <code>WHERE don_vi.ten = 'Sở A'</code>. Điều kiện ở WHERE chạy sau nối, dòng không khớp đã thành NULL nên bị loại — LEFT JOIN biến thành INNER JOIN. Điều kiện của bảng bên phải để trong <code>ON</code> nếu vẫn muốn giữ hồ sơ chưa có đơn vị.</p>
      <p>Mỗi JOIN cần đúng cột khóa. Thiếu điều kiện là tích Descartes, báo cáo phình số.</p>`
    },
    {
      h: "Cơ bản — Gom nhóm và NULL",
      html: `<p>Cột trong SELECT khi có GROUP BY phải nằm trong GROUP BY hoặc nằm trong hàm gom (<code>count</code>, <code>sum</code>, <code>max</code>). WHERE lọc từng hồ sơ trước khi đếm. HAVING lọc sau khi đếm, ví dụ đơn vị có trên 100 hồ sơ.</p>
      <p>NULL nghĩa là không biết, không phải chuỗi rỗng và không phải số 0. <code>NULL = NULL</code> không true. Kiểm tra bằng <code>IS NULL</code>. Hàm gom bỏ qua NULL, trừ <code>COUNT(*)</code>.</p>
      <p><code>NOT IN</code> gặp NULL trong danh sách con thì cả điều kiện thành không xác định, câu lệnh trả về không dòng dù mắt thường thấy còn dữ liệu. Em dùng <code>NOT EXISTS</code> cho kiểu “hồ sơ chưa có bước này”.</p>
      <pre><code>select h.*
from ho_so h
where not exists (
  select 1 from phe_duyet p
  where p.ho_so_id = h.id and p.buoc = 'TRUONG_PHONG'
);</code></pre>`
    },
    {
      h: "Trung cấp — Khóa, ràng buộc và chuẩn hóa",
      html: `<ul>
        <li><strong>Khóa chính:</strong> một dòng, không null.</li>
        <li><strong>Khóa ngoại:</strong> giá trị phải tồn tại bên bảng cha, hoặc null nếu cột cho phép. Xóa cha bị chặn khi còn con — đó là việc tốt.</li>
        <li><strong>UNIQUE:</strong> không trùng. Kết hợp với soft delete thì index phải loại các dòng đã hủy, nếu không không tạo lại được cùng một mã.</li>
        <li><strong>CHECK:</strong> ví dụ số tiền không âm, ngày kết thúc không trước ngày bắt đầu.</li>
      </ul>
      <p>Chuẩn hóa để một sự thật chỉ sửa một chỗ.</p>
      <ul>
        <li><strong>1NF:</strong> một ô một giá trị. Không nhét danh sách mã đơn vị cách nhau bằng dấu phẩy rồi <code>LIKE</code>.</li>
        <li><strong>2NF:</strong> với khóa gồm nhiều cột, cột không khóa phải phụ thuộc cả khóa, không chỉ một phần.</li>
        <li><strong>3NF:</strong> cột không khóa không phụ thuộc một cột không khóa khác. Tên đơn vị phụ thuộc mã đơn vị, không phụ thuộc mã hồ sơ — để ở bảng đơn vị.</li>
      </ul>
      <p>Phi chuẩn hóa có chủ đích khi báo cáo đọc rất nhiều và dữ liệu nguồn ít đổi, và phải có cách làm mới bản sao. Không phi chuẩn vì lười join.</p>`
    },
    {
      h: "Trung cấp — Transaction và mức cô lập",
      html: `<p>Một transaction gom nhiều câu thành một việc: hoặc cả khối được giữ, hoặc không câu nào được giữ. PostgreSQL và Oracle mặc định Read Committed, và dùng MVCC: người đọc thấy bản đã commit, thường không chặn người ghi chỉ vì đang đọc.</p>
      <ul>
        <li><strong>Dirty read:</strong> đọc dữ liệu người khác chưa commit. Read Committed không cho phép. PostgreSQL không có mức đọc bẩn thật dù có tên Read Uncommitted.</li>
        <li><strong>Non-repeatable read:</strong> trong một transaction, đọc cùng một dòng hai lần ra hai giá trị vì người khác đã commit ở giữa. Read Committed vẫn có thể gặp.</li>
        <li><strong>Phantom:</strong> lần đọc sau thấy thêm dòng mới thỏa điều kiện.</li>
      </ul>
      <p>Báo cáo cần một ảnh ổn định thì dùng mức cao hơn hoặc một transaction chỉ đọc kiểu snapshot, và chấp nhận chi phí. Đừng nâng mức cô lập của cả hệ thống chỉ vì một báo cáo cuối tháng. Oracle cũng mặc định Read Committed; cú pháp khóa và hàm ngày khác, ý tưởng cô lập thì cùng họ với PostgreSQL.</p>`
    },
    {
      h: "Trung cấp — Index và cách đọc plan",
      html: `<p>Index là cấu trúc tìm nhanh, thường là cây B-tree, trỏ về dòng trong bảng. Trên PostgreSQL và Oracle, bảng thường là heap, index là cấu trúc riêng. Đừng mang nguyên mô hình “khóa chính chính là bảng” của MySQL InnoDB sang trả lời cho hai hệ này.</p>
      <p>Index giúp <code>=</code>, khoảng ngày, JOIN và ORDER BY đúng cột. Index nhiều cột <code>(don_vi_id, ngay_nop)</code> phục vụ lọc đơn vị, hoặc lọc đơn vị rồi đến ngày. Nó không phục vụ câu chỉ lọc ngày mà bỏ trống đơn vị — cột trái nhất phải có trong điều kiện.</p>
      <p>Bọc cột bằng hàm làm mất index thường: <code>where date(ngay_nop) = ...</code>, <code>where upper(ma) = ...</code>. Sửa thành khoảng thời gian, hoặc tạo index trên đúng biểu thức nếu hàm là chủ đích.</p>
      <p><code>EXPLAIN</code> cho xem kế hoạch, không chạy câu lệnh. <code>EXPLAIN ANALYZE</code> chạy thật và hiện thời gian — đừng phân tích một câu UPDATE nặng trên production bằng ANALYZE. Seq scan trên bảng nhỏ là bình thường. Index không miễn phí: mỗi lần ghi, các index cũng phải cập nhật.</p>`
    },
    {
      h: "Nâng cao — Khóa dòng, deadlock, SKIP LOCKED",
      html: `<p><code>SELECT ... FOR UPDATE</code> khóa các dòng đọc được tới khi commit, người khác muốn sửa những dòng đó thì chờ. Dùng khi chuyển trạng thái hồ sơ theo kiểu “đọc rồi quyết định”, và transaction phải ngắn.</p>
      <p><code>NOWAIT</code> không chờ, gặp khóa thì lỗi ngay. <code>SKIP LOCKED</code> bỏ qua dòng đang bị khóa — hợp hàng đợi việc trong DB, mỗi worker lấy một hồ sơ chưa ai giữ. Không dùng SKIP LOCKED cho màn hình người dùng đang mở đúng một hồ sơ.</p>
      <p>Deadlock: transaction A khóa hồ sơ 1 rồi chờ hồ sơ 2, B khóa hồ sơ 2 rồi chờ hồ sơ 1. DB hủy một bên. Ứng dụng khóa theo thứ tự id tăng dần, rút ngắn transaction, bắt lỗi deadlock để thử lại ít lần. Không thử lại vô hạn.</p>`
    },
    {
      h: "Nâng cao — CTE, hàm cửa sổ và phân trang",
      html: `<p>CTE (<code>WITH</code>) đặt một query có tên để câu sau đọc được. Hợp báo cáo nhiều bước và hợp cây cha-con bằng CTE đệ quy, ví dụ đơn vị và mọi đơn vị cấp dưới. Trên PostgreSQL mới, CTE không đệ quy có thể được gộp vào câu chính chứ không bắt buộc vật hóa riêng như các bản cũ.</p>
      <p>Hàm cửa sổ tính trên một nhóm mà không làm sập các dòng thành một dòng như GROUP BY. Lấy hồ sơ mới nhất của mỗi đơn vị:</p>
      <pre><code>select *
from (
  select h.*,
         row_number() over (partition by don_vi_id order by ngay_nop desc, id desc) as rn
  from ho_so h
) t
where rn = 1;</code></pre>
      <p>Phân trang <code>OFFSET</code> càng sâu càng chậm vì DB vẫn phải đi qua các dòng bị bỏ. Keyset pagination nhớ mốc dòng cuối: “cho tôi 20 dòng có ngày và id nhỏ hơn mốc vừa xem”. Ổn định hơn khi có người đang thêm hồ sơ mới. Màn hình quản trị cần số trang thì OFFSET vẫn chấp nhận được nếu có index và giới hạn kích thước trang.</p>`
    },
    {
      h: "Nâng cao — PostgreSQL, Oracle và thiết kế bảng hồ sơ",
      html: `<p>Cùng một ý, khác chữ. Đi làm hệ cũ của cơ quan thì gặp Oracle. Hệ mới thường PostgreSQL.</p>
      <ul>
        <li>Phân trang: PostgreSQL <code>LIMIT/OFFSET</code>. Oracle hiện đại dùng <code>OFFSET ... FETCH FIRST</code>. <code>ROWNUM</code> là kiểu cũ.</li>
        <li>Rỗng thành giá trị khác: Oracle <code>NVL</code>, cả hai đều có <code>COALESCE</code>.</li>
        <li>Ngày hiện tại: PostgreSQL <code>now()</code>, Oracle <code>SYSDATE</code> hoặc <code>SYSTIMESTAMP</code>.</li>
        <li>PostgreSQL có <code>RETURNING</code>, <code>ON CONFLICT</code>, <code>ILIKE</code>, <code>JSONB</code>. Oracle dùng MERGE và cú pháp riêng cho JSON.</li>
        <li>Nối ngoài kiểu <code>(+)</code> là Oracle cũ. Viết ANSI JOIN cho code mới.</li>
      </ul>
      <p>Bảng hồ sơ giữ trạng thái hiện tại. Bảng lịch sử giữ mỗi lần đổi: ai, lúc nào, giá trị cũ, giá trị mới, cùng transaction với lần đổi. Không xóa vật lý bản đã phát sinh. Unique mã hồ sơ là index một phần trên các dòng chưa hủy. Script đổi bảng lớn đi theo bước thêm cột, ghi cả hai, backfill, rồi mới đọc cột mới — mỗi bước tương thích với bản ứng dụng đang chạy.</p>`
    }
  ];
  mod.questions.push(
    {
      level: "Cơ bản",
      q: "WHERE khác HAVING thế nào?",
      html: `<p>WHERE lọc từng dòng trước khi gom nhóm, nên không dùng được kết quả count của nhóm. HAVING lọc sau GROUP BY, ví dụ chỉ lấy đơn vị có trên 100 hồ sơ. Điều kiện trên cột gốc như mã đơn vị hay khoảng ngày để ở WHERE, vừa đúng nghĩa vừa còn cơ hội dùng index trước khi gom.</p>`,
      tip: "Nếu họ đưa một câu viết sai, hãy chỉ đúng chỗ điều kiện nên đứng."
    },
    {
      level: "Cơ bản",
      q: "LEFT JOIN viết thêm điều kiện ở WHERE thì chuyện gì xảy ra?",
      html: `<p>Các dòng bên trái không khớp được điền NULL ở cột bên phải. WHERE so sánh những cột đó với một giá trị thật sẽ loại các dòng NULL, nên kết quả giống INNER JOIN. Nếu em vẫn muốn giữ hồ sơ chưa có bản ghi bên phải, điều kiện của bảng bên phải phải nằm trong ON. Điều kiện của bảng bên trái thì để WHERE.</p>`,
      tip: "Đây là lỗi báo cáo rất hay gặp lúc nghiệm thu số liệu."
    },
    {
      level: "Trung cấp",
      q: "Vì sao NOT IN đôi khi trả về rỗng dù dữ liệu còn?",
      html: `<p>Nếu truy vấn con có một giá trị NULL, phép so sánh với NULL là không xác định. NOT IN cả danh sách đó không còn true với dòng nào, kết quả rỗng. Em viết NOT EXISTS, hoặc bảo đảm truy vấn con không trả NULL. EXISTS cũng dừng khi thấy dòng đầu tiên, hợp kiểu kiểm tra còn hay hết.</p>`,
      tip: "Kể ngắn ba giá trị của logic SQL: true, false, unknown."
    },
    {
      level: "Trung cấp",
      q: "Index (don_vi_id, ngay_nop) phục vụ những câu nào?",
      html: `<p>Nó hợp câu lọc theo đơn vị, và câu lọc theo đơn vị rồi đến khoảng ngày, kể cả sắp xếp theo ngày trong cùng đơn vị. Nó không hợp câu chỉ lọc theo ngày trên mọi đơn vị, vì cột trái nhất không có trong điều kiện. Muốn câu đó nhanh thì cần index khác bắt đầu bằng ngày, hoặc chấp nhận quét nếu dữ liệu nhỏ. Em xem plan trước khi thêm index thứ hai, vì mỗi index làm ghi chậm thêm.</p>`,
      tip: "Nói một câu về leftmost prefix là đủ để họ thấy bạn không học thuộc tên index."
    },
    {
      level: "Nâng cao",
      q: "OFFSET 100000 khác phân trang theo mốc thế nào?",
      html: `<p>OFFSET bảo DB tìm 100020 dòng rồi vứt 100000 dòng đầu. Càng về sau càng chậm, và nếu có hồ sơ mới chen vào thì người dùng có thể thấy trùng hoặc mất dòng khi sang trang. Phân trang theo mốc lấy 20 dòng nhỏ hơn cặp ngày-id của dòng cuối trang trước, index trên đúng thứ tự đó. Màn hình cần nhảy tới trang số 50 thì OFFSET dễ làm hơn, em giới hạn độ sâu hoặc chỉ cho lọc trước rồi mới phân trang.</p>`,
      tip: "Gắn vào bài toán danh sách hồ sơ, đừng nói lý thuyết keyset suông."
    }
  );
  mod.quiz.push(
    {
      q: "Điều kiện trên bảng bên phải của LEFT JOIN nên đặt ở đâu nếu vẫn muốn giữ dòng không khớp?",
      options: ["Trong WHERE", "Trong ON", "Trong ORDER BY"],
      correct: 1,
      explain: "WHERE loại các dòng NULL sau khi nối, LEFT JOIN bị biến thành INNER JOIN."
    },
    {
      q: "Index (don_vi_id, ngay_nop) dùng tốt cho câu nào?",
      options: [
        "Chỉ lọc theo ngay_nop, không có don_vi_id",
        "Lọc don_vi_id và khoảng ngay_nop",
        "Mọi câu SELECT *"
      ],
      correct: 1,
      explain: "Cột trái nhất của index phải có trong điều kiện. Lọc đơn vị rồi đến ngày là đúng thứ tự đó."
    }
  );
})();
