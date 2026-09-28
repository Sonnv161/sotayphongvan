(function () {
  const id = "java";
  window.SIDE_PANELS[id] = window.SIDE_PANELS[id] || {};
  function put(heading, title, steps, codeTitle, code) {
    window.SIDE_PANELS[id][heading] = {
      title,
      steps: steps.map((step) => ({ name: step[0], note: step[1], arrow: step[2] })),
      codeTitle,
      code
    };
  }

  put("Cơ bản — JDK, JRE và JVM", "Mã nguồn thành process", [
    [".java", "bạn viết", "javac"],
    [".class", "bytecode", "JVM"],
    ["Process", "chạy trên Windows hoặc Linux"]
  ], "Lệch phiên bản", "javac --version\njava --version\n\n# JDK 21 dịch, JVM 17 chạy:\n# UnsupportedClassVersionError");

  put("Cơ bản — Kiểu dữ liệu, biến và so sánh", "== không so nội dung", [
    ["int, long", "giữ giá trị", "khác"],
    ["Integer, String", "giữ tham chiếu", "=="],
    ["cùng số 1000", "có thể là hai object", "so"],
    ["equals", "so nội dung"]
  ], "So id", "Integer a = Integer.valueOf(1000);\nInteger b = Integer.valueOf(1000);\na == b;          // false\na.equals(b);     // true\n\nBigDecimal tien = new BigDecimal(\"10000\");");

  put("Cơ bản — Lớp, interface, abstract, enum", "Hợp đồng và giá trị cố định", [
    ["interface Kenh", "hợp đồng gửi", "làm"],
    ["KenhDiode", "một cách gửi", "không kế thừa"],
    ["enum TrangThai", "CHO, DA_DUYET", "== được"]
  ], "TrangThai.java", "public enum TrangThai {\n  CHO_DUYET, DA_DUYET, DA_HUY\n}\n\nif (hoSo.getTrangThai() == TrangThai.CHO_DUYET) {\n  hoSo.duyet();\n}");

  put("Cơ bản — String bất biến", "Nối chuỗi tạo object mới", [
    ["\"HaNoi\"", "trong pool", "+"],
    ["chuỗi mới", "vòng lặp thì tốn", "đổi"],
    ["StringBuilder", "ghép phần cố định", "vẫn"],
    ["?", "giá trị người dùng là tham số"]
  ], "KhongNoiSql", "StringBuilder sql = new StringBuilder(\n    \"select id from ho_so where 1=1\");\nif (ma != null) {\n  sql.append(\" and ma = ?\");\n}\nps.setString(1, ma);");

  put("Cơ bản — Method, overload và override", "Chọn lúc dịch khác chọn lúc chạy", [
    ["tim(ma)", "overload", "thêm tham số"],
    ["tim(ma, donViId)", "vẫn cùng tên", "khác"],
    ["@Override trangThai()", "lớp con, lúc chạy"]
  ], "HoSo.java", "String tim(String ma) { return tim(ma, null); }\n\nString tim(String ma, Long donViId) {\n  return repository.tim(ma, donViId);\n}\n\n@Override\nString trangThai() { return \"DA_DUYET\"; }");

  put("Cơ bản — static, final và cách truyền tham số", "Sửa field thì người gọi thấy", [
    ["static", "dùng chung, không có this", "đừng"],
    ["giữ user static", "request sau bị đè", "final"],
    ["field final", "không gán lại biến", "truyền"],
    ["bản sao tham chiếu", "gán new không đổi biến ngoài"]
  ], "DoiTen.java", "void doiTen(HoSo hs) {\n  hs.setTen(\"A\");     // người gọi thấy\n  hs = new HoSo();     // người gọi không đổi biến\n}");

  put("Cơ bản — null, mảng và vòng lặp", "Null ở biên, không để vỡ giữa đường", [
    ["null", "chưa trỏ object", "gọi method"],
    ["NullPointerException", "lỗi gặp nhiều", "chặn"],
    ["không thấy hồ sơ", "ném lỗi nghiệp vụ", "không"],
    ["for-each vừa xóa", "ConcurrentModificationException"]
  ], "TimHoSo.java", "HoSo hoSo = repository.findByMa(ma)\n    .orElseThrow(() -> new LoiNghiepVu(\"KHONG_THAY\", ma));\n\nString maAnToan = Objects.equals(a, b) ? a : \"\";");

  put("Cơ bản — Một lớp nhỏ đọc từ trên xuống", "Rule nằm trong lớp, không nằm ở controller", [
    ["constructor", "thiếu mã thì ném lỗi", "trạng thái"],
    ["CHO_DUYET", "trạng thái đầu", "duyet()"],
    ["đúng bước", "mới được đổi", "private"],
    ["trangThai", "bên ngoài không gán trực tiếp"]
  ], "HoSo.java", "public void duyet() {\n  if (!\"CHO_DUYET\".equals(trangThai)) {\n    throw new IllegalStateException(\"Sai buoc\");\n  }\n  this.trangThai = \"DA_DUYET\";\n}");

  put("Trung cấp — equals, hashCode, Comparable", "Hash trước, equals sau", [
    ["hashCode", "chọn ô", "rồi"],
    ["equals", "so trong ô", "quên hash"],
    ["Set chứa cả hai", "dù bạn tưởng chúng bằng nhau", "khóa"],
    ["mã hồ sơ", "ổn định hơn id còn null"]
  ], "BanTin.java", "@Override public boolean equals(Object o) {\n  return o instanceof BanTin b && ma.equals(b.ma);\n}\n@Override public int hashCode() {\n  return ma.hashCode();\n}");

  put("Trung cấp — Exception và đóng tài nguyên", "Đóng connection kể cả khi có lỗi", [
    ["try-with-resources", "AutoCloseable", "đóng"],
    ["Connection về pool", "kể cả return", "nuốt lỗi"],
    ["catch rỗng", "mất stack", "đổi"],
    ["runtime có mã", "map thành HTTP ở biên"]
  ], "JdbcTim.java", "try (Connection conn = dataSource.getConnection();\n     PreparedStatement ps = conn.prepareStatement(\n         \"select id from ho_so where ma = ?\")) {\n  ps.setString(1, ma);\n  try (ResultSet rs = ps.executeQuery()) {\n    return rs.next();\n  }\n}");

  put("Trung cấp — Collection nên chọn cái nào", "Mặc định là ArrayList và HashMap", [
    ["ArrayList", "thứ tự, cho trùng", "tra cứu"],
    ["HashMap", "theo mã", "nhiều luồng"],
    ["ConcurrentHashMap", "không nhận null", "không"],
    ["LinkedList", "gần như không chọn"]
  ], "ChonCauTruc.java", "List<HoSo> trang = new ArrayList<>();\nSet<String> daXuLy = new HashSet<>();\nMap<String, HoSo> theoMa = new HashMap<>();\nMap<String, HoSo> dungChung =\n    new ConcurrentHashMap<>();");

  put("Trung cấp — Generics, lambda, Stream, Optional", "Stream chưa chạy khi chưa có bước kết", [
    ["filter, map", "lười", "collect"],
    ["mới chạy", "dùng một lần", "orElse"],
    ["luôn tính mặc định", "orElseGet"],
    ["chỉ tính khi rỗng"]
  ], "OptionalMacDinh.java", "String ten = Optional.ofNullable(hoSo.getTen())\n    .orElseGet(this::tenMacDinh);\n\nlong so = hoSoList.stream()\n    .filter(h -> \"DA_DUYET\".equals(h.getTrangThai()))\n    .count();");

  put("Trung cấp — Ngày giờ với java.time", "Ngày nộp khác lúc bấm duyệt", [
    ["LocalDate", "ngày trên biểu mẫu", "khác"],
    ["Instant", "mốc UTC trong audit", "múi"],
    ["Asia/Ho_Chi_Minh", "hết ngày làm việc", "không"],
    ["java.util.Date", "code mới không dùng"]
  ], "NgayNop.java", "ZoneId vn = ZoneId.of(\"Asia/Ho_Chi_Minh\");\nLocalDate homNay = LocalDate.now(vn);\nboolean conHan = !ngayHetHan.isBefore(homNay);\nInstant lucDuyet = Instant.now();");

  put("Trung cấp — HashMap làm việc bên trong", "Put chọn ô rồi so equals", [
    ["hash(khóa)", "chọn ô", "đụng độ"],
    ["nhiều khóa một ô", "so equals", "75%"],
    ["giãn đôi", "băm lại", "sửa khóa"],
    ["không tìm thấy nữa"]
  ], "KhongSuaKhoa.java", "Map<String, HoSo> theoMa = new HashMap<>();\ntheoMa.put(hoSo.getMa(), hoSo);\n\nHoSo tim = theoMa.get(ma);\n// Không setMa sau khi đã put.");

  put("Trung cấp — Stream trên một danh sách hồ sơ", "Stream chỉ đổi dạng, không gọi DB", [
    ["đã có trong RAM", "filter đã duyệt", "gom"],
    ["groupingBy đơn vị", "đếm", "không"],
    ["repository trong map", "thành N câu SQL"]
  ], "DemTheoDonVi.java", "Map<Long, Long> dem = hoSoList.stream()\n  .filter(h -> \"DA_DUYET\".equals(h.getTrangThai()))\n  .collect(Collectors.groupingBy(\n      HoSo::getDonViId, Collectors.counting()));");

  put("Trung cấp — Lỗi nghiệp vụ và lỗi kỹ thuật", "Hai loại lỗi, hai cách trả", [
    ["trùng mã, sai bước", "4xx, người dùng sửa được", "khác"],
    ["đứt DB, timeout", "5xx, có trace id", "giữ"],
    ["cause", "không mất stack"]
  ], "LoiNghiepVu.java", "public class LoiNghiepVu extends RuntimeException {\n  private final String ma;\n  public LoiNghiepVu(String ma, String message) {\n    super(message);\n    this.ma = ma;\n  }\n}");

  put("Trung cấp — Process, thread và request", "Request đã có sẵn một thread", [
    ["Process", "bộ nhớ riêng", "bên trong"],
    ["Thread", "dùng chung heap", "Tomcat"],
    ["pool request", "trả thread sau khi xong", "không"],
    ["new Thread mỗi hồ sơ", "không có trần"]
  ], "DungPool.java", "ExecutorService pool = Executors.newFixedThreadPool(4);\npool.submit(() -> xuLyLo(maLo));\n\n// Tắt ứng dụng\npool.shutdown();");

  put("Trung cấp — Race condition nhìn từ một biến đếm", "Hai thread cùng đọc số 10", [
    ["đọc 10", "cả hai", "cộng"],
    ["cả hai ghi 11", "mất một lần", "sửa"],
    ["AtomicInteger", "chỉ việc đếm", "unique DB"],
    ["mã bản tin", "khi có hai process"]
  ], "DemBanTin.java", "AtomicInteger count = new AtomicInteger();\nvoid nhan() {\n  count.incrementAndGet();\n}\n\n// Kiểm tra rồi mới thêm vẫn cần\n// putIfAbsent hoặc unique ở DB.");

  put("Trung cấp — synchronized, volatile và atomic", "volatile không gom được nhiều bước", [
    ["volatile", "thấy giá trị mới của một biến", "không đủ"],
    ["count++", "vẫn race", "synchronized"],
    ["cả khối kiểm tra rồi thêm", "ReentrantLock"],
    ["tryLock nếu job đang chạy thì bỏ qua"]
  ], "GhiMotLan.java", "private final Object khoa = new Object();\n\nvoid ghiMotLan(String ma) {\n  synchronized (khoa) {\n    if (daXuLy.contains(ma)) return;\n    daXuLy.add(ma);\n  }\n}");

  put("Trung cấp — ExecutorService", "Pool có trần, hàng đợi cũng phải có trần", [
    ["task", "đưa vào pool", "không"],
    ["new Thread", "mỗi hồ sơ", "fixed"],
    ["số thread cố định", "hàng đợi vô hạn nuốt RAM", "đầy"],
    ["từ chối lô mới", "lịch sau chạy tiếp"]
  ], "PoolDongBo.java", "ThreadPoolExecutor pool = new ThreadPoolExecutor(\n    4, 4, 0, TimeUnit.SECONDS,\n    new ArrayBlockingQueue<>(100),\n    new ThreadPoolExecutor.AbortPolicy());\npool.submit(() -> xuLyLo(maLo));");

  put("Nâng cao — Đa luồng ở mức đi làm được", "Khóa trong một JVM không sang node kia", [
    ["synchronized", "một process", "hai pod"],
    ["mỗi pod một khóa", "vẫn ghi trùng", "DB"],
    ["unique mã", "chốt cuối", "ThreadLocal"],
    ["remove ở finally", "khỏi lẫn user"]
  ], "DonContext.java", "try {\n  UserContext.set(user);\n  xuLy(hoSo);\n} finally {\n  UserContext.clear();\n}");

  put("Nâng cao — CompletableFuture", "Timeout không có nghĩa bên kia đã dừng", [
    ["supplyAsync", "pool riêng", "không"],
    ["pool chung JVM", "một kênh chậm chiếm chỗ", "orTimeout"],
    ["hết giờ trả lỗi", "bên nhận vẫn", "idempotent"]
  ], "GoiHaiKenh.java", "CompletableFuture<String> a =\n    CompletableFuture.supplyAsync(() -> goiKenhA(), pool)\n        .orTimeout(2, TimeUnit.SECONDS);\nCompletableFuture<String> b =\n    CompletableFuture.supplyAsync(() -> goiKenhB(), pool)\n        .orTimeout(2, TimeUnit.SECONDS);\na.thenCombine(b, (x, y) -> x + \"|\" + y).join();");

  put("Nâng cao — Chọn số thread và hàng đợi", "Số thread theo DB, không theo số dòng file", [
    ["CPU", "gần bằng số lõi", "IO"],
    ["chờ mạng", "nhiều hơn số lõi", "trần"],
    ["pool connection", "không vượt", "hàng đợi đầy"],
    ["để lịch sau", "đừng nhận vô hạn"]
  ], "ChonSo.java", "int songSong = Math.min(4, poolConnection / 2);\nExecutorService pool = Executors.newFixedThreadPool(songSong);\n\n// File 10_000 dòng không được thành 10_000 thread.");

  put("Nâng cao — Job lịch và nhiều instance", "Lịch nổ hai lần vẫn chỉ ghi một lần", [
    ["Node A và B", "cùng giờ chạy", "synchronized"],
    ["không xuyên JVM", "unique mã", "khóa có hạn"],
    ["node chết thì hết hạn", "node kia nhận", "vẫn"],
    ["idempotent", "phòng khoảng chồng"]
  ], "NhanViec.java", "insert into da_xu_ly(ma) values (?);\n-- trùng mã thì bỏ qua\n\n-- Khóa chọn lô có hết hạn,\n-- không giữ khóa trong lúc gọi mạng.");

  put("Nâng cao — Khi production kẹt luồng", "CPU thấp mà API chậm là đang chờ", [
    ["thread dump", "trước khi restart", "nhiều thread"],
    ["chờ connection", "transaction dài hoặc pool cạn", "BLOCKED"],
    ["cùng một khóa", "khóa quá rộng", "timeout"],
    ["cắt lời gọi không giới hạn"]
  ], "NhinDump.java", "jstack <pid>\n\n# nhiều thread TIMED_WAITING ở HTTP client\n# -> thiếu timeout\n# nhiều thread chờ HikariPool\n# -> đừng thêm thread, hãy nhả connection");

  put("Nâng cao — Bộ nhớ, GC và record", "GC không thu thứ bạn còn giữ", [
    ["object không còn tham chiếu", "GC thu", "static map"],
    ["càng thêm càng giữ", "heap tăng", "không"],
    ["System.gc()", "production không gọi", "record"],
    ["DTO bất biến", "list bên trong vẫn phải copy"]
  ], "CacheCoTran.java", "record HoSoResponse(Long id, String ma, List<String> mucs) {\n  public HoSoResponse {\n    mucs = List.copyOf(mucs);\n  }\n}");
})();
