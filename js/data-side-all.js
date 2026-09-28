(function () {
  function put(id, heading, title, steps, codeTitle, code) {
    window.SIDE_PANELS[id] = window.SIDE_PANELS[id] || {};
    window.SIDE_PANELS[id][heading] = {
      title,
      steps: steps.map((step) => ({ name: step[0], note: step[1], arrow: step[2] })),
      codeTitle,
      code
    };
  }

  put("kinh-nghiem", "Cách dùng mục này", "Bốn nhịp khi mở miệng", [
    ["Bối cảnh", "hệ thống nào, bạn giữ phần nào", "việc"],
    ["Việc của em", "một quyết định", "khi lỗi"],
    ["Trạng thái, mã bản tin", "không vẽ mạng nội bộ"]
  ], "Câu mở", "Em làm backend từ 2023, Java và Tibco,\nđồng bộ qua kênh một chiều, Oracle và PostgreSQL.\nEm cũng làm API Spring Boot cho dữ liệu hạ tầng.");

  put("kinh-nghiem", "90 giây — Dịch vụ công xuất nhập cảnh", "Kênh một chiều có trạng thái", [
    ["Vùng trong", "ghi nhận đã đưa vào kênh", "Diode"],
    ["Một chiều", "không có HTTP trả ngay", "vùng ngoài"],
    ["Áp dụng theo mã", "gửi lại không tạo hồ sơ mới", "kẹt"],
    ["Lấy một mã", "xem đang chờ, nhận hay lỗi"]
  ], "TrangThaiKenh", "DA_TIEP_NHAN\nDANG_GUI\nBEN_KIA_DA_NHAN\nLOI\n\n-- gửi lại đúng mã, không tạo dòng thứ hai");

  put("kinh-nghiem", "90 giây — LGSP và tích hợp liên thông", "Adapter nuốt hợp đồng bên ngoài", [
    ["Service nghiệp vụ", "gọi method nội bộ", "adapter"],
    ["Đổi dữ liệu, timeout, mã lỗi", "LGSP"],
    ["Lô có mốc", "một bản lỗi không mất cả lô"]
  ], "Adapter", "String gui(HoSoNoiBo hoSo) {\n  GoiTin tin = map(hoSo);\n  return lgsp.gui(tin);\n}\n// Đổi field bên ngoài thì sửa ở đây.");

  put("kinh-nghiem", "90 giây — Job nền, sân bay và đối soát", "Mốc mới hơn mới được áp dụng", [
    ["Trung tâm", "nguồn", "job"],
    ["Lô + mốc đã xong", "sân bay", "chỉ nhận mốc mới"],
    ["Mã giao dịch", "không cộng tiền lần hai"]
  ], "ApDung", "if (banTin.moc() <= daLuu) {\n  return;\n}\nluu(banTin);\n\ninsert into giao_dich(ma) values (?);\n-- trùng mã thì không cộng thêm");

  put("kinh-nghiem", "90 giây — Hạ tầng giao thông bằng Spring Boot", "Một format, đếm không bị nhân", [
    ["API", "một kiểu lỗi, một kiểu trang", "service"],
    ["Vòng đời tài sản", "không sửa trạng thái từ nhiều chỗ", "SQL"],
    ["join biến động", "count distinct"]
  ], "DemTaiSan.sql", "select count(distinct t.id)\nfrom tai_san t\njoin bien_dong b on b.tai_san_id = t.id\nwhere b.ngay >= date '2026-01-01'\n  and b.ngay < date '2026-02-01';");

  put("kinh-nghiem", "Nếu họ hỏi giai đoạn firmware", "Gói tin gửi lại là cùng bài với job", [
    ["Modbus, UART", "timeout, gửi lại", "không"],
    ["xử lý một gói hai lần", "sang backend"],
    ["mã bản tin, ack, đối soát"]
  ], "CauNoi", "Em quen trường hợp chạy lại trước trường hợp đẹp.\nFirmware không thay kinh nghiệm API.\nNó giải thích vì sao em để ý gửi trùng.");

  put("kinh-nghiem", "Thứ tự kể khi họ bảo hãy vẽ hệ thống", "Năm hộp, rồi dừng ở biên của bạn", [
    ["Ai dùng", "cán bộ hoặc đơn vị liên thông", "cửa"],
    ["API hoặc kênh, có xác thực", "phần em giữ"],
    ["module, job, adapter", "DB"],
    ["trạng thái hiện tại và lịch sử"]
  ], "ThuTuKe", "1. Ai dùng\n2. Cửa vào\n3. Phần em giữ\n4. Dữ liệu nằm ở đâu\n5. Một sự cố em khoanh bằng mã hồ sơ");

  put("lo-trinh", "Mức Middle khoảng 3 năm trông như thế nào", "Tự xong một module, biết vì sao", [
    ["Nhận yêu cầu", "hỏi rule còn mơ hồ", "thiết kế"],
    ["API và bảng", "code, test", "deploy"],
    ["Đọc log khi lỗi", "báo rủi ro sớm"]
  ], "ViecCuaMiddle", "Em tự chia module.\nEm nói vì sao chọn queue chứ không chỉ nói em dùng queue.\nEm báo khi ước lượng lệch, không đợi đến hạn.");

  put("lo-trinh", "Khung trả lời 90 giây", "Bốn câu, không đọc định nghĩa dài", [
    ["Định nghĩa", "một câu", "việc"],
    ["Một tình huống đã làm", "đánh đổi"],
    ["Mạnh chỗ nào, yếu chỗ nào", "khi lỗi"],
    ["Log, retry, rollback"]
  ], "Mau", "Idempotent là gọi lại không tạo thêm tác dụng.\nEm gắn mã bản tin khi đồng bộ.\nTimeout không được coi là thành công.");

  put("oop", "Bốn trụ OOP trong backend", "Đổi trạng thái phải đi qua method", [
    ["private field", "đóng gói", "composition"],
    ["service giữ repository", "không kế thừa sâu", "interface"],
    ["Notifier", "email hoặc tin nhắn", "controller"],
    ["chỉ thấy use case"]
  ], "HoSo.java", "public void duyet() {\n  if (!\"CHO_DUYET\".equals(trangThai)) {\n    throw new IllegalStateException(\"Sai buoc\");\n  }\n  trangThai = \"DA_DUYET\";\n}");

  put("oop", "SOLID ở mức thực dụng", "Tách khi có lý do sửa thứ hai", [
    ["Controller", "HTTP", "use case"],
    ["một việc duyệt", "interface"],
    ["repository và notifier", "thêm kênh"],
    ["class mới, không sửa chuỗi if"]
  ], "DuyetHoSo", "class DuyetHoSoService {\n  DuyetHoSoService(HoSoStore store, Notifier notifier) {\n    this.store = store;\n    this.notifier = notifier;\n  }\n}");

  put("pattern", "Pattern nên nói được", "Adapter là việc em đã làm", [
    ["Service", "gọi interface nội bộ", "adapter"],
    ["Đổi XML, timeout, mã lỗi", "đối tác"],
    ["Đổi nhà cung cấp", "viết adapter mới", "không"],
    ["singleton giữ user", "mất dữ liệu request"]
  ], "TaxGateway", "interface KenhGui {\n  void gui(HoSo hoSo);\n}\n\nclass AdapterLgsp implements KenhGui {\n  public void gui(HoSo hoSo) {\n    lgsp.send(map(hoSo));\n  }\n}");

  put("nest", "Event loop, phần Middle cần nói đúng", "Một luồng chính, đừng tính nặng trên đó", [
    ["Request", "await IO thì nhường", "CPU dài"],
    ["mọi request khác chờ", "worker"],
    ["Promise không await", "trả 200 trước khi ghi xong"]
  ], "QuenAwait", "const hoSo = await repo.save(dto);\nawait queue.add(hoSo.id);\nreturn hoSo;\n\n// Thiếu await: HTTP đã 200\n// trong khi dòng con chưa ghi.");

  put("nest", "Các mảnh của Nest", "Cùng ý với Spring, khác tên", [
    ["Guard", "đã đăng nhập và đủ quyền chưa", "Pipe"],
    ["validate DTO", "Controller", "Interceptor"],
    ["đo thời gian", "Filter"],
    ["một format lỗi"]
  ], "ThuTu", "middleware\n -> guard\n -> pipe\n -> interceptor trước\n -> handler\n -> interceptor sau\n -> exception filter");

  put("rest", "Bài nói — Thiết kế một API để trả lời miệng", "Nộp hồ sơ không hứa liên thông đã xong", [
    ["POST /ho-so", "tiếp nhận", "201"],
    ["mã và trạng thái chờ", "job hoặc kênh", "GET"],
    ["trạng thái đồng bộ", "gửi lại"],
    ["cùng khóa, cùng hồ sơ"]
  ], "TaoHoSo", "POST /ho-so\nIdempotency-Key: 8f3...\n\n201\n{ \"id\": 15, \"trangThai\": \"CHO_DONG_BO\" }");

  put("rest", "Hợp đồng API ổn", "Danh sách luôn có trang", [
    ["GET", "không đổi dữ liệu", "POST"],
    ["tạo", "PATCH"],
    ["sửa một phần", "DELETE"],
    ["hồ sơ nhà nước thường là hủy, không xóa"]
  ], "Trang", "GET /ho-so?donViId=10&page=0&size=20\n\n{\n  \"items\": [],\n  \"page\": 0,\n  \"size\": 20\n}");

  put("rest", "Đồng bộ và bất đồng bộ", "Nút bấm không có nghĩa bên kia đã nhận", [
    ["Vài trăm mili giây", "API đồng bộ", "gọi nhiều nơi"],
    ["202 + mã tác vụ", "client hỏi trạng thái", "BA"],
    ["thấy chữ đang đồng bộ"]
  ], "ChapNhan", "POST /dong-bo\n202 Accepted\n{ \"maTacVu\": \"job-15\", \"trangThai\": \"DANG_GUI\" }");

  put("auth", "Bài nói — Đăng nhập, quyền và phạm vi dữ liệu", "Token hợp lệ chưa đủ để xem hồ sơ 15", [
    ["JWT", "bạn là ai", "role"],
    ["được duyệt không", "service"],
    ["hồ sơ này thuộc đơn vị bạn không", "không thuộc"],
    ["403 hoặc 404, không trả thân"]
  ], "KiemPhamVi", "HoSo hoSo = repo.findById(id).orElseThrow();\nif (!phamVi.thuoc(user, hoSo.getDonViId())) {\n  throw new LoiNghiepVu(\"CAM\", \"Ngoai pham vi\");\n}");

  put("auth", "Ba khái niệm", "Audit không thay phân quyền", [
    ["Authentication", "đăng nhập", "Authorization"],
    ["được làm gì", "phạm vi dữ liệu"],
    ["hồ sơ đơn vị nào", "Audit"],
    ["đã làm gì, không sửa được"]
  ], "BaViec", "ai: user-42\nviec: DUYET\nphamVi: don-vi-10\naudit: version 3 -> 4, luc 2026-09-28T02:00:00Z");

  put("auth", "JWT thực dụng", "Access ngắn, refresh thu hồi được", [
    ["Access", "vài phút, ký", "không nhét giấy tờ"],
    ["Refresh", "lưu server", "logout"],
    ["xóa refresh", "API nhạy cảm"],
    ["hỏi lại quyền, không chỉ tin claim cũ"]
  ], "Claim", "{\n  \"sub\": \"user-42\",\n  \"roles\": [\"CV\"],\n  \"exp\": 1750000000\n}\n// Không để số giấy tờ trong payload.");

  put("tx", "Bài nói — Giữ dữ liệu đúng khi có hai người và một kênh ngoài", "Lịch sử đi cùng lần duyệt", [
    ["Transaction", "đổi trạng thái + ghi lịch sử", "commit"],
    ["Rồi mới gửi kênh", "timeout"],
    ["không biết đã tới chưa", "mã bản tin"],
    ["gửi lại không tạo hồ sơ mới"]
  ], "Bien", "begin\n  update ho_so set trang_thai = 'DANG_GUI'\n  insert into lich_su ...\ncommit\n-- gọi kênh ở ngoài\nbegin\n  update ho_so set trang_thai = 'DA_NHAN'\ncommit");

  put("tx", "ACID ở mức nói được", "Cả khối hoặc không gì được giữ", [
    ["Atomicity", "duyệt và lịch sử cùng sống", "Isolation"],
    ["không đọc dở dang của người khác", "ngắn"],
    ["không gọi HTTP khi đang giữ khóa"]
  ], "Ngan", "@Transactional\npublic void duyet(Long id) {\n  hoSo.doiTrangThai();\n  lichSu.ghi(id);\n  // không client.gui() ở đây\n}");

  put("tx", "Mất cập nhật và khóa", "Version chặn ghi đè", [
    ["Hai người đọc version 3", "một người ghi version 4", "người kia"],
    ["0 dòng", "409", "FOR UPDATE"],
    ["chỉ khi phải giữ dòng trong vài câu ngắn"]
  ], "CapNhat", "update ho_so\nset version = version + 1, trang_thai = 'DA_DUYET'\nwhere id = ? and version = ?;");

  put("tx", "Log", "QA gửi trace id là tìm được dòng", [
    ["info", "đã nhận mã", "warn"],
    ["timeout sẽ thử lại", "error"],
    ["stack một lần trên server", "không"],
    ["mật khẩu, token, giấy tờ đầy đủ"]
  ], "Log", "log.info(\"Nhan ma={} trace={}\", ma, traceId);\nlog.error(\"Gui kenh that bai ma={}\", ma, ex);");

  put("mongo-redis", "Bài nói — Redis và Mongo, nói đúng việc đã dùng", "Sự thật của hồ sơ nằm ở DB quan hệ", [
    ["PostgreSQL hoặc Oracle", "hồ sơ, unique, báo cáo", "Redis"],
    ["cache, khóa có hạn", "không", "nơi duy nhất ghi đã duyệt"],
    ["Mongo", "chỉ khi tài liệu ít quan hệ"]
  ], "Chot", "insert into da_xu_ly(ma) values (?);\n-- Redis chỉ để giảm đọc lặp\n-- hết Redis, unique vẫn chặn lần ghi thứ hai");

  put("mongo-redis", "MongoDB", "Nhúng cái luôn đi cùng, tham chiếu cái dùng chung", [
    ["Document hồ sơ", "nhúng địa chỉ", "tham chiếu"],
    ["đơn vị", "vì nhiều hồ sơ dùng", "index"],
    ["điều kiện tìm vẫn cần", "không chuyển hết Postgres"]
  ], "Chon", "Ho so co don vi, trang thai, bao cao join\n-> PostgreSQL.\n\nPhu luc form doi thuong xuyen\n-> cot JSONB, chua can Mongo.");

  put("mongo-redis", "Redis", "Xóa cache sau khi ghi DB", [
    ["Đọc cache", "trượt thì đọc DB", "ghi"],
    ["commit DB", "rồi xóa key", "TTL"],
    ["lưới nếu lệnh xóa thất bại", "key"],
    ["có mã đơn vị, khỏi lẫn dữ liệu"]
  ], "CacheAside", "String key = \"don-vi:\" + id;\nDonVi dv = cache.get(key);\nif (dv == null) {\n  dv = repo.find(id);\n  cache.set(key, dv, Duration.ofMinutes(5));\n}");

  put("broker", "Bài nói — Nếu họ hỏi Kafka trong khi bạn đã làm kênh đồng bộ", "Kể bằng mã bản tin trước khi kể tên", [
    ["Bên gửi", "đưa bản tin có mã", "bên nhận"],
    ["ghi rồi mới ack", "chạy lại"],
    ["không tạo lần hai", "bản hỏng"],
    ["sang hàng lỗi, không kẹt cả hàng"]
  ], "Nhan", "if (repo.existsByMa(ma)) {\n  ack();\n  return;\n}\nrepo.save(banTin);\nack();");

  put("broker", "Các khái niệm", "Ack muộn và idempotent đi cùng nhau", [
    ["Producer", "gửi", "Consumer"],
    ["nhận và ghi", "ack sau khi ghi"],
    ["chết trước ack thì giao lại", "dead letter"],
    ["hết lượt retry"]
  ], "Ack", "nhan()\nghi DB unique(ma)\nack()\n\n// ack truoc khi ghi\n// process chet la mat viec");

  put("broker", "Kafka và NATS, cách nói vừa sức", "Thứ tự một hồ sơ, không phải toàn hệ thống", [
    ["Key = mã hồ sơ", "cùng partition", "đọc lần lượt"],
    ["tăng partition", "không còn thứ tự giữa hai hồ sơ", "DB"],
    ["rule trạng thái vẫn là chốt"]
  ], "Key", "producer.send(maHoSo, suKien);\n\n// Không duyệt nếu trạng thái chưa phải DA_TIEP_NHAN\nupdate ho_so set trang_thai = 'DA_DUYET'\nwhere id = ? and trang_thai = 'DA_TIEP_NHAN';");

  put("micro", "Bài nói — Kiến trúc nhiều phần, nói đúng tầm việc bạn đã làm", "Nói phần bạn giữ, không vẽ cả nền tảng", [
    ["Cán bộ", "API", "module em giữ"],
    ["job và adapter", "DB của module", "kênh"],
    ["bên kia được phép trễ", "có trạng thái"]
  ], "Bien", "Em giữ API, job đồng bộ và adapter.\nEm không đọc bảng của hệ thống bên kia.\nChữ ký số nếu đội khác giữ thì em nói đó là biên.");

  put("micro", "Khi nào tách service", "Cùng đội, cùng kỳ phát hành thì chưa tách", [
    ["Một ứng dụng", "nhiều module", "tách khi"],
    ["deploy riêng hoặc được phép trễ", "không"],
    ["mỗi bảng một service", "vì sẽ gánh mã bản tin sớm"]
  ], "ChuaTach", "Duyet va ghi lich su phai cung commit\n-> cung mot service.\n\nDay sang san bay duoc phep tre\n-> kenh bat dong bo, khong tach DB chi de co ten microservice.");

  put("micro", "Thành phần hay gặp", "Timeout trong ngắn hơn timeout ngoài", [
    ["Gateway", "xác thực thô", "service"],
    ["kiểm tra lại phạm vi", "timeout 2s"],
    ["đối tác chết thì ngắt", "trace id"],
    ["một mã xuyên các chặng"]
  ], "Timeout", "Cong cho A: 8s\nA cho doi tac: 2s\n\nHet 2s thi tra loi co kiem soat,\nkhong giu luong den khi cong cat.");

  put("micro", "Bốn tính chất Middle cần nói bằng ví dụ", "Thêm pod không sửa câu SQL chậm", [
    ["Đo DB và mạng trước", "scale"],
    ["thêm pod khi không giữ session trong RAM", "sẵn sàng"],
    ["pod chết, pod khác nhận", "chịu lỗi"],
    ["kênh thông báo hỏng không được chặn duyệt nội bộ"]
  ], "TachLoi", "duyet noi bo: van commit\ntrang thai lien thong: CHO_GUI_LAI\n\nKhong de timeout kenh lam cham ca man hinh tra cuu.");

  put("k8s", "Bài nói — Kubernetes ở mức đọc được sự cố, không kể như đã quản trị cụm", "Đọc pod và log, không kể như quản trị cụm", [
    ["Image", "bản đã qua UAT", "Pod"],
    ["lần chạy, có thể chết", "Deployment"],
    ["giữ số pod", "Service"],
    ["địa chỉ ổn định vì IP pod đổi"]
  ], "XemUAT", "pod Running hay CrashLoop\nevent thieu secret khong\nlog dung ban vua deploy\nma ho so QA dang bam");

  put("k8s", "Docker", "Cùng image, khác cấu hình", [
    ["Dockerfile", "không copy .env", "image"],
    ["không chứa mật khẩu", "container"],
    ["log ra stdout", "khỏi mất khi pod biến mất"]
  ], "Dockerfile", "FROM eclipse-temurin:21-jre\nCOPY app.jar app.jar\nUSER app\nENTRYPOINT [\"java\", \"-jar\", \"app.jar\"]\n# DB_PASSWORD lay tu bien moi truong luc chay");

  put("k8s", "Các object Kubernetes", "Readiness khác liveness", [
    ["Readiness", "chưa nối DB thì đừng nhận request", "Liveness"],
    ["chỉ khi process kẹt cứng", "ConfigMap"],
    ["cấu hình thường", "Secret"],
    ["mật khẩu, không commit"]
  ], "Probe", "readinessProbe:\n  httpGet: { path: /health/ready, port: 8080 }\nlivenessProbe:\n  httpGet: { path: /health/live, port: 8080 }\n# readiness ma kiem tra doi tac cham\n# se giet pod lanh");

  put("k8s", "Khi UAT báo lỗi", "Đúng bản chưa, rồi mới đọc log", [
    ["Số bản deploy", "có phải bản QA đang thử", "pod"],
    ["Running hay restart vòng", "log"],
    ["theo mã hồ sơ", "sửa trên nhánh"],
    ["không sửa trong container"]
  ], "ThuTu", "1. Dung image da qua UAT chua\n2. Pod va event\n3. Log theo ma ho so\n4. Sua, ra ban moi, dua lai UAT");

  put("cicd", "Git trong đội", "Review là chỗ bắt lỗ hổng quyền", [
    ["Nhánh ngắn", "merge request", "người khác"],
    ["nhìn diff quyền và SQL", "không"],
    ["commit secret hay dữ liệu thật"]
  ], "Review", "Xem API chi tiet co loc don vi khong.\nXem sort field co noi thang vao SQL khong.\nXem log co in body giay to khong.");

  put("cicd", "Pipeline", "Production chạy đúng bản đã qua UAT", [
    ["CI", "build và test", "image"],
    ["gắn commit, không dùng latest", "DEV"],
    ["tự lên", "UAT và production"],
    ["có bước duyệt, cùng image"]
  ], "Ban", "image: registry/ho-so:1.4.12\n# 1.4.12 la commit da nghiem thu\n# latest co the khac giua hai lan keo");

  put("cicd", "Sự cố", "Khoanh vùng trước khi sửa đoán", [
    ["Một người hay mọi người", "từ lúc deploy", "log theo trace"],
    ["bản mới thì lùi bản cũ", "rồi"],
    ["viết vì sao lần này lọt", "không sửa DB tay khi chưa có lệnh đã review"]
  ], "SuCo", "Lay ma ho so va thoi diem.\nXem dung ban khong.\nNeu dien rong va dung ban moi: lui ban.\nSau do them test cho dung case.");

  put("gov", "Bài nói — Dự án cơ quan nhà nước theo đúng việc trên CV", "Mức 4 cần trạng thái, không chỉ nút thành công", [
    ["Mức 3", "nộp trực tuyến", "mức 4"],
    ["nộp và nhận kết quả", "phần em"],
    ["kênh, job, trạng thái", "nghiệm thu"],
    ["chỉ một mã, không sửa tay hàng loạt"]
  ], "Muc", "Muc 3: nop ho so truc tuyen.\nMuc 4: nop va nhan ket qua truc tuyen.\nEm giu dong bo va trang thai ben duoi,\nkhong phai toan bo giao dien cong.");

  put("gov", "Vòng đời một gói công việc", "Chốt rule trước khi code", [
    ["BA", "chỗ còn mơ hồ", "thiết kế"],
    ["API, bảng, quyền", "DEV rồi UAT", "phiếu lỗi"],
    ["đúng phạm vi", "nghiệm thu"],
    ["đối chiếu từng chức năng"]
  ], "ThuTuViec", "Hoi rule chuyen trang thai.\nChot API voi frontend.\nTest case gui lai va sai quyen\ntruoc khi vao UAT.");

  put("gov", "Những yêu cầu hay lặp lại", "Không xóa hồ sơ đã phát sinh", [
    ["Hủy", "có người và lý do", "audit"],
    ["ai, lúc nào, trước, sau", "cùng transaction", "môi trường"],
    ["không mang dữ liệu thật xuống máy cá nhân"]
  ], "Audit", "insert into lich_su(ho_so_id, truoc, sau, nguoi, luc)\nvalues (?, 'CHO_DUYET', 'DA_DUYET', ?, now());\n-- cung transaction voi update ho_so");

  put("gov", "Secure coding ở mức làm hàng ngày", "Tham số hóa và kiểm tra id", [
    ["SQL", "dấu hỏi, không nối chuỗi", "id trên URL"],
    ["kiểm tra đơn vị", "file"],
    ["trần kích thước, không tin tên file", "lỗi"],
    ["không trả câu SQL ra client"]
  ], "Query", "PreparedStatement ps = conn.prepareStatement(\n    \"select id from ho_so where ma = ? and don_vi_id = ?\");\nps.setString(1, ma);\nps.setLong(2, donViCuaUser);");

  put("hanh-vi", "Cách kể", "Một sự cố, không đổ lỗi đồng nghiệp", [
    ["Bối cảnh", "một câu", "việc bạn làm"],
    ["hai câu", "kết quả"],
    ["một câu", "bài học"],
    ["một câu"]
  ], "STAR", "Kenh dung, ben kia chua thay ho so.\nEm lay mot ma, thay no nam o hang loi.\nGui lai dung ma, hai dau khop so luong.\nLan sau timeout khong duoc danh dau la thanh cong.");
})();
