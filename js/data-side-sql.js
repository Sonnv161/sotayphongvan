(function () {
  const id = "sql";
  window.SIDE_PANELS[id] = {};
  function put(heading, title, steps, codeTitle, code) {
    window.SIDE_PANELS[id][heading] = {
      title,
      steps: steps.map((step) => ({ name: step[0], note: step[1], arrow: step[2] })),
      codeTitle,
      code
    };
  }

  put("Cơ bản — Câu SELECT chạy theo thứ tự nào", "Viết SELECT, đọc từ FROM", [
    ["FROM, JOIN", "lấy bảng", "WHERE"],
    ["bỏ dòng", "trước khi gom", "GROUP BY"],
    ["HAVING", "bỏ nhóm", "SELECT"],
    ["ORDER BY, LIMIT", "alias dùng được ở ORDER BY"]
  ], "ThuTu.sql", "select don_vi_id, count(*) as so\nfrom ho_so\nwhere ngay_nop >= date '2026-09-01'\ngroup by don_vi_id\nhaving count(*) > 10\norder by so desc;");

  put("Cơ bản — JOIN", "WHERE trên bảng phải biến LEFT thành INNER", [
    ["INNER", "chỉ dòng khớp", "LEFT"],
    ["giữ mọi hồ sơ", "đơn vị thiếu thì NULL", "WHERE ten ="],
    ["NULL bị loại", "thành inner", "đưa vào"],
    ["ON", "điều kiện của bảng phải"]
  ], "LeftJoin.sql", "select h.ma, d.ten\nfrom ho_so h\nleft join don_vi d\n  on d.id = h.don_vi_id\n and d.ten = 'So A';\n-- ten = 'So A' để trong WHERE\n-- sẽ làm mất hồ sơ chưa có đơn vị.");

  put("Cơ bản — Gom nhóm và NULL", "NOT IN gặp NULL thì hết kết quả", [
    ["WHERE", "lọc dòng", "GROUP BY"],
    ["HAVING", "lọc nhóm", "NULL"],
    ["NULL = NULL", "không true", "NOT IN"],
    ["danh sách có NULL", "nên dùng NOT EXISTS"]
  ], "ChuaDuyet.sql", "select h.*\nfrom ho_so h\nwhere not exists (\n  select 1 from phe_duyet p\n  where p.ho_so_id = h.id\n    and p.buoc = 'TRUONG_PHONG'\n);");

  put("Cơ bản — Bảng, kiểu cột và câu ghi", "Tiền là numeric, ngày nộp là date", [
    ["bigint identity", "id tự tăng", "varchar"],
    ["mã có trần độ dài", "numeric"],
    ["tiền, không dùng float", "date"],
    ["ngày nộp. Oracle DATE vẫn kèm giờ"]
  ], "TaoBang.sql", "create table ho_so (\n  id bigint generated always as identity primary key,\n  ma varchar(50) not null,\n  don_vi_id bigint not null,\n  ngay_nop date not null,\n  so_tien numeric(18, 0) not null default 0\n);");

  put("Cơ bản — Lọc, rẽ nhánh và tập hợp", "Thiếu ngoặc thì AND thắng OR", [
    ["AND", "hẹp", "OR"],
    ["nới, xét sau AND", "ngoặc", "đúng ý BA"],
    ["CASE", "đổi mã thành tên", "UNION ALL"],
    ["giữ trùng, rẻ hơn UNION"]
  ], "Loc.sql", "select ma,\n  case trang_thai\n    when 'CHO_DUYET' then 'Cho duyet'\n    else 'Khac'\n  end as ten\nfrom ho_so\nwhere don_vi_id = 10\n  and (trang_thai = 'CHO_DUYET' or trang_thai = 'DA_DUYET');");

  put("Cơ bản — Truy vấn con", "Một giá trị phải đúng một dòng", [
    ["IN", "nhiều dòng", "scalar"],
    ["một ô", "nhiều hơn là lỗi", "tương quan"],
    ["chạy theo từng hồ sơ", "EXISTS hoặc JOIN"]
  ], "DonViHn.sql", "select ma\nfrom ho_so\nwhere don_vi_id in (\n  select id from don_vi where tinh = 'HN'\n);");

  put("Trung cấp — Khóa, ràng buộc và chuẩn hóa", "Tên đơn vị không nằm trên hồ sơ", [
    ["khóa chính", "một dòng", "khóa ngoại"],
    ["don_vi_id phải tồn tại", "3NF"],
    ["tên đơn vị", "một chỗ để sửa", "CHECK"],
    ["tiền không âm"]
  ], "RangBuoc.sql", "alter table ho_so\n  add constraint fk_ho_so_don_vi\n  foreign key (don_vi_id) references don_vi(id);\n\nalter table ho_so\n  add constraint ck_tien check (so_tien >= 0);");

  put("Trung cấp — Transaction và mức cô lập", "Read Committed vẫn mất cập nhật", [
    ["A và B đọc version 3", "B commit version 4", "A"],
    ["ghi đè nếu không có version", "không phải dirty read", "báo cáo"],
    ["ảnh đứng yên", "không nâng isolation cả hệ thống"]
  ], "Version.sql", "update ho_so\nset trang_thai = 'DA_DUYET', version = version + 1\nwhere id = ? and version = ?;\n-- 0 dòng: người kia đã sửa, trả 409.");

  put("Trung cấp — Index và cách đọc plan", "Cột trái của index phải có trong WHERE", [
    ["(don_vi_id, ngay_nop)", "lọc đơn vị rồi ngày", "không"],
    ["chỉ lọc ngày", "index này không dùng", "hàm"],
    ["date(ngay_nop)", "mất index", "EXPLAIN"],
    ["tìm nút đắt, không thêm index mù"]
  ], "KhoangNgay.sql", "explain\nselect id from ho_so\nwhere don_vi_id = 10\n  and ngay_nop >= date '2026-09-01'\n  and ngay_nop < date '2026-10-01';");

  put("Trung cấp — JOIN làm số đếm bị nhân", "1 hồ sơ, 3 lần duyệt, count thành 3", [
    ["join phe_duyet", "nhân dòng", "count(*)"],
    ["đếm dòng đã nhân", "sai số hồ sơ", "sửa"],
    ["count(distinct h.id)", "hoặc EXISTS rồi đếm hồ sơ"]
  ], "DemDung.sql", "select h.don_vi_id, count(distinct h.id) as so_ho_so\nfrom ho_so h\njoin phe_duyet p on p.ho_so_id = h.id\nwhere p.buoc = 'TRUONG_PHONG'\ngroup by h.don_vi_id;");

  put("Trung cấp — Hai cán bộ sửa cùng một dòng", "Người đến sau không ghi được", [
    ["cùng đọc version 3", "B cập nhật được", "version 4"],
    ["A where version = 3", "0 dòng", "409"],
    ["tải lại", "không ghi đè"]
  ], "HaiCanBo.sql", "update ho_so\nset trang_thai = 'DA_DUYET', version = 4\nwhere id = 15 and version = 3;\n-- Người thứ hai chạy cùng câu: cập nhật 0 dòng.");

  put("Trung cấp — Một báo cáo đếm theo đơn vị", "Điều kiện hồ sơ nằm ở ON", [
    ["LEFT JOIN", "còn đơn vị không có hồ sơ", "ON"],
    ["tháng và chưa hủy", "WHERE sẽ làm mất đơn vị trống", "GROUP BY"],
    ["id và tên", "hai đơn vị có thể trùng tên"]
  ], "BaoCao.sql", "select d.ten, count(h.id) as so_ho_so\nfrom don_vi d\nleft join ho_so h\n  on h.don_vi_id = d.id\n and h.ngay_nop >= date '2026-09-01'\n and h.ngay_nop < date '2026-10-01'\n and h.trang_thai <> 'DA_HUY'\ngroup by d.id, d.ten;");

  put("Trung cấp — Khóa ngoại và ON DELETE", "Xóa đơn vị không được kéo theo hồ sơ", [
    ["RESTRICT", "còn hồ sơ thì không xóa đơn vị", "CASCADE"],
    ["chỉ dòng con không sống một mình", "SET NULL"],
    ["chỉ khi được phép không thuộc đơn vị", "index"],
    ["cột khóa ngoại", "xóa cha đỡ phải quét cả bảng"]
  ], "XoaCha.sql", "alter table ho_so\n  add constraint fk_ho_so_don_vi\n  foreign key (don_vi_id) references don_vi(id)\n  on delete restrict;\n\ncreate index ix_ho_so_don_vi on ho_so(don_vi_id);");

  put("Trung cấp — View và cách đọc plan ngắn", "View không tự làm câu nhanh hơn", [
    ["VIEW", "câu SELECT có tên", "planner"],
    ["gắn vào câu ngoài", "rồi mới lập kế hoạch", "EXPLAIN"],
    ["nút đắt", "seq scan bảng lớn hoặc sort", "ANALYZE"],
    ["đừng chạy update nặng trên production"]
  ], "ViewHieuLuc.sql", "create view ho_so_hieu_luc as\nselect * from ho_so where trang_thai <> 'DA_HUY';\n\nexplain select * from ho_so_hieu_luc where don_vi_id = 10;");

  put("Nâng cao — Khóa dòng, deadlock, SKIP LOCKED", "Khóa ngắn, một thứ tự", [
    ["FOR UPDATE", "giữ đến commit", "không gọi mạng"],
    ["SKIP LOCKED", "worker lấy dòng chưa ai giữ", "không"],
    ["màn hình một hồ sơ", "deadlock"],
    ["A chờ B, B chờ A", "thử lại ít lần"]
  ], "LayViec.sql", "select id from ho_so\nwhere trang_thai = 'CHO_GUI'\norder by id\nfor update skip locked\nlimit 20;");

  put("Nâng cao — CTE, hàm cửa sổ và phân trang", "OFFSET sâu phải đi qua dòng bị bỏ", [
    ["ROW_NUMBER", "hồ sơ mới nhất mỗi đơn vị", "WITH"],
    ["CTE", "báo cáo nhiều bước, cây đơn vị", "OFFSET"],
    ["càng sâu càng chậm", "mốc"],
    ["ngày + id của dòng cuối"]
  ], "MoiNhat.sql", "select * from (\n  select h.*,\n    row_number() over (\n      partition by don_vi_id\n      order by ngay_nop desc, id desc) as rn\n  from ho_so h\n) t\nwhere rn = 1;");

  put("Nâng cao — PostgreSQL, Oracle và thiết kế bảng hồ sơ", "Cùng ý, khác chữ", [
    ["PostgreSQL date", "không có giờ", "Oracle DATE"],
    ["có giờ", "lọc bằng khoảng", "bảng hồ sơ"],
    ["trạng thái hiện tại", "bảng lịch sử"],
    ["mỗi lần đổi một dòng"]
  ], "HaiHe.sql", "-- PostgreSQL\nwhere ngay_nop >= date '2026-09-01'\n  and ngay_nop < date '2026-09-02'\n\n-- Oracle cùng ý\nwhere ngay_nop >= date '2026-09-01'\n  and ngay_nop < date '2026-09-02'");
})();
