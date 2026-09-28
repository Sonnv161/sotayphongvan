(function () {
  const mod = MODULES.find((item) => item.id === "spring");
  mod.summary = "Lộ trình Spring Boot cho mức khoảng 3 năm: từ IoC và REST, qua JPA và transaction, tới async, bảo mật API và cách test. Đọc từ trên xuống.";
  mod.theory = [
    {
      h: "Cơ bản — Spring Framework và Spring Boot",
      html: `<p>Spring Framework là bộ thư viện: tạo object giúp bạn, gắn chúng với nhau, bọc transaction, bảo mật, web. Spring Boot đóng gói cách dùng phổ biến: dependency starter, cấu hình tự động, server nhúng Tomcat, chạy bằng <code>main</code>.</p>
      <p><code>@SpringBootApplication</code> gồm ba việc: đây là lớp cấu hình, bật auto-configuration, và quét component từ package của lớp đó trở xuống. Đặt lớp main ở <code>com.app.module</code> trong khi service nằm ở <code>com.app</code> thì những service đó không được quét — ứng dụng lên nhưng thiếu bean.</p>
      <p>Starter là một dependency kéo theo cả nhóm thư viện đúng phiên bản. <code>spring-boot-starter-web</code> có MVC và Tomcat. <code>spring-boot-starter-data-jpa</code> có Hibernate và transaction. Không cần thuộc mọi jar bên trong, cần biết starter nào ứng với tầng nào.</p>`
    },
    {
      h: "Cơ bản — IoC, injection và vòng đời bean",
      html: `<p>Bạn không <code>new</code> service. Container tạo, giữ, và tiêm phụ thuộc. Cách nên dùng là constructor injection: phụ thuộc bắt buộc nằm ở constructor, field để <code>final</code>, test thì truyền bản giả vào constructor. Nếu lớp chỉ có một constructor, Spring không bắt buộc <code>@Autowired</code>.</p>
      <p>Field injection ngắn hơn nhưng che phụ thuộc, test phải nhờ framework hoặc reflection. Setter injection chỉ hợp phụ thuộc không bắt buộc.</p>
      <ul>
        <li><strong>singleton</strong> (mặc định): một instance cho một container.</li>
        <li><strong>prototype:</strong> mỗi lần container được hỏi thì tạo mới. Nhét prototype vào singleton thì singleton giữ mãi bản được tiêm lúc khởi tạo, không xin bản mới mỗi request.</li>
        <li><strong>request, session:</strong> theo vòng đời web. Không nhét dữ liệu user vào field của bean singleton.</li>
      </ul>
      <p>Thứ tự đời bean, mức đủ dùng: tạo object, gán phụ thuộc, <code>@PostConstruct</code>, phục vụ, <code>@PreDestroy</code> khi context đóng. <code>@Service</code>, <code>@Component</code>, <code>@Controller</code> đều là stereotype để được quét. <code>@Repository</code> thêm một việc: đổi lỗi JDBC/JPA thành <code>DataAccessException</code> để tầng trên không phụ thuộc Hibernate.</p>`
    },
    {
      h: "Cơ bản — Cấu hình theo môi trường",
      html: `<p><code>application.yml</code> là cấu hình. Profile <code>dev</code>, <code>uat</code>, <code>prod</code> chọn file <code>application-uat.yml</code> khi chạy với profile đó. Cùng một bản build, khác cấu hình. Không build riêng một jar cho mỗi môi trường.</p>
      <p>Mật khẩu database, khóa ký, không commit vào Git. Đưa qua biến môi trường hoặc Secret của Kubernetes. <code>@Value</code> hợp một hai tham số. Một nhóm tham số thì dùng <code>@ConfigurationProperties</code> để có object rõ ràng và kiểm tra lúc khởi động.</p>
      <p><code>spring.jpa.hibernate.ddl-auto</code> để <code>validate</code> hoặc tắt trên UAT/production. <code>update</code> và <code>create</code> tự sửa bảng, dễ mất dữ liệu và không đi qua script đã review. Đổi schema bằng migration có phiên bản.</p>`
    },
    {
      h: "Trung cấp — REST trong Spring MVC",
      html: `<p><code>@RestController</code> là controller mà giá trị trả về được ghi thành JSON, không tìm file view. <code>@GetMapping</code>, <code>@PostMapping</code> gắn method và đường dẫn. <code>@PathVariable</code> lấy phần trên URL, <code>@RequestParam</code> lấy query, <code>@RequestBody</code> lấy JSON.</p>
      <p>Tách DTO và entity. Trả entity ra ngoài sẽ lộ cột không cần, vỡ khi đổi quan hệ lazy, và cho client gửi lên field họ không được sửa. DTO vào là thứ client được phép gửi. DTO ra là thứ client được phép thấy.</p>
      <p><code>ResponseEntity</code> khi cần chủ động mã HTTP. Trường hợp đơn giản thì ném exception nghiệp vụ và để một chỗ chung đổi thành mã HTTP, khỏi mỗi method tự lắp status.</p>`
    },
    {
      h: "Trung cấp — Validation và một format lỗi",
      html: `<p>Bean Validation trên DTO: <code>@NotBlank</code>, <code>@Size</code>, <code>@Email</code>, <code>@Pattern</code>. Controller gắn <code>@Valid</code>. Thiếu <code>@Valid</code> thì annotation không chạy. Lỗi này thành 400, body liệt kê field nào sai.</p>
      <p>Rule cần đọc DB — trùng mã, sai bước trạng thái, hết quyền trên đúng hồ sơ — không nhét vào annotation. Để ở service, ném exception có mã nghiệp vụ.</p>
      <p><code>@RestControllerAdvice</code> bắt exception của mọi controller và trả một JSON: <code>code</code>, <code>message</code>, <code>details</code>, <code>traceId</code>. Production không trả stack trace và không trả câu SQL. Lỗi không lường trước là 500 với câu chung; chi tiết chỉ nằm trong log.</p>`
    },
    {
      h: "Trung cấp — Spring Data JPA",
      html: `<p>Entity ánh xạ bảng. Repository là interface, Spring tạo implementation. Method <code>findByMaAndDonViId</code> được dịch thành câu query. Query phức tạp thì viết <code>@Query</code> hoặc interface tùy biến, đừng móc tên method dài đến mức không đọc được.</p>
      <p>Mặc định quan trọng:</p>
      <ul>
        <li><code>@ManyToOne</code> và <code>@OneToOne</code> là <strong>EAGER</strong>. Lấy hồ sơ có thể kéo luôn đơn vị, người duyệt, và tiếp tục kéo nữa.</li>
        <li><code>@OneToMany</code> và <code>@ManyToMany</code> là <strong>LAZY</strong>. Chạm collection sau khi session đóng thì <code>LazyInitializationException</code>.</li>
      </ul>
      <p>N+1: một câu lấy 50 hồ sơ, vòng lặp chạm đơn vị lazy thành thêm 50 câu. Sửa bằng <code>join fetch</code> hoặc <code>@EntityGraph</code> khi tập con nhỏ. Không fetch join hai collection một lúc — số dòng bị nhân lên. Tập lớn thì query riêng theo danh sách id, hoặc chọn DTO projection để không kéo cả entity.</p>
      <p>Spring Boot mặc định mở session trong suốt request (open-in-view). Lazy ở tầng view đỡ vỡ, nhưng connection bị giữ tới khi trả xong HTTP, và lỗi N+1 dễ bị giấu. Hệ thống nhiều người dùng thì tắt và tải đúng dữ liệu trong service.</p>
      <p><code>save</code> của Spring Data: entity mới thì persist, entity đã có id thì merge. Dirty checking ghi các field đã đổi lúc flush, không cần gọi update tường minh. Vì vậy đừng sửa entity rồi tưởng “chưa save nên chưa ghi” — transaction commit vẫn ghi.</p>`
    },
    {
      h: "Trung cấp — @Transactional",
      html: `<p>Annotation này chỉ có tác dụng khi lời gọi đi qua proxy, tức từ bean khác vào method <code>public</code>. Gọi <code>this.method()</code> trong cùng lớp, hoặc gắn lên method <code>private</code>, thì không có transaction dù annotation còn đó.</p>
      <ul>
        <li><strong>REQUIRED</strong> (mặc định): vào transaction đang có, chưa có thì tạo. Cùng commit hoặc cùng rollback.</li>
        <li><strong>REQUIRES_NEW:</strong> tạm dừng cái bên ngoài, mở transaction riêng và commit riêng. Dùng khi nhật ký bắt buộc phải còn dù việc chính rollback. Dễ deadlock nếu hai transaction chạm cùng dòng.</li>
        <li>Rollback mặc định khi <code>RuntimeException</code> và <code>Error</code>. Checked exception vẫn commit, trừ khi khai báo <code>rollbackFor</code>.</li>
        <li><code>readOnly = true</code> cho báo cáo: Hibernate không flush để tìm dirty checking. Không dùng cho method có ghi.</li>
      </ul>
      <p>Giữ transaction ngắn. Không gọi HTTP, không chờ file, không gửi mail bên trong. Connection và khóa bị giữ suốt thời gian chờ mạng, pool cạn, cả API đứng.</p>`
    },
    {
      h: "Nâng cao — Gọi ra ngoài, @Async, @Scheduled",
      html: `<p>Client HTTP phải có timeout kết nối và timeout đọc. Không dùng mặc định vô hạn. Retry chỉ cho lỗi tạm và cho thao tác gọi lại không gây đôi giao dịch. Mỗi lần retry cần trần số lần và khoảng chờ.</p>
      <p><code>@Async</code> cần <code>@EnableAsync</code>, method public, và được gọi từ bean khác. Nó chạy trên luồng khác nên:</p>
      <ul>
        <li>Transaction của người gọi không bao trùm method async. Method async muốn ghi DB thì tự có transaction của nó.</li>
        <li>Lỗi trong method trả <code>void</code> không bay về người gọi. Phải có chỗ nhận lỗi và log.</li>
        <li>User trong SecurityContext mặc định không sang luồng mới. Luồng pool mà quên dọn dữ liệu luồng sẽ lẫn user.</li>
      </ul>
      <p><code>@Scheduled</code> mặc định một luồng cho mọi job. Job xuất báo cáo chạy lâu sẽ trễ job dọn dữ liệu phía sau. <code>fixedDelay</code> chờ lần trước xong. <code>fixedRate</code> tính từ lúc bắt đầu, có thể chồng nếu lần trước chưa xong mà pool chỉ một luồng thì nó phải chờ. Job phải chịu chạy trên nhiều pod: dùng khóa hoặc để việc đó idempotent.</p>`
    },
    {
      h: "Nâng cao — Bảo mật API và kiểm thử",
      html: `<p>Mật khẩu lưu bằng bộ mã hóa một chiều, thường là BCrypt, không mã hóa đối xứng để còn giải ra. API stateless dùng token: filter kiểm tra chữ ký, đưa user vào context, service vẫn kiểm tra quyền trên đúng bản ghi. <code>hasRole('CV')</code> tự thêm tiền tố <code>ROLE_</code>. <code>hasAuthority</code> so đúng chuỗi bạn đưa.</p>
      <p>Session cookie cần chống CSRF. API chỉ dùng header Authorization, không dùng cookie phiên, thì CSRF không phải mối chính — mối chính là token bị lộ và thiếu kiểm tra quyền theo id.</p>
      <p>Test chia lớp:</p>
      <ul>
        <li><code>@WebMvcTest</code> kiểm tra controller: status, JSON, validation. Repository được giả lập.</li>
        <li><code>@DataJpaTest</code> kiểm tra query trên DB thử, rollback sau mỗi test.</li>
        <li><code>@SpringBootTest</code> bật cả context, đắt, dành cho vài luồng quan trọng chứ không phải mọi hàm.</li>
      </ul>
      <p>Test rule chuyển trạng thái và test “user đơn vị A không đọc được hồ sơ đơn vị B” có giá trị hơn là nhắm một con số coverage.</p>`
    }
  ];
  mod.questions.push(
    {
      level: "Cơ bản",
      q: "Spring Boot khác Spring Framework ở chỗ nào?",
      html: `<p>Spring Framework cung cấp IoC, MVC, transaction, data. Spring Boot chọn sẵn các mặc định đúng: starter, auto-configuration, Tomcat nhúng, file cấu hình và Actuator. Em vẫn viết bean, controller, repository như Spring, nhưng không phải tự nối từng phần. Auto-configuration chỉ bật khi thấy thư viện có mặt, ví dụ có JPA trên classpath thì cấu hình EntityManager.</p>`,
      tip: "Nhắc một bẫy: lớp main phải đứng trên các package cần quét."
    },
    {
      level: "Cơ bản",
      q: "Vì sao nên tiêm phụ thuộc bằng constructor?",
      html: `<p>Phụ thuộc bắt buộc nhìn thấy ngay trên constructor, field để final, thiếu bean thì ứng dụng không khởi động chứ không chờ tới lúc gọi method mới null. Test tạo service bằng <code>new</code> và truyền repository giả, không cần bật cả Spring. Field injection giấu những thứ class cần và buộc test dùng reflection.</p>`,
      tip: "Một câu là đủ. Đừng biến câu trả lời thành bài SOLID."
    },
    {
      level: "Trung cấp",
      q: "Checked exception ném ra khỏi method @Transactional thì dữ liệu có rollback không?",
      html: `<p>Mặc định là không. Spring rollback khi runtime exception và error. Checked exception được coi là lỗi có chủ đích, transaction vẫn commit. Nếu em muốn mọi exception đều rollback thì khai báo <code>rollbackFor = Exception.class</code>. Em thường để lỗi nghiệp vụ là runtime exception có mã, nên vẫn được rollback mà không cần cấu hình thêm.</p>`,
      tip: "Nói tiếp nếu họ gật: self-invocation cũng không có transaction, dù exception loại nào."
    },
    {
      level: "Trung cấp",
      q: "FetchType mặc định của ManyToOne và OneToMany là gì?",
      html: `<p>ManyToOne và OneToOne mặc định EAGER, lấy cha có thể kéo con ngay. OneToMany và ManyToMany mặc định LAZY, chỉ tải khi chạm collection và session còn mở. EAGER trên ManyToOne dễ thành một chuỗi join không chủ đích. Em để quan hệ LAZY, rồi tải đúng thứ cần bằng join fetch hoặc một query DTO.</p>`,
      tip: "Kèm cách em biết mình đang N+1: bật log SQL và đếm số câu khi mở một danh sách."
    },
    {
      level: "Nâng cao",
      q: "@Async có nằm trong transaction của hàm gọi nó không?",
      html: `<p>Không. Method async chạy ở luồng khác, sau khi hàm gọi đã đi tiếp. Transaction của hàm gọi không bao sang đó. Nếu hàm async ghi DB, nó cần transaction riêng và phải chấp nhận hàm gọi có thể đã commit hoặc chưa. Lỗi của hàm void không trả về caller. Context đăng nhập cũng không tự sang luồng mới. Em chỉ đưa sang async những việc được phép trễ và được phép thử lại, như gửi thông báo.</p>`,
      tip: "Đừng nói bật @Async là API nhanh hơn trong khi dữ liệu bắt buộc phải cùng commit."
    }
  );
  mod.quiz.push(
    {
      q: "Method @Transactional ném checked exception, cấu hình mặc định sẽ thế nào?",
      options: [
        "Rollback như runtime exception",
        "Commit, trừ khi có rollbackFor",
        "Xóa hết bảng trong transaction"
      ],
      correct: 1,
      explain: "Mặc định chỉ rollback với RuntimeException và Error. Checked exception cần rollbackFor nếu muốn hoàn tác."
    },
    {
      q: "FetchType mặc định của @ManyToOne là gì?",
      options: ["LAZY", "EAGER", "Không tải bao giờ"],
      correct: 1,
      explain: "ManyToOne và OneToOne mặc định EAGER. OneToMany và ManyToMany mặc định LAZY."
    }
  );
})();
