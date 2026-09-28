MODULES.push(
  {
    id: "micro",
    group: "Kiến trúc",
    title: "Microservices và hệ phân tán",
    level: "Nâng cao",
    summary: "Mức Middle không cần vẽ cả nền tảng quốc gia, nhưng phải biết khi nào tách service, giao tiếp đồng bộ hay sự kiện, và các món đi kèm: gateway, discovery, config, log tập trung.",
    theory: [
      {
        h: "Khi nào tách service",
        html: `<p>Tách khi biên giới nghiệp vụ rõ, vòng đời deploy khác nhau, hoặc một phần cần scale riêng. Không tách theo từng bảng. Mỗi service sở hữu dữ liệu của nó, người khác hỏi qua API hoặc sự kiện, không vào thẳng database của nhau. Hệ thống nhỏ trong một đội có thể là modular monolith: nhiều module, một nơi deploy, vẫn có biên giới — rồi mới tách khi đau thật.</p>`
      },
      {
        h: "Thành phần hay gặp",
        html: `<ul>
          <li><strong>API Gateway:</strong> cửa vào, TLS, xác thực thô, giới hạn tốc độ, định tuyến.</li>
          <li><strong>Service discovery:</strong> service tìm nhau theo tên khi IP pod đổi. Kubernetes Service đã làm việc này trong cụm.</li>
          <li><strong>Config tập trung:</strong> đổi cấu hình không sửa image. Secret tách khỏi config thường.</li>
          <li><strong>Log và trace:</strong> một request qua gateway rồi hai service phải cùng trace id để lần lỗi.</li>
          <li><strong>Circuit breaker:</strong> đối tác chết thì ngắt nhanh, trả lỗi có kiểm soát, tránh làm cạn luồng của mình.</li>
          <li><strong>Timeout và retry:</strong> retry chỉ cho thao tác an toàn nếu lặp lại. Retry không kèm giới hạn sẽ làm sự cố nặng hơn.</li>
        </ul>`
      },
      {
        h: "Bốn tính chất Middle cần nói bằng ví dụ",
        html: `<ul>
          <li><strong>Hiệu năng:</strong> đo thời gian ở DB và lời gọi mạng trước khi thêm máy.</li>
          <li><strong>Scale:</strong> thêm pod khi không giữ trạng thái trong bộ nhớ cục bộ.</li>
          <li><strong>Sẵn sàng cao:</strong> nhiều bản sao, health check, pod chết thì cái khác nhận việc.</li>
          <li><strong>Chịu lỗi:</strong> một service thông báo hỏng không được làm sập việc duyệt hồ sơ. Lưu việc gửi sau.</li>
        </ul>`
      }
    ],
    questions: [
      {
        level: "Cơ bản",
        q: "Microservices khác monolith thế nào?",
        html: `<p>Monolith deploy một khối, gọi hàm trong process, transaction DB dễ. Microservice mỗi phần deploy riêng, gọi qua mạng, lỗi từng phần và dữ liệu tách. Em chỉ tách khi cần độc lập triển khai hoặc scale. Tách sớm thì phải gánh distributed transaction, log rải và version API mà chưa có lợi.</p>`,
        tip: "Thái độ cân bằng này hợp vị trí Middle hơn là hô hào microservices cho mọi đề bài."
      },
      {
        level: "Trung cấp",
        q: "Đồng bộ và event-driven, bạn chọn lúc nào?",
        html: `<p>Đồng bộ khi người gọi cần kết quả ngay để trả lời cán bộ, và chuỗi gọi ngắn. Bất đồng bộ khi việc dài, nhiều bên nghe, hoặc bên nhận được phép trễ vài giây đến vài phút. Em nói rõ độ trễ cho BA. Event làm mất ràng buộc tức thời: màn hình phải có trạng thái “đang đồng bộ”.</p>`,
        tip: "Đưa một luồng thật trong dự án của bạn, dù chỉ là gửi email sau khi lưu."
      },
      {
        level: "Trung cấp",
        q: "Vì sao service này không nên đọc bảng của service kia?",
        html: `<p>Khóa dữ liệu bị phá. Đội kia đổi cột là đội này vỡ lúc chạy, không vỡ lúc biên dịch. Không deploy độc lập được. Em lấy dữ liệu qua API hoặc nhận bản sao qua sự kiện và chấp nhận bản sao có thể chậm hơn nguồn một nhịp.</p>`,
        tip: "Nếu hệ cũ đang chia sẻ DB, nói bạn biết nợ kỹ thuật đó và sẽ không thêm join mới xuyên service."
      },
      {
        level: "Nâng cao",
        q: "Circuit breaker giúp gì khi cổng liên thông chết?",
        html: `<p>Nếu mỗi request vẫn chờ timeout 30 giây, luồng của service mình cạn và người dùng thấy mọi chức năng đều chậm. Circuit breaker đếm lỗi, mở mạch, các request sau thất bại ngay hoặc đi phương án dự phòng trong một khoảng thời gian, rồi thử lại ít request. Duyệt nội bộ vẫn chạy, trạng thái liên thông để “chờ gửi lại”. Kết hợp timeout ngắn hơn timeout của người gọi phía trên.</p>`,
        tip: "Nhắc retry bão: tất cả pod cùng retry ngay lập tức sẽ đánh ngã đối tác vừa sống lại."
      },
      {
        level: "Nâng cao",
        q: "Bạn lần một request chậm qua ba service bằng cách nào?",
        html: `<p>Mỗi hop ghi trace id và span: gateway, service hồ sơ, service danh mục. Xem trace biết thời gian nằm ở query hay ở mạng. Log cùng id đó. Metric có tỷ lệ lỗi và độ trễ theo endpoint. Không có trace thì em ít nhất truyền header correlation id và grep ở log tập trung. Đó là mức em làm được nếu đội chưa có Jaeger hay Tempo.</p>`,
        tip: "Nói tên công cụ bạn thật sự đã mở, đừng kể một đống tên chưa đụng."
      }
    ],
    quiz: [
      {
        q: "Cách chia sẻ dữ liệu giữa hai microservice được ưu tiên?",
        options: [
          "Service B query thẳng bảng của service A",
          "Qua API hoặc sự kiện, mỗi bên sở hữu dữ liệu của mình",
          "Dùng chung một EntityManager"
        ],
        correct: 1,
        explain: "Sở hữu dữ liệu theo service giữ được quyền deploy và đổi schema độc lập."
      }
    ]
  },
  {
    id: "k8s",
    group: "Vận hành",
    title: "Docker và Kubernetes",
    level: "Trung cấp",
    summary: "Bạn không cần thi chứng chỉ CKA. Bạn cần đóng gói được ứng dụng, đọc được Pod, Deployment, Service, ConfigMap, Secret, Ingress, volume, và biết nhìn log khi QA nói môi trường UAT chết.",
    theory: [
      {
        h: "Docker",
        html: `<p>Image là bản đóng gói ứng dụng và runtime. Container là process chạy từ image. Dockerfile đa giai đoạn để không nhét compiler vào image chạy. Một process chính trong container. Ứng dụng phải nghe port từ cấu hình và ghi log ra stdout để nền tảng thu, đừng chỉ ghi file trong container rồi mất khi pod biến mất. Không chạy bằng user root nếu không cần. Không COPY file <code>.env</code> bí mật vào image.</p>`
      },
      {
        h: "Các object Kubernetes",
        html: `<ul>
          <li><strong>Pod:</strong> một hoặc vài container luôn đi cùng, có IP riêng, chết là mất nếu không có bản sao.</li>
          <li><strong>Deployment:</strong> giữ số pod mong muốn, cập nhật từng phần, lùi bản được.</li>
          <li><strong>Service:</strong> tên và IP ổn định trỏ tới các pod đổi IP liên tục.</li>
          <li><strong>ConfigMap:</strong> cấu hình không bí mật. <strong>Secret:</strong> mật khẩu, khóa — vẫn phải kiểm soát ai được xem.</li>
          <li><strong>Ingress:</strong> HTTP từ ngoài vào service theo tên miền và đường dẫn.</li>
          <li><strong>PersistentVolume:</strong> đĩa sống lâu hơn pod, cho dữ liệu không thể chỉ nằm trong container. Database thường là dịch vụ riêng, không nhét vào pod ứng dụng cho qua chuyện.</li>
          <li><strong>Probe:</strong> liveness khởi động lại khi kẹt; readiness rút khỏi service khi chưa sẵn sàng nhận traffic. Probe sai khiến pod bị restart vòng lặp.</li>
        </ul>`
      },
      {
        h: "Khi UAT báo lỗi",
        html: `<p>Xem pod có Running không, restart bao nhiêu lần, event kéo image hay thiếu secret, log container, có vào được DB từ đúng cấu hình không. Phân biệt lỗi ứng dụng và lỗi nền tảng. Sửa xong nói lại QA bằng hiện tượng và nguyên nhân, không chỉ “em restart”.</p>`
      }
    ],
    questions: [
      {
        level: "Cơ bản",
        q: "Image khác container thế nào?",
        html: `<p>Image là gói bất biến, như bản cài. Container là lần chạy của gói đó, có trạng thái tạm. Cùng một image em chạy ở DEV và Production với config khác nhau qua biến môi trường, để khỏi “máy em chạy được”.</p>`,
        tip: "Thêm: em không sửa code trực tiếp trong container đang chạy."
      },
      {
        level: "Trung cấp",
        q: "Deployment và Service mỗi cái làm gì?",
        html: `<p>Deployment đảm bảo luôn có đủ pod ứng dụng và thay image theo chiến lược cập nhật. Service là địa chỉ ổn định: các pod sau mỗi lần tạo lại đổi IP, client chỉ cần gọi tên service. Thiếu service thì các service khác không biết gọi vào đâu sau khi pod restart.</p>`,
        tip: "Nếu họ hỏi Ingress, nói đó là lớp HTTP phía trước service, không thay thế Service."
      },
      {
        level: "Trung cấp",
        q: "ConfigMap khác Secret? Secret trong Git được không?",
        html: `<p>ConfigMap cho URL, cờ bật tắt, mức log. Secret cho mật khẩu database và khóa ký. Git chỉ nên chứa bản mẫu không có giá trị thật, hoặc bản đã mã hóa theo công cụ đội đang dùng. Giá trị thật bơm lúc deploy. Image không chứa secret vì image hay bị copy sang registry khác.</p>`,
        tip: "Kể bạn đã từng thấy mật khẩu trong application.yml và bạn chuyển ra biến môi trường."
      },
      {
        level: "Trung cấp",
        q: "Liveness và readiness khác gì?",
        html: `<p>Readiness sai thì pod chưa kết nối được DB vẫn nhận request và trả 500. Liveness sai, ví dụ kiểm tra một dependency chậm, thì Kubernetes giết pod đang khỏe và gây restart liên tục. Readiness trả lời “có nên đưa traffic vào không”. Liveness trả lời “process này đã kẹt cứng chưa”. Endpoint probe phải rẻ.</p>`,
        tip: "Đây là câu rất phân hóa người chỉ mới học từ khóa Pod."
      },
      {
        level: "Nâng cao",
        q: "Ứng dụng cần chuẩn bị gì để chạy nhiều pod?",
        html: `<p>Không lưu session trong RAM của một máy. File upload không nằm đĩa cục bộ pod nếu request sau có thể vào pod khác — dùng object storage hoặc đĩa chung có chủ đích. Job định kỳ chỉ một người chạy, dùng khóa. Log ra stdout, thời gian theo UTC hoặc có zone rõ. Kết nối DB có giới hạn mỗi pod để 10 pod không mở 10 lần pool quá lớn.</p>`,
        tip: "Nói một câu về horizontal pod autoscaler chỉ có ích khi app stateless và nút thắt không phải là database."
      }
    ],
    quiz: [
      {
        q: "Pod vừa khởi động, chưa kết nối DB, nhưng đã nhận request người dùng. Probe nào xử lý việc này?",
        options: ["Readiness", "Chỉ tăng số replica", "PersistentVolume"],
        correct: 0,
        explain: "Readiness giữ pod ngoài danh sách nhận traffic cho đến khi ứng dụng sẵn sàng."
      }
    ]
  },
  {
    id: "cicd",
    group: "Vận hành",
    title: "Git, CI/CD và xử lý sự cố",
    level: "Trung cấp",
    summary: "Quy trình build và deploy là một phần việc của Middle, nhất là khi môi trường DEV, UAT và Production tách bạch như dự án nhà nước.",
    theory: [
      {
        h: "Git trong đội",
        html: `<p>Nhánh ngắn từ nhánh chính, merge qua merge request, có người review. Commit nói vì sao. Không commit secret, file build, dữ liệu thật của người dân. Tag hoặc commit id gắn với bản đã lên UAT để khi nghiệm thu còn biết đúng bản nào.</p>`
      },
      {
        h: "Pipeline",
        html: `<p>Đẩy code thì CI chạy build, test, quét lỗi phụ thuộc ở mức đội đang có, đóng image, không dùng tag <code>latest</code> mơ hồ cho production. CD lên DEV tự động. Lên UAT và Production có bước duyệt. Cấu hình theo môi trường, cùng một image. Migrate DB là bước có kiểm soát, không để ứng dụng tự sửa schema lúc khởi động trên production nếu đội chưa có quy ước an toàn.</p>`
      },
      {
        h: "Sự cố",
        html: `<p>Giữ bình tĩnh, khoanh vùng: một người dùng hay mọi người, từ lúc nào, bản vừa deploy hay dữ liệu. Xem log theo trace id, trạng thái pod, lỗi đối tác. Có thể lùi bản nếu bản mới gây ra. Viết lại nguyên nhân sau đó: thiếu test nào, thiếu cảnh báo nào. Không sửa dữ liệu production bằng tay nếu chưa có xác nhận và bản sao câu lệnh.</p>`
      }
    ],
    questions: [
      {
        level: "Cơ bản",
        q: "Merge request dùng để làm gì ngoài việc ghép code?",
        html: `<p>Là chỗ người khác đọc giúp: đúng yêu cầu chưa, có lỗ hổng quyền không, có test không, có ghi log dữ liệu nhạy cảm không. Với em, review cũng là lúc giải thích cho đồng đội. Em tự đọc lại diff trước khi mời reviewer.</p>`,
        tip: "Kể một comment review bạn nhận và đã sửa — khiêm tốn và cụ thể."
      },
      {
        level: "Trung cấp",
        q: "Vì sao production không nên kéo tag latest?",
        html: `<p><code>latest</code> không nói được đang chạy commit nào, hai lần kéo có thể ra hai bản khác nhau, lúc sự cố không lùi đúng bản đã kiểm thử. Em gắn image bằng commit hoặc số build đã qua UAT. Bản lên production là bản đã nghiệm thu, không build lại từ nhánh khác cho “giống thế”.</p>`,
        tip: "Rất hợp ngữ cảnh bàn giao và đối chiếu biên bản."
      },
      {
        level: "Trung cấp",
        q: "Một API trên UAT trả 500, bạn làm những bước nào?",
        html: `<p>Lấy thời điểm, tài khoản, id hồ sơ, trace id từ QA. Xem đúng bản deploy chưa. Đọc log lỗi. Thử tách: lỗi mọi hồ sơ hay một dữ liệu. Kiểm tra kết nối DB, config, phụ thuộc. Sửa trên nhánh, có test cho đúng case, đưa lại UAT. Báo QA nguyên nhân và cách kiểm lại. Nếu chỉ mình em tái hiện được trên DEV thì chưa kết luận UAT đã hết lỗi.</p>`,
        tip: "Thứ tự: tái hiện, khoanh vùng, sửa, chứng minh. Đừng nhảy vào sửa đoán."
      },
      {
        level: "Nâng cao",
        q: "Unit test bạn viết cho backend tới đâu thì gọi là đủ với vai trò Middle?",
        html: `<p>Em test rule nghiệp vụ và các nhánh lỗi quan trọng: chuyển trạng thái hợp lệ, từ chối khi sai quyền, trùng khóa, mapping lỗi đối tác. Không cố phủ mọi getter. Test tích hợp với database nhúng hoặc testcontainers cho repository khó. Em không mock hết rồi khẳng định hệ thống đúng. Tên test nói tình huống, để QA và người bảo trì đọc được.</p>`,
        tip: "Nếu họ hỏi coverage, nói coverage là tín hiệu chứ không phải mục tiêu. Rule tiền và quyền mới là chỗ phải có test."
      }
    ],
    quiz: [
      {
        q: "Bản lên production nên được xác định bằng gì?",
        options: [
          "Tag image latest",
          "Đúng image đã build và đã qua UAT, gắn commit hoặc số build",
          "Copy thư mục từ máy DEV"
        ],
        correct: 1,
        explain: "Cần truy được bản đang chạy về đúng mã đã kiểm thử."
      }
    ]
  },
  {
    id: "gov",
    group: "Dự án nhà nước",
    title: "Bảo mật, audit và dự án cơ quan nhà nước",
    level: "Nâng cao",
    summary: "Phần ưu tiên của JD. Người phỏng vấn muốn thấy bạn từng hoặc sẵn sàng làm việc có tài liệu, nghiệm thu, phân quyền theo đơn vị, nhật ký và tích hợp nhiều bên — không chỉ demo CRUD.",
    theory: [
      {
        h: "Vòng đời một gói công việc",
        html: `<p>Đọc yêu cầu và biểu mẫu hiện tại của cán bộ. Chốt rule còn mơ hồ với BA trước khi code. Thiết kế API, dữ liệu, phân quyền, viết vào tài liệu thiết kế ngắn mà QA dùng được. Phát triển và unit test. Triển khai DEV rồi UAT. Sửa theo phiếu lỗi, không sửa “tiện thể” ngoài phạm vi biên bản. Nghiệm thu đối chiếu từng chức năng với tài liệu. Bàn giao kèm hướng dẫn cài đặt, tài khoản vai trò mẫu, script cấu hình, danh sách dịch vụ phụ thuộc.</p>`
      },
      {
        h: "Những yêu cầu hay lặp lại",
        html: `<ul>
          <li>Phân cấp Bộ, sở, phòng, cán bộ. Ai thấy dữ liệu nào phải thành test case.</li>
          <li>Không xóa cứng hồ sơ đã phát sinh. Hủy có lý do và người hủy.</li>
          <li>Audit: ai, lúc nào, làm gì, giá trị trước và sau, địa chỉ hoặc mã đơn vị. Log này không cho sửa tay.</li>
          <li>Tách môi trường. Dữ liệu người dân thật không mang xuống máy cá nhân.</li>
          <li>Tích hợp qua trục hoặc API được mô tả field, mã lỗi, cách đối soát khi hai bên lệch số.</li>
          <li>Báo cáo phải giải thích được nguồn số, tránh mỗi màn hình một công thức.</li>
          <li>Dữ liệu cá nhân: chỉ lấy đúng việc cần, phân quyền xem, không ghi thừa vào log ứng dụng.</li>
        </ul>`
      },
      {
        h: "Secure coding ở mức làm hàng ngày",
        html: `<ul>
          <li>Câu SQL tham số hóa, không nối chuỗi từ ô tìm kiếm.</li>
          <li>Kiểm tra quyền trên server cho từng id.</li>
          <li>Giới hạn kích thước file, loại file, không tin tên file client.</li>
          <li>Thư viện có lỗ hổng đã biết thì nâng bản theo pipeline, không để “để sau nghiệm thu”.</li>
          <li>Mã lỗi trả ra ngoài không kèm câu SQL.</li>
        </ul>`
      }
    ],
    questions: [
      {
        level: "Trung cấp",
        q: "Bạn phối hợp với BA và QA lúc nghiệm thu thế nào?",
        html: `<p>Trước UAT em gửi danh sách API, trạng thái hồ sơ và các case biên: hết quyền, trùng số, đối tác timeout. Khi có phiếu lỗi, em đối chiếu đúng câu trong tài liệu yêu cầu. Nếu tài liệu thiếu, em ghi nhận và nhờ BA chốt, không tự chọn chiều có lợi cho code. Lúc nghiệm thu, em hỗ trợ truy log bằng mã hồ sơ họ đang bấm, giải thích khác biệt môi trường nếu có, và sửa đúng phạm vi.</p>`,
        tip: "Giọng hợp tác. Đừng kể chuyện QA 'bắt bẻ'."
      },
      {
        level: "Trung cấp",
        q: "Thiết kế audit trail cho chức năng duyệt.",
        html: `<p>Mỗi lần đổi trạng thái ghi một dòng: id hồ sơ, hành động, người dùng, vai trò, đơn vị, thời điểm chuẩn, giá trị cũ, giá trị mới, mã trace. Ghi cùng transaction với việc duyệt để khỏi có duyệt mà không có lịch sử. Bảng này không có API sửa hoặc xóa cho ứng dụng thường. Màn hình tra cứu cho kiểm soát nội bộ, cũng phải phân quyền vì lịch sử chứa dữ liệu nghiệp vụ.</p>`,
        tip: "Thêm: log kỹ thuật và audit nghiệp vụ là hai thứ. Không thay audit bằng file log xoay vòng."
      },
      {
        level: "Nâng cao",
        q: "Hai hệ thống liên thông lệch số liệu, bạn xử lý ra sao?",
        html: `<p>Chốt định nghĩa số: thời điểm chốt, trạng thái nào được đếm, múi giờ. Lấy một mã hồ sơ lệch và đi từ nguồn: đã ghi nhận gửi chưa, message đã ack chưa, bên nhận trả mã gì, có nằm ở hàng đợi lỗi không. Nếu bên nhận thiếu, gửi lại bản mang id cũ để họ không tạo trùng. Viết câu đối soát chạy lại được, không sửa tay từng dòng trừ ca đơn lẻ có biên bản. Sau đó bịt chỗ gây lệch: timeout bị coi là thành công, hoặc thiếu idempotent.</p>`,
        tip: "Câu này rất gần việc thật của hệ thống dùng chung nhiều đơn vị."
      },
      {
        level: "Trung cấp",
        q: "SQL injection và IDOR bạn phòng thế nào trong code review?",
        html: `<p>Em tìm chỗ nối chuỗi SQL hoặc sort field lấy nguyên từ query. Ép tham số và whitelist. Em tìm API lấy chi tiết theo id mà chỉ kiểm tra đã đăng nhập. Bắt buộc có điều kiện đơn vị hoặc quyền sở hữu. Em nhìn log có in cả body chứa giấy tờ không. Review kiểu này em làm được đều, không cần chờ đợt pentest.</p>`,
        tip: "Nói một lỗi cụ thể bạn đã chặn lúc review nếu có."
      },
      {
        level: "Nâng cao",
        q: "Vì sao dự án nhà nước hay cần tài liệu trong khi code đã chạy?",
        html: `<p>Người nghiệm thu và đơn vị vận hành không đọc code để chấp nhận hệ thống. Tài liệu là thỏa thuận: chức năng nào có, ai được dùng, cài thế nào, phụ thuộc gì. Khi đổi người, đội bảo hành dựa vào đó. Em viết tài liệu đủ để đối chiếu, cập nhật khi behavior đổi, không viết một cuốn không ai đọc rồi để lệch với phần mềm.</p>`,
        tip: "Cho thấy bạn chấp nhận ràng buộc quy trình thay vì than phiền."
      }
    ],
    quiz: [
      {
        q: "Audit nghiệp vụ nên được lưu thế nào?",
        options: [
          "Ghi đè một cột note trên hồ sơ",
          "Một bản ghi lịch sử trong cùng transaction với thay đổi, không cho ứng dụng thường sửa",
          "Chỉ console.log trên server"
        ],
        correct: 1,
        explain: "Nhật ký phải còn đủ trước/sau và không biến mất khi file log bị xoay."
      }
    ]
  },
  {
    id: "hanh-vi",
    group: "Dự án nhà nước",
    title: "Tình huống và kỹ năng phối hợp",
    level: "Trung cấp",
    summary: "Các câu mềm vẫn cần ví dụ thật. Chuẩn bị 4 mẩu chuyện: một lần tự làm module, một lần sự cố, một lần bất đồng với BA hoặc frontend, một lần bạn giúp người mới.",
    theory: [
      {
        h: "Cách kể",
        html: `<p>Bối cảnh một câu. Việc bạn làm hai câu. Kết quả một câu. Bài học một câu. Không đổ lỗi danh tính đồng nghiệp. Có thể nói ràng buộc tiến độ và cách bạn báo rủi ro sớm cho lead.</p>`
      }
    ],
    questions: [
      {
        level: "Cơ bản",
        q: "Bạn nhận một module lạ thì những ngày đầu làm gì?",
        html: `<p>Đọc yêu cầu và luồng trạng thái, liệt kê chỗ chưa hiểu để hỏi BA một lần cho gọn. Xem code lân cận và convention đội. Chốt hợp đồng API sớm với frontend. Chia việc nhỏ, làm đường chính trước, nêu rủi ro tích hợp nếu phụ thuộc bên ngoài chưa có môi trường. Báo lead nếu ước lượng lệch, không đợi đến hạn mới nói.</p>`,
        tip: "Thể hiện tự chủ kèm thời điểm bạn vẫn nhờ người khác."
      },
      {
        level: "Trung cấp",
        q: "BA muốn một nút xuất toàn bộ dữ liệu nhiều năm, ngay trên request HTTP. Bạn phản hồi ra sao?",
        html: `<p>Em nói nhu cầu xuất là hợp lý, cách làm đồng bộ sẽ timeout và nặng database. Em đề xuất đặt yêu cầu xuất, xử lý nền, giới hạn khoảng thời gian, có thông báo khi file xong, và phân quyền file đó. Nếu họ cần gấp bản nhỏ, em làm giới hạn trước rồi mới tới bản đầy đủ. Em không nhận lời một API sync rồi để QA gặp timeout lúc nghiệm thu.</p>`,
        tip: "Giọng đưa phương án, không giọng từ chối việc."
      },
      {
        level: "Trung cấp",
        q: "Production lỗi sau bản bạn vừa đưa. Bạn làm gì?",
        html: `<p>Báo lead và người trực, khoanh vùng có phải bản mới không. Nếu đúng và ảnh hưởng rộng, lùi bản đã biết là ổn, rồi điều tra trên log, không thử nghiệm thêm trên production. Sau đó thêm test hoặc chốt chặn đã thiếu, viết vài dòng nguyên nhân để lần sau không mất. Không giấu để tự sửa lặng lẽ.</p>`,
        tip: "Trách nhiệm ở đây là thông báo sớm và có đường lùi."
      },
      {
        level: "Trung cấp",
        q: "Bạn mentor junior thế nào mà vẫn xong việc của mình?",
        html: `<p>Em giao một việc có biên rõ, chỉ chỗ tài liệu và một API mẫu trong dự án. Hẹn một lần review thay vì trả lời từng dòng cả ngày. Trong review em giải thích vì sao, ví dụ vì sao không nối SQL, và để họ sửa. Việc khó về kiến trúc em giữ, không giao rồi biến mất.</p>`,
        tip: "JD có ý hỗ trợ junior. Một ví dụ nhỏ là đủ."
      },
      {
        level: "Nâng cao",
        q: "Hãy mô tả một hệ thống bạn nắm, như thể đang whiteboard.",
        html: `<p>Chuẩn bị một sơ đồ nói trong 3 phút: người dùng gọi gateway, service nào giữ dữ liệu gì, chỗ nào đồng bộ, chỗ nào qua queue, DB nào, cache nào, chạy trên Kubernetes ra sao, một sự cố từng gặp. Kết thúc bằng giới hạn bạn biết — ví dụ “phần chữ ký số do đội khác giữ, em chỉ gọi adapter”. Người phỏng vấn tin người biết biên giới việc mình hơn người vẽ mọi mũi tên cho hoành tráng.</p>`,
        tip: "Tập nói to một lần trước buổi phỏng vấn. Đây thường là câu quyết định."
      }
    ],
    quiz: [
      {
        q: "Ước lượng bị lệch so với hạn bàn giao. Thời điểm nên báo là khi nào?",
        options: [
          "Khi đã trễ hạn",
          "Ngay khi thấy phụ thuộc hoặc độ phức tạp khiến hạn cũ không còn đúng",
          "Chỉ báo nếu lead hỏi"
        ],
        correct: 1,
        explain: "Middle chủ động báo rủi ro tiến độ sớm để còn phương án cắt phạm vi hoặc thêm người."
      }
    ]
  }
);
