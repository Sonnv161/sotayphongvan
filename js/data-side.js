window.SIDE_PANELS = {
  default: {
    title: "Cách trả lời",
    note: "Cột này đi theo mục đang đọc. Chương Spring Boot có mô hình và code riêng cho từng mục.",
    steps: [
      { name: "Họ hỏi gì", note: "một câu", arrow: "rồi" },
      { name: "Định nghĩa ngắn", note: "không đọc giáo trình", arrow: "rồi" },
      { name: "Việc đã làm", note: "một tình huống thật", arrow: "rồi" },
      { name: "Khi lỗi", note: "bạn xử lý thế nào" }
    ],
    codeTitle: "Khung nói",
    code: "Em định nghĩa trong một câu.\nEm kể một việc đã làm.\nEm nói đánh đổi, và chuyện gì xảy ra khi lỗi."
  },
  spring: {
    default: {
      title: "Một request Spring Boot",
      note: "Cuộn tới từng mục bên trái để đổi sơ đồ và code.",
      steps: [
        { name: "HTTP", note: "GET /ho-so/15", arrow: "filter, trace id" },
        { name: "Controller", note: "lấy id, gọi service", arrow: "không viết SQL ở đây" },
        { name: "Service", note: "quyền, rule, transaction", arrow: "constructor injection" },
        { name: "Repository", note: "một câu SQL", arrow: "map" },
        { name: "DTO JSON", note: "không trả entity" }
      ],
      codeTitle: "HoSoController.java",
      code: "@RestController\n@RequestMapping(\"/ho-so\")\npublic class HoSoController {\n  private final HoSoService service;\n\n  public HoSoController(HoSoService service) {\n    this.service = service;\n  }\n\n  @GetMapping(\"/{id}\")\n  public HoSoResponse chiTiet(@PathVariable Long id) {\n    return service.chiTiet(id);\n  }\n}"
    },
    "Cơ bản — Spring Framework và Spring Boot": {
      title: "Boot bọc Framework",
      note: "Framework là các mảnh. Boot chọn sẵn cách ghép và Tomcat nhúng.",
      steps: [
        { name: "spring-boot-starter-web", note: "MVC + Tomcat", arrow: "kéo đúng phiên bản" },
        { name: "@SpringBootApplication", note: "config + auto-config + quét bean", arrow: "quét từ package này xuống" },
        { name: "application.yml", note: "cấu hình theo profile", arrow: "chạy" },
        { name: "Jar + main", note: "không cần cài Tomcat ngoài" }
      ],
      codeTitle: "UngDung.java",
      code: "@SpringBootApplication\npublic class UngDung {\n  public static void main(String[] args) {\n    SpringApplication.run(UngDung.class, args);\n  }\n}\n\n// Đặt lớp này ở com.app\n// Service ở com.app.hoso mới được quét.\n// Đặt main ở com.app.module thì service ở com.app bị sót."
    },
    "Cơ bản — IoC, injection và vòng đời bean": {
      title: "Container tạo, bạn không new",
      note: "Singleton dùng chung. Không giữ user trong field của bean này.",
      steps: [
        { name: "Tạo object", note: "một HoSoService cho cả container", arrow: "gán constructor" },
        { name: "Tiêm HoSoRepository", note: "field final", arrow: "@PostConstruct" },
        { name: "Sẵn sàng", note: "mọi request dùng cùng instance", arrow: "tắt ứng dụng" },
        { name: "@PreDestroy", note: "đóng tài nguyên" }
      ],
      codeTitle: "HoSoService.java",
      code: "@Service\npublic class HoSoService {\n  private final HoSoRepository repository;\n\n  public HoSoService(HoSoRepository repository) {\n    this.repository = repository;\n  }\n\n  @PostConstruct\n  void sanSang() {\n    // cache danh mục, không lưu user\n  }\n}"
    },
    "Cơ bản — Cấu hình theo môi trường": {
      title: "Một jar, nhiều profile",
      note: "Mật khẩu không nằm trong Git. ddl-auto không được sửa bảng production.",
      steps: [
        { name: "application.yml", note: "cấu hình chung", arrow: "chọn profile" },
        { name: "application-dev.yml", note: "DB local", arrow: "cùng bản build" },
        { name: "application-prod.yml", note: "URL từ biến môi trường", arrow: "secret" },
        { name: "Kubernetes Secret", note: "mật khẩu bơm lúc chạy" }
      ],
      codeTitle: "application-prod.yml",
      code: "spring:\n  datasource:\n    url: ${DB_URL}\n    username: ${DB_USER}\n    password: ${DB_PASSWORD}\n  jpa:\n    hibernate:\n      ddl-auto: validate\n\napp:\n  page-size-max: 100"
    },
    "Cơ bản — Một request đi qua những đâu": {
      title: "Đường đi của GET /ho-so/15",
      steps: [
        { name: "Filter", note: "trace id, xác thực", arrow: "tìm handler" },
        { name: "DispatcherServlet", note: "khớp GET và URL", arrow: "gọi" },
        { name: "HoSoController", note: "lấy id", arrow: "không chứa SQL" },
        { name: "HoSoService", note: "quyền + transaction", arrow: "repository" },
        { name: "JSON", note: "Jackson viết DTO" }
      ],
      codeTitle: "Thứ tự gọi",
      code: "GET /ho-so/15\n  -> TraceFilter\n  -> HoSoController.chiTiet(15)\n  -> HoSoService.chiTiet(15)\n  -> HoSoRepository.findById(15)\n  -> HoSoResponse\n  -> HTTP 200"
    },
    "Cơ bản — Annotation gặp hàng ngày": {
      title: "Annotation nào đứng ở tầng nào",
      steps: [
        { name: "@RestController", note: "cửa HTTP", arrow: "gọi" },
        { name: "@Service", note: "rule nghiệp vụ", arrow: "@Transactional" },
        { name: "@Repository", note: "SQL, đổi lỗi DB", arrow: "chỉ khi có @Valid" },
        { name: "@Valid", note: "chạy @NotBlank trên DTO" }
      ],
      codeTitle: "Tạo hồ sơ",
      code: "@PostMapping\npublic HoSoResponse tao(@Valid @RequestBody TaoHoSoRequest request) {\n  return service.tao(request);\n}\n\npublic record TaoHoSoRequest(\n  @NotBlank String ma,\n  @NotNull Long donViId\n) {}"
    },
    "Cơ bản — Controller tối thiểu": {
      title: "Controller chỉ chuyển HTTP",
      steps: [
        { name: "@PathVariable", note: "id trên URL", arrow: "khác" },
        { name: "@RequestBody", note: "JSON tạo mới", arrow: "service" },
        { name: "HoSoResponse", note: "không trả entity", arrow: "Jackson" },
        { name: "HTTP JSON", note: "không lộ quan hệ lazy" }
      ],
      codeTitle: "HoSoController.java",
      code: "@GetMapping(\"/{id}\")\npublic HoSoResponse chiTiet(@PathVariable Long id) {\n  return service.chiTiet(id);\n}\n\n@PostMapping\npublic HoSoResponse tao(@Valid @RequestBody TaoHoSoRequest request) {\n  return service.tao(request);\n}"
    },
    "Cơ bản — Log để hôm sau còn đọc được": {
      title: "Một dòng log tìm được hồ sơ",
      steps: [
        { name: "info", note: "đã nhận mã hồ sơ", arrow: "không in giấy tờ" },
        { name: "warn", note: "timeout, sẽ thử lại", arrow: "một lần" },
        { name: "error", note: "kèm trace id", arrow: "QA gửi id đó" },
        { name: "Log tập trung", note: "không System.out" }
      ],
      codeTitle: "HoSoService.java",
      code: "log.info(\"Tao ho so ma={} donVi={}\", ma, donViId);\nlog.warn(\"Kenh timeout ma={}\", ma);\nlog.error(\"Luu ho so that bai ma={}\", ma, ex);\n\n// Không log token, mật khẩu,\n// không cộng chuỗi khi mức log đang tắt."
    },
    "Trung cấp — REST trong Spring MVC": {
      title: "DTO vào, DTO ra",
      steps: [
        { name: "TaoHoSoRequest", note: "field được nhập", arrow: "@Valid" },
        { name: "Service", note: "đặt trạng thái chờ", arrow: "không nhận entity từ client" },
        { name: "HoSoResponse", note: "mã, trạng thái", arrow: "201 hoặc 200" },
        { name: "Lỗi chung", note: "code, message, traceId" }
      ],
      codeTitle: "Không trả entity",
      code: "public HoSoResponse tao(TaoHoSoRequest request) {\n  HoSo hoSo = new HoSo(request.ma(), request.donViId());\n  return HoSoResponse.from(repository.save(hoSo));\n}\n\npublic record HoSoResponse(Long id, String ma, String trangThai) {\n  static HoSoResponse from(HoSo hoSo) {\n    return new HoSoResponse(hoSo.getId(), hoSo.getMa(), hoSo.getTrangThai());\n  }\n}"
    },
    "Trung cấp — Validation và một format lỗi": {
      title: "Lỗi field và lỗi nghiệp vụ",
      steps: [
        { name: "@NotBlank", note: "thiếu mã -> 400", arrow: "không đọc DB" },
        { name: "Service", note: "trùng mã -> 409", arrow: "exception có mã" },
        { name: "@RestControllerAdvice", note: "một JSON cho mọi lỗi", arrow: "production" },
        { name: "Không trả stack", note: "chi tiết chỉ ở log" }
      ],
      codeTitle: "ApiExceptionHandler.java",
      code: "@RestControllerAdvice\npublic class ApiExceptionHandler {\n  @ExceptionHandler(MethodArgumentNotValidException.class)\n  ResponseEntity<LoiResponse> saiField(MethodArgumentNotValidException ex) {\n    return ResponseEntity.badRequest().body(LoiResponse.tu(ex));\n  }\n\n  @ExceptionHandler(LoiNghiepVu.class)\n  ResponseEntity<LoiResponse> nghiepVu(LoiNghiepVu ex) {\n    return ResponseEntity.status(409).body(LoiResponse.tu(ex));\n  }\n}"
    },
    "Trung cấp — Spring Data JPA": {
      title: "EAGER dễ kéo dây, LAZY dễ N+1",
      steps: [
        { name: "HoSo", note: "ManyToOne DonVi mặc định EAGER", arrow: "nên chỉnh LAZY" },
        { name: "Danh sách 20 hồ sơ", note: "chạm donVi trong vòng lặp", arrow: "thêm 20 câu SQL" },
        { name: "join fetch", note: "khi tập con nhỏ", arrow: "không fetch hai collection" },
        { name: "DTO projection", note: "hết N+1" }
      ],
      codeTitle: "HoSoRepository.java",
      code: "public interface HoSoRepository extends JpaRepository<HoSo, Long> {\n  @Query(\"\"\"\n      select h from HoSo h\n      join fetch h.donVi\n      where h.trangThai = :trangThai\n      \"\"\")\n  List<HoSo> findKeDonVi(@Param(\"trangThai\") String trangThai);\n}"
    },
    "Trung cấp — @Transactional": {
      title: "Transaction chỉ bọc lúc ghi",
      steps: [
        { name: "Controller", note: "gọi bean khác", arrow: "đi qua proxy" },
        { name: "duyet()", note: "@Transactional public", arrow: "cùng commit" },
        { name: "Lưu hồ sơ + lịch sử", note: "runtime exception thì rollback", arrow: "ngoài transaction" },
        { name: "Gọi kênh", note: "không giữ connection" }
      ],
      codeTitle: "HoSoService.java",
      code: "@Transactional\npublic void duyet(Long id, int version) {\n  int rows = repository.duyetNeuDungVersion(id, version);\n  if (rows == 0) {\n    throw new LoiNghiepVu(\"CONFLICT\", \"Ho so da doi\");\n  }\n  lichSu.ghi(id, \"DA_DUYET\");\n}\n\n// this.duyet() trong cùng class\n// không đi qua proxy, không có transaction."
    },
    "Trung cấp — Từ bảng tới API của một hồ sơ": {
      title: "Bốn lớp của một module",
      steps: [
        { name: "ho_so", note: "bảng", arrow: "map" },
        { name: "HoSo entity", note: "không trả ra API", arrow: "repository" },
        { name: "HoSoService", note: "trùng mã, trạng thái", arrow: "controller" },
        { name: "HoSoController", note: "HTTP và DTO" }
      ],
      codeTitle: "HoSo.java",
      code: "@Entity\npublic class HoSo {\n  @Id\n  @GeneratedValue(strategy = GenerationType.IDENTITY)\n  private Long id;\n  private String ma;\n  private String trangThai;\n}\n\npublic interface HoSoRepository extends JpaRepository<HoSo, Long> {\n  Optional<HoSo> findByMa(String ma);\n}"
    },
    "Trung cấp — Phân trang, không trả cả bảng": {
      title: "Trang có trần, sort có danh sách trắng",
      steps: [
        { name: "page, size, sort", note: "client gửi", arrow: "chặn size > 100" },
        { name: "Pageable", note: "chỉ cột được phép", arrow: "repository" },
        { name: "Page", note: "có thêm câu count", arrow: "hoặc" },
        { name: "Slice", note: "chỉ cần biết còn trang sau" }
      ],
      codeTitle: "HoSoController.java",
      code: "@GetMapping\npublic Page<HoSoResponse> danhSach(Pageable pageable) {\n  int size = Math.min(pageable.getPageSize(), 100);\n  Pageable anToan = PageRequest.of(\n      pageable.getPageNumber(), size, Sort.by(\"ngayNop\").descending());\n  return service.danhSach(anToan);\n}"
    },
    "Trung cấp — Entity đang được theo dõi hay đã tách": {
      title: "Sửa field là có thể thành UPDATE",
      steps: [
        { name: "findById", note: "entity managed", arrow: "sửa field" },
        { name: "Hibernate nhớ bản gốc", note: "dirty checking", arrow: "flush lúc commit" },
        { name: "UPDATE", note: "dù không gọi save", arrow: "đóng session" },
        { name: "Detached", note: "sửa tiếp không được ghi" }
      ],
      codeTitle: "Trong transaction",
      code: "@Transactional\npublic void doiTrangThai(Long id) {\n  HoSo hoSo = repository.findById(id).orElseThrow();\n  hoSo.setTrangThai(\"DA_DUYET\");\n  // commit sẽ UPDATE\n  // không cần save nếu entity vừa được load\n}"
    },
    "Trung cấp — Nhìn N+1 trên log và cascade": {
      title: "Một danh sách không được thành 21 câu SQL",
      steps: [
        { name: "select ho_so", note: "1 câu", arrow: "vòng lặp chạm donVi" },
        { name: "select don_vi", note: "lặp theo từng hồ sơ", arrow: "sửa" },
        { name: "join fetch hoặc DTO", note: "1 hoặc 2 câu", arrow: "cascade" },
        { name: "Không ALL sang danh mục", note: "xóa hồ sơ không được xóa đơn vị" }
      ],
      codeTitle: "Log SQL cần tránh",
      code: "select * from ho_so where trang_thai = ?\nselect * from don_vi where id = ?\nselect * from don_vi where id = ?\n-- lặp đến hết trang\n\n@OneToMany(cascade = CascadeType.PERSIST, orphanRemoval = true)\nprivate List<MucChiTiet> mucs;\n\n@ManyToOne(fetch = FetchType.LAZY)\nprivate DonVi donVi; // không CascadeType.ALL"
    },
    "Nâng cao — Gọi ra ngoài, @Async, @Scheduled": {
      title: "Việc nền không nằm trong transaction của request",
      steps: [
        { name: "Request", note: "ghi trạng thái đang gửi", arrow: "commit" },
        { name: "@Async hoặc job", note: "luồng khác, transaction riêng", arrow: "timeout" },
        { name: "Kênh ngoài", note: "có thể tới hai lần", arrow: "unique mã" },
        { name: "Hai node", note: "@Scheduled có thể nổ hai lần" }
      ],
      codeTitle: "GoiKenh.java",
      code: "RestClient client = RestClient.builder()\n    .requestFactory(factoryCoTimeout())\n    .build();\n\n@Async\n@Transactional\npublic void gui(String ma) {\n  // transaction này không phải transaction của người gọi\n  kenhs.send(ma);\n}"
    },
    "Nâng cao — Bảo mật API và kiểm thử": {
      title: "Role thô ở cổng, phạm vi hồ sơ ở service",
      steps: [
        { name: "Filter JWT", note: "đúng chữ ký, chưa hết hạn", arrow: "chưa đủ" },
        { name: "Service", note: "hồ sơ có thuộc đơn vị user không", arrow: "test" },
        { name: "@WebMvcTest", note: "status và JSON", arrow: "tách" },
        { name: "@DataJpaTest", note: "câu query, rồi rollback" }
      ],
      codeTitle: "HoSoServiceTest.java",
      code: "@Test\nvoid donViKhacKhongXemDuoc() {\n  assertThatThrownBy(() -> service.chiTiet(15L, userDonViA))\n      .isInstanceOf(LoiNghiepVu.class);\n}\n\n// hasRole(\"CV\") tự thêm tiền tố ROLE_\n// hasAuthority so đúng chuỗi được cấp"
    }
  }
};
