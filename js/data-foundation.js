var MODULES = [
  {
    id: "lo-trinh",
    group: "Định hướng",
    title: "Lộ trình 3 năm và cách trả lời",
    level: "Cơ bản",
    summary: "Middle Backend không chỉ code API. Nhà tuyển dụng muốn thấy bạn đi hết vòng đời một module: hiểu yêu cầu, thiết kế, viết code an toàn, test, deploy và xử lý sự cố.",
    theory: [
      {
        h: "Mức Middle khoảng 3 năm trông như thế nào",
        html: `<ul>
          <li><strong>Tự làm một module.</strong> Nhận yêu cầu từ BA, hỏi cho rõ rule nghiệp vụ, đề xuất API và bảng dữ liệu, ước lượng rủi ro.</li>
          <li><strong>Biết vì sao chọn cách đó.</strong> Không chỉ nói “em dùng Kafka”, mà nói bài toán bất đồng bộ, retry, thứ tự message và cách theo dõi lỗi.</li>
          <li><strong>Giữ hệ thống sống được.</strong> Transaction, log, idempotency, phân quyền, chỉ mục SQL, health check, đọc log trên Kubernetes.</li>
          <li><strong>Làm việc với quy trình.</strong> Với dự án cơ quan nhà nước: tài liệu, môi trường DEV/UAT/Production, biên bản kiểm thử, đối chiếu chức năng lúc nghiệm thu.</li>
        </ul>
        <p>Lộ trình ôn gợi ý 4 tuần: tuần 1 nền tảng Java hoặc Nest và REST; tuần 2 dữ liệu, Redis, transaction; tuần 3 microservices, broker, Docker/Kubernetes; tuần 4 bảo mật, dự án nhà nước và kể lại một hệ thống bạn đã làm.</p>`
      },
      {
        h: "Khung trả lời 90 giây",
        html: `<ol>
          <li><strong>Định nghĩa ngắn</strong> bằng lời của bạn.</li>
          <li><strong>Cách bạn dùng trong dự án</strong> — một tình huống cụ thể.</li>
          <li><strong>Đánh đổi</strong> — cách này mạnh chỗ nào, yếu chỗ nào.</li>
          <li><strong>Cách xử lý khi lỗi</strong> — log, retry, rollback, cảnh báo.</li>
        </ol>
        <p>Tránh học thuộc định nghĩa Wikipedia. Người phỏng vấn Middle hay đào tiếp: “Nếu message xử lý xong nhưng commit DB thất bại thì sao?”</p>`
      }
    ],
    questions: [
      {
        level: "Cơ bản",
        q: "Hãy giới thiệu bản thân cho vị trí Middle Backend.",
        html: `<p>Mẫu: “Em có khoảng 3 năm làm backend, chủ yếu với Java Spring Boot hoặc NestJS. Em tham gia từ lúc đọc yêu cầu, thiết kế API và dữ liệu, đến lúc viết service, unit test, đưa lên Docker và hỗ trợ UAT. Em từng làm module có tích hợp hệ thống ngoài, hàng đợi bất đồng bộ và phân quyền theo vai trò. Em quen làm việc với BA và QA để chốt rule trước khi code, và giữ log cùng audit khi dữ liệu nhạy cảm.”</p>
        <p>Chọn 2 việc thật: một API nghiệp vụ và một lần xử lý sự cố hoặc tối ưu query. Đừng liệt kê mọi công nghệ trong JD.</p>`,
        tip: "Nói 60–90 giây, kết bằng loại hệ thống bạn muốn làm tiếp: dịch vụ dùng chung, báo cáo, tích hợp liên thông."
      },
      {
        level: "Trung cấp",
        q: "Kể một module bạn tự chịu trách nhiệm từ đầu đến cuối.",
        html: `<p>Dùng cấu trúc: bối cảnh → việc của bạn → quyết định kỹ thuật → kết quả → bài học.</p>
        <p>Ví dụ: module tiếp nhận hồ sơ. Em chốt API với frontend, bảng hồ sơ và bảng lịch sử trạng thái, không sửa đè dữ liệu cũ. Luồng duyệt dài được đưa vào queue để không giữ request. Phân quyền theo đơn vị và vai trò. Có audit: ai đổi trạng thái, lúc nào, giá trị cũ và mới. Unit test cho rule chuyển trạng thái. Lúc UAT, QA bắt case nộp trùng; em thêm khóa idempotency theo mã hồ sơ phía client.</p>`,
        tip: "Chuẩn bị số liệu nhẹ: thời gian phản hồi, số bản ghi, số service — chỉ nói số bạn nhớ thật."
      },
      {
        level: "Trung cấp",
        q: "Bạn khác Junior ở điểm nào?",
        html: `<p>Junior hoàn thành task được giao và hỏi khi kẹt. Middle tự chia việc, nhìn thấy lỗ hổng dữ liệu và hợp đồng API, chủ động nói rủi ro tiến độ, review code người khác và giải thích cho BA vì sao một yêu cầu khó làm đúng trong kiến trúc hiện tại. Khi production lỗi, Middle khoanh vùng bằng log và metric trước khi sửa đại.</p>`,
        tip: "Kèm một ví dụ nhỏ: lần bạn từ chối sửa DB tay trên production và đề xuất script có review."
      }
    ],
    quiz: [
      {
        q: "Câu trả lời phỏng vấn Middle nên có gì?",
        options: [
          "Định nghĩa dài và liệt kê thật nhiều công nghệ",
          "Định nghĩa ngắn, ví dụ đã làm, đánh đổi và cách xử lý khi lỗi",
          "Chỉ nói em đã dùng công nghệ đó trong CV"
        ],
        correct: 1,
        explain: "Người phỏng vấn muốn thấy bạn ra quyết định và biết hệ quả, không chỉ nhận mặt từ khóa."
      }
    ]
  },
  {
    id: "oop",
    group: "Nền tảng",
    title: "OOP, SOLID và tổ chức code",
    level: "Cơ bản",
    summary: "Ba năm kinh nghiệm cần giải thích được vì sao tách lớp, vì sao không nhét nghiệp vụ vào controller, và áp dụng SOLID vừa đủ — không biến mọi thứ thành pattern.",
    theory: [
      {
        h: "Bốn trụ OOP trong backend",
        html: `<ul>
          <li><strong>Đóng gói:</strong> field nhạy cảm để private. Đổi trạng thái hồ sơ đi qua method, method đó kiểm tra được phép chuyển bước hay không.</li>
          <li><strong>Kế thừa:</strong> dùng ít. Kế thừa sâu làm khó test. Ưu tiên composition: service nhận repository qua constructor.</li>
          <li><strong>Đa hình:</strong> một interface <code>Notifier</code> có bản email và bản tin nhắn. Code nghiệp vụ không biết kênh cụ thể.</li>
          <li><strong>Trừu tượng:</strong> controller chỉ thấy use case “duyệt hồ sơ”, không thấy SQL.</li>
        </ul>`
      },
      {
        h: "SOLID ở mức thực dụng",
        html: `<ul>
          <li><strong>S — một lý do để sửa.</strong> Class vừa gửi mail vừa tính thuế sẽ vỡ khi một trong hai đổi.</li>
          <li><strong>O — mở để thêm, hạn chế sửa chỗ cũ.</strong> Thêm kênh thông báo bằng class mới, không sửa chuỗi if.</li>
          <li><strong>L — class con thay được class cha.</strong> Nếu override làm đổi hợp đồng (ném exception lạ, bỏ bước bắt buộc) thì đừng kế thừa.</li>
          <li><strong>I — interface nhỏ.</strong> Đừng bắt service chỉ ghi log phải implement cả method gửi SMS.</li>
          <li><strong>D — phụ thuộc abstraction.</strong> Service phụ thuộc interface repository để test bằng fake, và để đổi DB ít chạm nghiệp vụ.</li>
        </ul>
        <p>Với dự án nhà nước, tổ chức code còn phục vụ bảo trì sau bàn giao: tên lớp theo nghiệp vụ, không viết logic “tạm” trong controller vì đội bảo hành sẽ đọc lại sau một năm.</p>`
      }
    ],
    questions: [
      {
        level: "Cơ bản",
        q: "OOP khác gì so với viết tuần tự trong một file service?",
        html: `<p>Viết tuần tự chạy được nhanh lúc đầu, nhưng rule nằm rải rác nên sửa một chỗ dễ vỡ chỗ khác. OOP gom dữ liệu và rule vào đối tượng có trách nhiệm rõ: <code>HoSo</code> biết trạng thái hợp lệ, <code>DuyetHoSoService</code> điều phối transaction và gọi cổng tích hợp. Người khác đọc tên lớp là thấy biên giới.</p>`,
        tip: "Nhấn mạnh đóng gói rule chuyển trạng thái để không ai update cột status trực tiếp từ nhiều chỗ."
      },
      {
        level: "Trung cấp",
        q: "Giải thích SOLID bằng một API duyệt hồ sơ.",
        html: `<p>Controller chỉ nhận request và gọi use case. Use case phụ thuộc interface lưu hồ sơ và interface thông báo, không new trực tiếp implementation. Thêm bước “gửi sang trục liên thông” là class mới, không nhét thêm 200 dòng vào hàm duyệt. Interface lưu hồ sơ không chứa method xuất Excel. Class con của bộ lọc không được nuốt lỗi mà cha không khai báo.</p>`,
        tip: "Nếu bị hỏi 'có over-engineering không?', nói bạn chỉ tách khi có lý do sửa thứ hai hoặc cần test."
      },
      {
        level: "Trung cấp",
        q: "Composition và inheritance, bạn chọn gì?",
        html: `<p>Em ưu tiên composition. Ví dụ xuất biên bản PDF và Excel là hai class cùng interface, service giữ một danh sách exporter. Kế thừa chỉ khi đúng quan hệ 'là một' và hợp đồng không đổi. Kế thừa service base 'cho có util' thường thành God class.</p>`,
        tip: "Nhắc một lần bạn hối hận vì base class — rất thuyết phục."
      },
      {
        level: "Nâng cao",
        q: "Anemic domain model là gì? Có nên tránh không?",
        html: `<p>Anemic model là object chỉ có getter/setter, mọi rule nằm trong service. CRUD đơn giản thì chấp nhận được và dễ map JPA. Khi rule chuyển trạng thái, tính tiền, kiểm tra quyền trên dữ liệu dày lên, em kéo rule về domain object để không có hai service sửa cùng một quy tắc theo hai cách. Với Middle, em không xây DDD đầy đủ nếu bài toán chỉ là form quản trị.</p>`,
        tip: "Kết luận tình huống: CRUD thì anemic ổn; workflow nhiều bước thì gom rule."
      }
    ],
    quiz: [
      {
        q: "Dependency Inversion trong service nghĩa là gì?",
        options: [
          "Service tự tạo new RepositoryImpl() bên trong",
          "Service phụ thuộc interface, implementation được đưa từ ngoài vào",
          "Mọi class đều phải là abstract class"
        ],
        correct: 1,
        explain: "Phụ thuộc abstraction giúp test và đổi implementation mà không sửa nghiệp vụ."
      }
    ]
  },
  {
    id: "pattern",
    group: "Nền tảng",
    title: "Design pattern hay gặp",
    level: "Trung cấp",
    summary: "Chỉ cần các pattern thật sự xuất hiện trong Spring, Nest và hệ thống phân tán. Nói được lúc nào không dùng cũng quan trọng.",
    theory: [
      {
        h: "Pattern nên nói được",
        html: `<ul>
          <li><strong>Singleton:</strong> một bean Spring hoặc provider Nest trong scope mặc định. Không dùng singleton để giữ dữ liệu request của user.</li>
          <li><strong>Factory:</strong> chọn implementation theo loại văn bản, loại cổng tích hợp.</li>
          <li><strong>Strategy:</strong> các cách tính phí, các cách ký số, thay chuỗi if dài.</li>
          <li><strong>Template method:</strong> khung xử lý job: mở transaction, chạy, log, đóng — phần giữa do lớp con.</li>
          <li><strong>Adapter:</strong> bọc API đối tác về interface nội bộ, để đối tác đổi field không lan vào nghiệp vụ.</li>
          <li><strong>Facade:</strong> một service cửa ngõ che nhiều repository khi client chỉ cần một thao tác.</li>
          <li><strong>Observer / pub-sub:</strong> sau khi duyệt xong thì phát event, các phần gửi mail, audit, đồng bộ nghe riêng.</li>
          <li><strong>Decorator:</strong> thêm cache, log, metric bọc quanh lời gọi, không sửa hàm gốc.</li>
        </ul>`
      }
    ],
    questions: [
      {
        level: "Cơ bản",
        q: "Strategy khác if-else chỗ nào?",
        html: `<p>If-else gom mọi biến thể vào một hàm, thêm nhánh là sửa hàm cũ và khó test riêng. Strategy mỗi biến thể một class cùng interface. Hàm nghiệp vụ chỉ nhận interface. Khi thêm loại thuế mới, em thêm class và đăng ký, ít đụng code đã nghiệm thu.</p>`,
        tip: "Nói rõ: nếu chỉ có hai nhánh và không đổi, if-else dễ đọc hơn."
      },
      {
        level: "Trung cấp",
        q: "Adapter dùng khi tích hợp hệ thống ngoài ra sao?",
        html: `<p>Đối tác trả XML, mã lỗi riêng, timeout riêng. Em viết <code>TaxGateway</code> nội bộ với method <code>submit(HoSo)</code>. Adapter chuyển DTO nội bộ sang XML, gọi HTTP, map mã lỗi đối tác về lỗi miền. Service duyệt hồ sơ không biết đối tác là ai. Đổi nhà cung cấp là viết adapter mới.</p>`,
        tip: "Thêm: timeout, retry và log request id nằm trong adapter, không rải trong controller."
      },
      {
        level: "Trung cấp",
        q: "Vì sao không nhét trạng thái user vào bean Singleton?",
        html: `<p>Bean singleton dùng chung mọi request. Field kiểu <code>currentUser</code> sẽ bị request sau ghi đè — lỗi bảo mật nghiêm trọng. Dữ liệu theo request để ở tham số, SecurityContext hoặc scope request. Singleton chỉ giữ dependency không trạng thái: repository, client, config.</p>`,
        tip: "Đây là câu phân biệt người đã từng gây bug đa luồng."
      },
      {
        level: "Nâng cao",
        q: "Outbox pattern giải quyết việc gì?",
        html: `<p>Vừa ghi DB vừa gửi Kafka trong hai bước tách rời sẽ có lúc DB commit nhưng gửi event thất bại, hoặc ngược lại. Outbox ghi event vào bảng cùng transaction với dữ liệu nghiệp vụ. Một tiến trình khác đọc bảng đó và gửi broker, đánh dấu đã gửi. Nhờ vậy không mất event khi process chết giữa chừng. Cần idempotent phía consumer vì có thể gửi trùng.</p>`,
        tip: "Nói một câu: em không dual-write trần nếu mất event là không chấp nhận được."
      }
    ],
    quiz: [
      {
        q: "Bọc API đối tác về interface nội bộ là pattern nào?",
        options: ["Singleton", "Adapter", "Template method"],
        correct: 1,
        explain: "Adapter chuyển hợp đồng bên ngoài thành hợp đồng hệ thống mình hiểu."
      }
    ]
  },
  {
    id: "java",
    group: "Ngôn ngữ",
    title: "Java cốt lõi cho backend",
    level: "Cơ bản",
    summary: "Phỏng vấn Middle ít hỏi cú pháp, nhiều hỏi equals/hashCode, collection, exception, stream và cách không làm hỏng bộ nhớ hay luồng.",
    theory: [
      {
        h: "Những điểm hay bị hỏi",
        html: `<ul>
          <li><strong>equals và hashCode</strong> phải đi cùng nhau. Entity đưa vào <code>HashSet</code> hoặc dùng làm key mà chỉ override một bên sẽ mất phần tử.</li>
          <li><strong>HashMap</strong> không đồng bộ. Chia sẻ giữa các request mà ghi thì dùng cấu trúc an toàn hoặc không chia sẻ.</li>
          <li><strong>ArrayList và LinkedList:</strong> gần như luôn ArrayList. LinkedList hiếm khi thắng trên CPU cache.</li>
          <li><strong>Checked và unchecked exception:</strong> lỗi nghiệp vụ có thể là runtime để khỏi khai báo ném khắp nơi; lỗi lập trình không nuốt.</li>
          <li><strong>try-with-resources</strong> đóng JDBC, stream file. Quên đóng connection là sự cố production cổ điển.</li>
          <li><strong>String</strong> bất biến. Nối chuỗi trong vòng lặp lớn thì cân nhắc <code>StringBuilder</code>.</li>
          <li><strong>Optional</strong> cho giá trị trả về có thể vắng, không dùng làm field entity hay tham số mọi nơi.</li>
        </ul>`
      },
      {
        h: "Immutable và record",
        html: `<p>DTO bất biến giảm bug “hàm kia sửa mất dữ liệu của tôi”. Record Java hợp với DTO nội bộ. Entity JPA thì không immutable hoàn toàn vì framework cần set field, nhưng collection con nên bọc lại, không trả list gốc cho chỗ khác sửa.</p>`
      }
    ],
    questions: [
      {
        level: "Cơ bản",
        q: "Vì sao override equals mà quên hashCode thì sai?",
        html: `<p><code>HashMap</code> và <code>HashSet</code> tìm bucket bằng hashCode rồi mới so equals. Hai object equals nhau nhưng khác hash sẽ nằm hai bucket, set chứa cả hai, map không tìm thấy. Em giữ chúng nhất quán và không dùng field hay đổi, ví dụ trạng thái, để tính hash của key.</p>`,
        tip: "Với JPA, cẩn thận equals trên entity chưa có id."
      },
      {
        level: "Cơ bản",
        q: "Checked exception và runtime exception bạn dùng thế nào?",
        html: `<p>Lỗi cú pháp nghiệp vụ như “hồ sơ đã khóa” em để runtime exception có mã lỗi, để tầng trên map ra HTTP 409 mà không khai báo throws qua 5 lớp. Lỗi tích hợp có thể bọc thành exception riêng kèm request id. Em không catch Exception rồi trả null — mất dấu vết.</p>`,
        tip: "Nói thêm: log một lần ở biên, không log rồi ném lại gây trùng log."
      },
      {
        level: "Trung cấp",
        q: "Stream có luôn nhanh hơn vòng for không?",
        html: `<p>Không. Stream dễ đọc khi lọc và map. Parallel stream trên collection nhỏ hoặc khi lambda đụng tài nguyên chung có thể chậm hơn và sai. Em dùng parallel khi dữ liệu lớn, thao tác CPU thuần, đã đo. IO trong parallel stream dễ cạn pool kết nối.</p>`,
        tip: "Câu này lọc người học thuộc 'stream là hiện đại nên nhanh'."
      },
      {
        level: "Trung cấp",
        q: "Khác nhau giữa == và equals với String, Integer?",
        html: `<p><code>==</code> so sánh tham chiếu, <code>equals</code> so sánh giá trị. String literal có thể bị gom pool nên <code>==</code> đôi khi đúng một cách tình cờ — không dựa vào đó. Integer cache khoảng -128 đến 127 nên <code>==</code> với số nhỏ có thể true, số lớn thì false. So giá trị luôn dùng equals.</p>`,
        tip: "Ngắn thôi, rồi chuyển sang chuyện bạn tránh so id bằng ==."
      }
    ],
    quiz: [
      {
        q: "Hai object bằng nhau theo equals thì hashCode phải thế nào?",
        options: ["Khác nhau để tránh đụng độ", "Bằng nhau", "Luôn bằng 0"],
        correct: 1,
        explain: "equals true thì hashCode phải giống, nếu không HashMap/HashSet hỏng."
      }
    ]
  },
  {
    id: "spring",
    group: "Ngôn ngữ",
    title: "Spring Boot",
    level: "Trung cấp",
    summary: "Trọng tâm: IoC, bean scope, transaction, JPA, validation, exception handler và cách cấu hình theo môi trường. JD chấp nhận Spring hoặc Nest; nếu bạn mạnh một phía, hãy nói thật và nắm khái niệm phía còn lại.",
    theory: [
      {
        h: "IoC và vòng đời bean",
        html: `<p>Bạn không new service. Spring tạo, tiêm phụ thuộc và quản lý vòng đời. Scope mặc định là singleton. <code>@Transactional</code> chỉ có hiệu lực khi gọi qua proxy — gọi method transactional từ method khác trong cùng class thì proxy không xen vào, transaction không chạy như bạn tưởng.</p>
        <p>Cấu hình theo profile: <code>application-dev.yml</code>, <code>application-prod.yml</code>. Secret không commit; lấy từ biến môi trường hoặc secret của Kubernetes.</p>`
      },
      {
        h: "Tầng trong một service thường gặp",
        html: `<ul>
          <li><strong>Controller:</strong> HTTP, validation đầu vào, status code.</li>
          <li><strong>Application service:</strong> transaction và điều phối.</li>
          <li><strong>Domain:</strong> rule nếu bài toán đủ phức tạp.</li>
          <li><strong>Repository:</strong> JPA hoặc JDBC.</li>
          <li><strong>Client:</strong> gọi hệ thống ngoài, có timeout.</li>
        </ul>
        <p><code>@ControllerAdvice</code> map exception thành body lỗi thống nhất: mã, thông điệp, trace id. Không trả stack trace ra client production.</p>`
      },
      {
        h: "JPA những bẫy Middle phải biết",
        html: `<ul>
          <li>N+1: lấy danh sách cha rồi lazy load con trong vòng lặp. Sửa bằng fetch join hoặc entity graph, và đo số query.</li>
          <li>LazyInitializationException khi chạm quan hệ sau khi session đóng. Không mở <code>open-in-view</code> cho xong việc trên hệ thống lớn.</li>
          <li>Transaction read-only cho báo cáo. Ghi thì để transaction ngắn, không gọi HTTP bên trong transaction.</li>
          <li>Optimistic lock bằng <code>@Version</code> khi hai người sửa cùng hồ sơ.</li>
        </ul>`
      }
    ],
    questions: [
      {
        level: "Cơ bản",
        q: "Spring IoC giải quyết vấn đề gì?",
        html: `<p>Thay vì mỗi lớp tự tạo phụ thuộc, container tạo và nối chúng. Đổi implementation, thêm transaction hay security mà lớp nghiệp vụ không tự new đối tượng cụ thể. Test thì thay bean bằng bản giả.</p>`,
        tip: "Một câu về constructor injection: phụ thuộc bắt buộc nằm ở constructor, field injection khó test và che thiếu phụ thuộc."
      },
      {
        level: "Trung cấp",
        q: "Vì sao @Transactional trên method private hoặc self-invocation không chạy?",
        html: `<p>Spring bọc bean bằng proxy. Transaction bắt đầu khi lời gọi đi từ ngoài vào proxy. Gọi <code>this.method()</code> trong cùng class thì vào thẳng object, bỏ qua proxy. Method private cũng không được proxy theo cơ chế mặc định. Em tách sang bean khác hoặc gọi qua chính bean đã tiêm.</p>`,
        tip: "Kể một bug: log thấy không rollback vì tự gọi nội bộ."
      },
      {
        level: "Trung cấp",
        q: "N+1 là gì và bạn phát hiện thế nào?",
        html: `<p>Một query lấy 50 hồ sơ, rồi mỗi hồ sơ một query lấy đơn vị — thành 51 query. Em bật log SQL hoặc nhìn trace. Cách xử lý: join fetch khi tập con nhỏ; nếu tập lớn thì query riêng theo danh sách id hoặc DTO projection, tránh kéo cả graph. Em không fetch join hai collection cùng lúc vì nhân bản dòng.</p>`,
        tip: "Nói công cụ: log Hibernate, Micrometer, hoặc đếm query trong test."
      },
      {
        level: "Nâng cao",
        q: "Propagation REQUIRED và REQUIRES_NEW khác nhau khi nào?",
        html: `<p>REQUIRED nhập transaction hiện có, không có thì tạo mới. Cả khối cùng commit hoặc rollback. REQUIRES_NEW tạm dừng transaction ngoài, mở transaction riêng và commit độc lập. Em dùng REQUIRES_NEW cho audit bắt buộc phải lưu dù nghiệp vụ rollback, nhưng phải hiểu lock và deadlock. Không lạm dụng vì khó suy luận.</p>`,
        tip: "Ví dụ: ghi nhật ký tích hợp dù việc gửi bị rollback."
      },
      {
        level: "Trung cấp",
        q: "Bạn tổ chức validation và lỗi API ra sao?",
        html: `<p>Bean Validation trên DTO cho field rỗng, độ dài, định dạng. Rule cần đọc DB, ví dụ trùng số hồ sơ, để ở service và ném exception nghiệp vụ. <code>@ControllerAdvice</code> trả JSON một kiểu: code, message, details, traceId. 400 cho dữ liệu sai, 401 chưa đăng nhập, 403 không đủ quyền, 409 xung đột trạng thái, 422 hoặc 400 cho rule nghiệp vụ tùy convention đội, 500 cho lỗi không lường trước.</p>`,
        tip: "Nhấn mạnh không lộ SQL hay stack ra ngoài."
      }
    ],
    quiz: [
      {
        q: "Gọi this.save() bên trong cùng class có kích hoạt @Transactional của save không?",
        options: [
          "Có, vì method có annotation",
          "Không, vì không đi qua proxy",
          "Chỉ khi method là public static"
        ],
        correct: 1,
        explain: "Self-invocation đi thẳng vào object, proxy gắn transaction bị bỏ qua."
      }
    ]
  },
  {
    id: "nest",
    group: "Ngôn ngữ",
    title: "Node.js, TypeScript và NestJS",
    level: "Trung cấp",
    summary: "Nếu bạn đến từ Spring, hãy nói Nest bằng cùng các khái niệm: module, provider, guard, pipe, interceptor, exception filter. Điểm khác lớn nhất là một luồng sự kiện và các bẫy async.",
    theory: [
      {
        h: "Event loop, phần Middle cần nói đúng",
        html: `<p>Node xử lý JavaScript trên một luồng chính. IO mạng nhường lúc chờ. CPU nặng trên luồng chính làm mọi request chậm. Công việc tính toán dài nên đưa sang worker hoặc service khác. Đừng chặn bằng vòng lặp lớn đồng bộ.</p>
        <p>Promise bị reject mà không await và không có <code>catch</code> sẽ thành lỗi khó thấy. Trong Nest, filter bắt exception từ async nếu bạn <code>throw</code> hoặc để promise reject đúng cách.</p>`
      },
      {
        h: "Các mảnh của Nest",
        html: `<ul>
          <li><strong>Module:</strong> gom controller và provider, giống biên giới một cụm chức năng.</li>
          <li><strong>Provider:</strong> class được tiêm, mặc định singleton trong module.</li>
          <li><strong>Pipe:</strong> validate và biến đổi DTO, thường với class-validator.</li>
          <li><strong>Guard:</strong> xác thực và phân quyền trước khi vào handler.</li>
          <li><strong>Interceptor:</strong> bọc trước sau, log thời gian, map response.</li>
          <li><strong>Exception filter:</strong> một format lỗi cho toàn API.</li>
        </ul>
        <p>TypeORM hoặc Prisma nằm sau repository. Transaction cần bao đúng phạm vi, không <code>await</code> một HTTP call dài bên trong transaction DB.</p>`
      }
    ],
    questions: [
      {
        level: "Cơ bản",
        q: "NestJS khác Express thuần ở điểm nào?",
        html: `<p>Express tự do, cấu trúc do từng người đặt. Nest có module, DI, decorator, pipe, guard, filter — gần Spring. Đội đông và dự án bàn giao cho đơn vị khác sẽ đỡ mỗi người một kiểu thư mục. Express vẫn nằm dưới làm HTTP adapter.</p>`,
        tip: "Đừng chê Express. Nói Nest giúp convention khi nhiều người cùng sửa."
      },
      {
        level: "Trung cấp",
        q: "Vì sao await quên trong service lại nguy hiểm?",
        html: `<p>Hàm trả về promise nhưng người gọi không chờ. Lỗi xảy ra sau khi đã trả HTTP 200, hoặc transaction commit trước khi ghi phụ xong. Em bật lint yêu cầu xử lý promise, và mọi đường ra lỗi đều đi qua filter. Test thì assert cả trường hợp reject.</p>`,
        tip: "Liên hệ một bug race: trả thành công nhưng mail hoặc bản ghi con chưa ghi."
      },
      {
        level: "Trung cấp",
        q: "Guard, pipe, interceptor đứng thứ tự nào?",
        html: `<p>Middleware chạy sớm. Rồi guard quyết định có cho vào không. Pipe validate tham số. Interceptor bọc phần trước và sau handler. Filter bắt lỗi. Em đặt xác thực ở guard, kiểm tra body ở pipe, đo thời gian ở interceptor, format lỗi ở filter. Không nhét cả bốn việc vào một middleware cho nhanh.</p>`,
        tip: "Vẽ thứ tự bằng lời nếu họ hỏi request đi đường nào."
      },
      {
        level: "Nâng cao",
        q: "So Spring và Nest khi cùng một bài toán API nội bộ.",
        html: `<p>Cùng ý: DI, module, filter lỗi, transaction quanh use case. Spring mạnh hệ sinh thái JDBC, batch, tích hợp sẵn trên nhiều dự án Java nhà nước. Nest mạnh nếu đội làm TypeScript full stack và muốn chung kiểu với frontend. Hiệu năng thường không phải lý do chọn — IO và SQL mới là nút thắt. Em chọn theo đội và hệ thống sẵn có, rồi giữ biên giới tầng giống nhau để người còn lại đọc được.</p>`,
        tip: "JD ưu tiên người biết cả hai. Thành thật về phía bạn làm chủ, khái niệm phía kia vẫn nói được."
      }
    ],
    quiz: [
      {
        q: "Việc nào không nên đặt trên luồng chính của Node trong request thông thường?",
        options: [
          "Đọc JSON nhỏ",
          "Tính toán CPU rất nặng kéo dài",
          "Gọi repository có await"
        ],
        correct: 1,
        explain: "CPU dài trên event loop làm các request khác phải chờ."
      }
    ]
  }
];
