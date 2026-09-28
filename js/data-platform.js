MODULES.push(
  {
    id: "rest",
    group: "API",
    title: "Thiết kế RESTful API",
    level: "Trung cấp",
    summary: "Middle phải thiết kế hợp đồng API để frontend, đơn vị tích hợp và biên bản nghiệm thu cùng đọc được. Đặt tên, mã HTTP, phân trang, idempotency và version là phần hay bị đào.",
    theory: [
      {
        h: "Hợp đồng API ổn",
        html: `<ul>
          <li>Danh từ số nhiều cho tài nguyên: <code>/ho-so</code>, động từ để HTTP method diễn tả.</li>
          <li>GET an toàn và không đổi dữ liệu. POST tạo. PUT thay cả bản. PATCH sửa một phần. DELETE xóa — với hồ sơ nhà nước thường là khóa hoặc hủy, không xóa vật lý.</li>
          <li>Mã trạng thái đúng nghĩa. Lỗi một format, có mã nghiệp vụ để QA đối chiếu test case.</li>
          <li>Phân trang bắt buộc trên danh sách. Không trả 50.000 dòng.</li>
          <li>Lọc, sắp xếp có whitelist cột, tránh client truyền tên cột thô vào SQL.</li>
          <li>Idempotency-Key cho POST dễ bị gửi lại: nộp hồ sơ, ký duyệt, gọi cổng thanh toán.</li>
          <li>Version khi có đối tác ngoài: <code>/v1</code> hoặc header. Đổi field phá người gọi cũ thì tăng version.</li>
        </ul>`
      },
      {
        h: "Đồng bộ và bất đồng bộ",
        html: `<p>Việc xong trong vài trăm mili giây và người dùng cần kết quả ngay thì API đồng bộ. Việc gọi nhiều hệ thống, xuất file, gửi hàng loạt thì nhận request, trả 202 kèm mã tác vụ, xử lý qua queue, client hỏi trạng thái hoặc nhận callback. Phải nói rõ cho BA: “nút bấm không có nghĩa là liên thông đã xong”.</p>`
      }
    ],
    questions: [
      {
        level: "Cơ bản",
        q: "PUT khác PATCH thế nào?",
        html: `<p>PUT gửi biểu diễn đầy đủ, phần không gửi có thể bị hiểu là xóa. PATCH chỉ gửi field đổi. Với form hồ sơ nhiều mục, em dùng PATCH để tránh client cũ ghi đè field mới về null. Cả hai nên idempotent: gọi lại cùng nội dung không tạo thêm bản ghi.</p>`,
        tip: "Nhắc validate field được phép sửa theo trạng thái hồ sơ."
      },
      {
        level: "Trung cấp",
        q: "Bạn phân trang kiểu offset hay cursor?",
        html: `<p>Offset đơn giản, đúng với màn hình quản trị có số trang. Dữ liệu lớn và hay chèn mới thì offset chậm và trùng hoặc mất dòng khi sang trang. Cursor theo id hoặc thời gian ổn định hơn cho feed và đồng bộ. Báo cáo nhà nước thường có lọc và số trang, em dùng offset kèm chỉ mục đúng điều kiện lọc, và giới hạn kích thước trang.</p>`,
        tip: "Nói bạn cấm page size do client tự đặt lên hàng nghìn."
      },
      {
        level: "Trung cấp",
        q: "Idempotency là gì? Cho ví dụ nộp hồ sơ.",
        html: `<p>Gọi lại cùng một ý định thì kết quả như gọi một lần. Người dùng bấm nộp hai lần hoặc timeout rồi retry. Em nhận header Idempotency-Key, lưu key cùng kết quả trong Redis hoặc bảng, unique theo key. Lần sau trả lại mã hồ sơ cũ, không tạo hai hồ sơ. Phía DB vẫn có unique constraint nghiệp vụ phòng khi key hết hạn.</p>`,
        tip: "Phân biệt idempotent với 'server không bao giờ lỗi'."
      },
      {
        level: "Nâng cao",
        q: "Khi nào bạn không dùng REST mà dùng sự kiện?",
        html: `<p>Khi nhiều bên cần biết “hồ sơ đã duyệt” và bên gửi không cần biết danh sách bên nhận. REST kéo theo nối trực tiếp và timeout dây chuyền. Event qua broker giúp thêm bên tiêu thụ mới, ví dụ thống kê, mà không sửa service duyệt. Đổi lại phải chấp nhận trễ, message trùng và theo dõi được message chết.</p>`,
        tip: "Một câu: API vẫn là cửa cho người dùng; event là cửa giữa các service."
      }
    ],
    quiz: [
      {
        q: "POST nộp hồ sơ bị timeout và client gửi lại. Cách nào chặn tạo hai hồ sơ?",
        options: [
          "Chỉ hiển thị thông báo 'mời đợi'",
          "Idempotency-Key cộng unique constraint nghiệp vụ",
          "Đổi POST thành GET"
        ],
        correct: 1,
        explain: "Khóa ý định phía API và ràng buộc dữ liệu phía DB, không dựa vào người dùng bấm một lần."
      }
    ]
  },
  {
    id: "auth",
    group: "API",
    title: "JWT, OAuth2 và RBAC",
    level: "Trung cấp",
    summary: "Hệ thống cơ quan nhà nước sống bằng phân quyền đúng đơn vị và dấu vết ai đã làm. Nắm chắc authentication khác authorization.",
    theory: [
      {
        h: "Ba khái niệm",
        html: `<ul>
          <li><strong>Authentication:</strong> bạn là ai. Đăng nhập, SSO, token.</li>
          <li><strong>Authorization:</strong> bạn được làm gì. Role, permission, phạm vi dữ liệu theo đơn vị.</li>
          <li><strong>Audit:</strong> bạn đã làm gì. Không thay thế phân quyền.</li>
        </ul>
        <p>RBAC: người dùng có vai trò, vai trò có quyền. Với khối nhà nước thường thêm phạm vi: cùng vai trò “chuyên viên” nhưng chỉ thấy hồ sơ của sở mình. Đó là data scope, không nhét hết vào một role tên rất dài.</p>`
      },
      {
        h: "JWT thực dụng",
        html: `<p>Access token sống ngắn, ký bằng khóa riêng, chứa subject, thời hạn, vai trò thô. Không nhét dữ liệu nhạy cảm vì token chỉ được ký, không mã hóa nội dung nếu là JWS. Refresh token lưu phía server để thu hồi được. Logout xóa refresh và đưa jti của access vào blacklist đến khi hết hạn, hoặc chấp nhận access sống rất ngắn.</p>
        <p>OAuth2 là ủy quyền. Authorization Code với PKCE cho ứng dụng web. Client credentials cho service gọi service. Resource server kiểm tra chữ ký và audience. Đừng tự bịa luồng password grant cho ứng dụng mới.</p>`
      }
    ],
    questions: [
      {
        level: "Cơ bản",
        q: "Session khác JWT ở điểm nào?",
        html: `<p>Session id là con trỏ, dữ liệu nằm trên server hoặc Redis, thu hồi ngay bằng cách xóa session. JWT mang claims và chữ ký, các instance API tự kiểm mà không gọi store — hợp khi nhiều pod. JWT khó thu hồi sớm. Em dùng access ngắn cộng refresh có lưu server. Hệ thống ít instance và cần cắt quyền tức thì thì session vẫn rất hợp lý.</p>`,
        tip: "Đừng nói JWT luôn bảo mật hơn session."
      },
      {
        level: "Trung cấp",
        q: "Bạn kiểm tra quyền ở đâu, chỉ ở gateway hay trong service?",
        html: `<p>Gateway chặn chưa đăng nhập và vài quyền thô. Service vẫn kiểm lại vì quyền và phạm vi dữ liệu đổi, và service có thể bị gọi nội bộ không qua gateway. Kiểm tra gồm: quyền chức năng và hồ sơ này có thuộc đơn vị của user không. Thiếu vế thứ hai là lỗi IDOR: đổi id trên URL là xem hồ sơ sở khác.</p>`,
        tip: "Nhắc test case QA: user A gọi id của user B phải 404 hoặc 403, không trả dữ liệu."
      },
      {
        level: "Trung cấp",
        q: "OAuth2 authorization code dùng khi nào?",
        html: `<p>Khi người dùng đăng nhập qua nhà cung cấp danh tính và ứng dụng của em không được thấy mật khẩu. User sang trang đăng nhập, quay lại kèm code, backend đổi code lấy token bằng client secret hoặc PKCE. SPA dùng PKCE, không giấu secret trong trình duyệt. Service không có user thì dùng client credentials.</p>`,
        tip: "Nếu họ nói VNeID hoặc SSO nội bộ, bạn map về cùng ý: mình là client, không giữ mật khẩu người dân."
      },
      {
        level: "Nâng cao",
        q: "Role trong JWT bị cũ vì admin vừa gỡ quyền thì sao?",
        html: `<p>Token vẫn còn quyền đến khi hết hạn. Em rút thời gian access xuống vài phút, và với thao tác nhạy cảm thì hỏi lại dịch vụ quyền hoặc phiên bản quyền trong Redis. Blacklist mọi token thì mất lợi thế stateless và dễ thành nút thắt. Em chọn kiểm tra lại trên các API ghi và duyệt, còn API đọc ít nhạy có thể tin claim trong thời gian ngắn.</p>`,
        tip: "Nói rõ đánh đổi độ trễ và độ tươi của quyền."
      }
    ],
    quiz: [
      {
        q: "User đổi id trên URL và xem được hồ sơ đơn vị khác. Đây là lỗi gì?",
        options: ["N+1 query", "IDOR, thiếu kiểm tra phạm vi dữ liệu", "JWT hết hạn"],
        correct: 1,
        explain: "Đã đăng nhập không có nghĩa được xem mọi id. Phải kiểm tra hồ sơ thuộc phạm vi của user."
      }
    ]
  },
  {
    id: "tx",
    group: "Xử lý",
    title: "Transaction, đồng thời, log và exception",
    level: "Trung cấp",
    summary: "Phần này tách người viết API chạy được với người giữ dữ liệu đúng khi hai cán bộ cùng bấm và khi service bên cạnh chết.",
    theory: [
      {
        h: "ACID ở mức nói được",
        html: `<ul>
          <li><strong>Atomicity:</strong> cả khối thành công hoặc không gì được giữ lại.</li>
          <li><strong>Consistency:</strong> ràng buộc vẫn đúng sau commit.</li>
          <li><strong>Isolation:</strong> giao dịch này không thấy dở dang của giao dịch kia theo mức cô lập.</li>
          <li><strong>Durability:</strong> commit xong là còn sau sự cố.</li>
        </ul>
        <p>Đừng gọi HTTP, chờ người dùng, hay gửi file trong lúc transaction đang mở. Giữ khóa lâu sẽ nghẽn cả bảng.</p>`
      },
      {
        h: "Mất cập nhật và khóa",
        html: `<p>Hai người đọc cùng hồ sơ trạng thái “chờ duyệt”, cùng ghi “đã duyệt”. Optimistic lock: cột version, update <code>where id=? and version=?</code>, 0 dòng thì báo người kia đã sửa, mời tải lại. Pessimistic lock khi xung đột rất dày và thao tác ngắn. Unique index chặn hai hồ sơ cùng số.</p>`
      },
      {
        h: "Log",
        html: `<p>Log có mức, có trace id xuyên suốt request và message. Không log mật khẩu, token, số giấy tờ đầy đủ. Lỗi nghiệp vụ dự kiến thì warn hoặc info có mã. Lỗi không lường thì error kèm stack ở server. Log tập trung để nhiều pod không phải SSH từng máy.</p>`
      }
    ],
    questions: [
      {
        level: "Cơ bản",
        q: "Vì sao không gọi API đối tác bên trong transaction DB?",
        html: `<p>Transaction giữ kết nối và có thể giữ khóa trong lúc chờ mạng. Đối tác chậm 10 giây là 10 giây chiếm pool. Pool cạn thì cả hệ thống đứng dù CPU còn rảnh. Em commit dữ liệu trạng thái “đang gửi”, gọi đối tác bên ngoài, rồi cập nhật kết quả trong transaction ngắn khác. Cần đúng tuyệt đối thì outbox.</p>`,
        tip: "Kèm triệu chứng: timeout hàng loạt, connection pool exhausted."
      },
      {
        level: "Trung cấp",
        q: "Optimistic lock hoạt động ra sao?",
        html: `<p>Đọc hồ sơ kèm version 3. Lúc ghi: <code>update ... set version=4 where id=1 and version=3</code>. Nếu người khác đã lên version 4, số dòng cập nhật bằng 0, em trả 409. Không khóa dòng lúc đọc nên người khác vẫn đọc được. Hợp khi xác suất đụng thấp, như duyệt hồ sơ. Nếu luôn đụng nhau, optimistic sẽ bắt user thử lại hoài.</p>`,
        tip: "Nhắc UI phải gửi lại version, không được tự tăng ở client mà server không kiểm."
      },
      {
        level: "Trung cấp",
        q: "Isolation Read Committed tránh được gì và còn lỗi gì?",
        html: `<p>Read Committed, mức hay gặp trên PostgreSQL, không đọc dữ liệu chưa commit của người khác, hết dirty read. Vẫn có thể non-repeatable read: đọc hai lần trong một transaction ra hai giá trị vì người khác đã commit ở giữa. Báo cáo cần một ảnh ổn thì dùng snapshot hoặc mức cao hơn, và chấp nhận chi phí. Đừng nâng isolation toàn hệ thống chỉ vì một báo cáo.</p>`,
        tip: "Nếu không nhớ tên hiện tượng, hãy mô tả bằng ví dụ hai lần đọc."
      },
      {
        level: "Nâng cao",
        q: "Saga khác 2PC thế nào?",
        html: `<p>2PC để nhiều database cùng commit, có khóa và điều phối, dễ nghẽn, ít dùng giữa các microservice qua mạng không tin cậy. Saga chia thành bước cục bộ, mỗi bước có hành động bù. Duyệt hồ sơ trừ ngân sách ở service khác thất bại thì gửi lệnh hoàn trạng thái. Dữ liệu có lúc trung gian, phải thiết kế trạng thái “đang xử lý” cho người dùng thấy. Bù cũng có thể thất bại nên cần retry và màn hình sự cố cho vận hành.</p>`,
        tip: "Nói thẳng: em không hứa ACID xuyên bốn service."
      },
      {
        level: "Trung cấp",
        q: "Exception bạn phân tầng thế nào?",
        html: `<p>Lỗi người dùng dự kiến được: mã nghiệp vụ, HTTP 4xx, không đầy stack ra client. Lỗi kỹ thuật: 5xx, log stack một lần với trace id, thông điệp chung cho client. Không nuốt exception bằng catch rỗng. Không dùng exception để điều khiển nhánh bình thường kiểu “hết trang”. Với message queue, lỗi tạm thời thì retry, lỗi dữ liệu hỏng thì đưa vào hàng đợi lỗi thay vì retry vô hạn.</p>`,
        tip: "Một câu về correlation id giúp QA gửi em đúng dòng log."
      }
    ],
    quiz: [
      {
        q: "Triệu chứng connection pool cạn sau khi đưa lời gọi HTTP vào transaction gợi ý điều gì?",
        options: [
          "Thiếu index",
          "Khóa và kết nối bị giữ trong lúc chờ mạng",
          "JWT ký sai thuật toán"
        ],
        correct: 1,
        explain: "Transaction ngắn. IO mạng nằm ngoài phạm vi giữ kết nối."
      }
    ]
  },
  {
    id: "sql",
    group: "Dữ liệu",
    title: "PostgreSQL, Oracle và tối ưu SQL",
    level: "Trung cấp",
    summary: "JD yêu cầu thiết kế được mô hình, viết query đúng chỉ mục, hiểu transaction và khóa. Oracle hay gặp ở hệ thống cũ của cơ quan; PostgreSQL hay gặp ở hệ thống mới.",
    theory: [
      {
        h: "Thiết kế quan hệ",
        html: `<ul>
          <li>Chuẩn hóa để khỏi sửa một sự thật ở nhiều nơi: cán bộ, đơn vị, hồ sơ tách bảng.</li>
          <li>Bảng lịch sử trạng thái thay vì một cột status bị ghi đè, phục vụ đối soát và nghiệm thu.</li>
          <li>Khóa ngoại cho dữ liệu cốt lõi. Có lúc nới ở bảng log để ghi được cả khi cha đã xóa, nhưng phải chủ đích.</li>
          <li>Soft delete với cột thời điểm hủy khi nghiệp vụ cấm xóa. Unique index phải tính cả bản đã hủy, nếu không không tạo lại được mã.</li>
          <li>Không dùng EAV cho mọi thứ nếu báo cáo lọc nhiều — query sẽ đau.</li>
        </ul>`
      },
      {
        h: "Index",
        html: `<p>Index giúp tìm và sắp xếp, nhưng làm chậm ghi và tốn chỗ. Đánh index theo điều kiện WHERE, JOIN và ORDER BY thật sự có. Cột độ chọn lọc thấp một mình, ví dụ cờ giới tính, ít ích. Index kết hợp để cột bên trái đúng thứ tự điều kiện. PostgreSQL có <code>EXPLAIN ANALYZE</code>. Seq scan trên bảng nhỏ là bình thường. Oracle dùng execution plan tương tự, khác cú pháp hint và cách đọc.</p>
        <p>Tránh <code>SELECT *</code> trên bảng rộng, tránh hàm bọc cột trong WHERE kiểu <code>WHERE upper(ma)=</code> vì mất index trừ khi có index trên biểu thức. Phân trang sâu bằng offset lớn sẽ vẫn phải đi qua các dòng bỏ đi.</p>`
      },
      {
        h: "Oracle so với PostgreSQL, phần phỏng vấn",
        html: `<p>Ý tưởng transaction, index, khóa, MVCC gần nhau đủ để chuyển dịch. Khác cú pháp: phân trang, hàm ngày, sequence, cách nối ngoài, gói PL/SQL so với function PostgreSQL. Em không giả vờ thuộc mọi hint Oracle. Em nói em đọc được plan, biết không khóa bảng khi migration giờ cao điểm, và script đổi schema có bản rollback hoặc bước tương thích tiến trước.</p>`
      }
    ],
    questions: [
      {
        level: "Cơ bản",
        q: "Bạn đặt index theo nguyên tắc nào?",
        html: `<p>Nhìn query chậm thật, không index mọi cột. Cột trong WHERE và JOIN có độ chọn lọc đáng kể thì xem xét. Khóa ngoại hay bị join cũng nên có index vì xóa cha sẽ kiểm tra con. Sau khi thêm, em xem plan còn seq scan lớn không và đo thời gian. Index thừa làm insert hồ sơ hàng loạt chậm.</p>`,
        tip: "Kể một query báo cáo bạn đã sửa bằng index đúng thứ tự cột lọc."
      },
      {
        level: "Trung cấp",
        q: "WHERE DATE(created_at) = '2026-09-01' vì sao dễ chậm?",
        html: `<p>Hàm bọc cột khiến engine không dùng index thường trên <code>created_at</code>. Em đổi thành khoảng: <code>created_at &gt;= '2026-09-01' and created_at &lt; '2026-09-02'</code>. Có múi giờ thì khoảng đó tính theo giờ của nghiệp vụ, không cắt nhầm hồ sơ lúc 23h.</p>`,
        tip: "Đây là câu rất hay gặp, trả lời dứt khoát."
      },
      {
        level: "Trung cấp",
        q: "Deadlock bạn gặp thì xử lý sao?",
        html: `<p>Hai transaction khóa hai dòng theo thứ tự ngược nhau, cùng chờ. DB giết một bên. Em thống nhất thứ tự khóa, rút ngắn transaction, bắt lỗi deadlock để thử lại ít lần. Log câu SQL và id liên quan. Không retry vô hạn.</p>`,
        tip: "Nói bạn xem được wait event hoặc log deadlock của PostgreSQL/Oracle ở mức cơ bản."
      },
      {
        level: "Nâng cao",
        q: "Migration cột trên bảng hàng chục triệu dòng thế nào?",
        html: `<p>Không khóa bảng lúc làm việc. Thêm cột nullable trước, deploy code ghi cả cột cũ và mới, backfill theo lô, rồi mới chuyển đọc sang cột mới và siết ràng buộc. Mỗi bước tương thích với bản code đang chạy vì deploy không tức thời trên mọi pod. Có số lượng thì em đo trên bản sao, không thử lần đầu trên production giờ hành chính.</p>`,
        tip: "Nếu chưa làm bảng lớn, nói đúng phạm vi bạn đã làm và nguyên tắc bạn sẽ giữ."
      },
      {
        level: "Trung cấp",
        q: "Toàn vẹn dữ liệu bạn giữ bằng những lớp nào?",
        html: `<p>Ràng buộc DB: not null, unique, khóa ngoại, check. Transaction cho một cụm ghi. Khóa lạc quan cho sửa đồng thời. Ứng dụng kiểm tra rule chưa biểu diễn được bằng constraint. Đối soát định kỳ cho dữ liệu đến từ hệ thống ngoài. Không tin mỗi validation ở giao diện.</p>`,
        tip: "Câu này hợp vị trí Gov vì họ sợ số liệu báo cáo lệch."
      }
    ],
    quiz: [
      {
        q: "Cách viết điều kiện ngày nào dễ dùng index trên created_at hơn?",
        options: [
          "WHERE DATE(created_at) = ngày",
          "WHERE created_at nằm trong nửa khoảng [đầu ngày, đầu ngày sau)",
          "WHERE to_char(created_at) = chuỗi ngày"
        ],
        correct: 1,
        explain: "Không bọc cột bằng hàm thì planner có thể tìm theo index."
      }
    ]
  },
  {
    id: "mongo-redis",
    group: "Dữ liệu",
    title: "MongoDB và Redis",
    level: "Trung cấp",
    summary: "Chọn đúng công cụ: quan hệ cho dữ liệu có ràng buộc và báo cáo; Mongo cho tài liệu linh hoạt; Redis cho cache, khóa phân tán và dữ liệu sống ngắn — không phải nguồn sự thật duy nhất.",
    theory: [
      {
        h: "MongoDB",
        html: `<p>Dữ liệu nằm trong document. Nhúng dữ liệu luôn đi cùng và không quá lớn, ví dụ địa chỉ trong hồ sơ. Tham chiếu khi dùng chung và hay đổi, ví dụ danh mục đơn vị. Index vẫn bắt buộc với điều kiện tìm. Transaction nhiều document có từ các bản mới nhưng đắt hơn một ghi đơn. Không chuyển hết PostgreSQL sang Mongo chỉ vì schema hay đổi — phần hay đổi có thể là một cột JSON trong Postgres.</p>`
      },
      {
        h: "Redis",
        html: `<ul>
          <li><strong>Cache-aside:</strong> đọc cache, trượt thì đọc DB và ghi cache có TTL.</li>
          <li><strong>Xóa cache khi ghi</strong> hoặc để TTL ngắn nếu dữ liệu chịu trễ. Cẩn thận cache stampede khi nhiều request cùng trượt.</li>
          <li><strong>Session và blacklist token</strong> đặt TTL đúng bằng hạn sống.</li>
          <li><strong>Khóa phân tán</strong> khi chỉ một pod được chạy job. Khóa phải có hạn, nếu không process chết sẽ giữ khóa mãi.</li>
          <li><strong>Rate limit</strong> theo cửa sổ thời gian.</li>
        </ul>
        <p>Redis mất điện có thể mất dữ liệu tùy cấu hình bền. Đừng để Redis là chỗ duy nhất ghi quyết định đã thu tiền hay đã duyệt.</p>`
      }
    ],
    questions: [
      {
        level: "Cơ bản",
        q: "Khi nào bạn chọn MongoDB thay vì PostgreSQL?",
        html: `<p>Khi mỗi bản ghi là một tài liệu ít quan hệ, schema các nguồn không đều, và cách đọc chủ yếu theo id hoặc một vài field tìm kiếm. Catalog sản phẩm, log sự kiện đã chuẩn hóa một phần. Hồ sơ có quan hệ đơn vị, người dùng, trạng thái và báo cáo join nhiều chiều thì em giữ PostgreSQL. Có thể dùng JSONB cho phần phụ lục linh hoạt.</p>`,
        tip: "Người phỏng vấn muốn thấy bạn không chọn theo trào lưu."
      },
      {
        level: "Trung cấp",
        q: "Cache-aside và rủi ro dữ liệu cũ.",
        html: `<p>App tự quản cache. Ghi DB thành công rồi xóa key. Đọc sau đó nạp lại. Vẫn có cửa sổ dữ liệu cũ nếu xóa cache thất bại — em retry xóa hoặc TTL ngắn làm lưới an toàn. Không cập nhật cache bằng giá trị tính từ trước lúc commit vì transaction có thể rollback. Với số liệu quyết định tiền hoặc quyền, em có thể không cache.</p>`,
        tip: "Nhắc khóa cache gồm tenant hoặc đơn vị, kẻo sổ A thấy dữ liệu sổ B."
      },
      {
        level: "Trung cấp",
        q: "Distributed lock bằng Redis cần lưu ý gì?",
        html: `<p>SET key giá trị ngẫu nhiên, có NX và TTL. Chỉ xóa nếu giá trị vẫn là của mình, tránh xóa khóa của process đến sau. TTL dài hơn thời gian job nhưng không vô hạn. Job phải chịu chạy trùng một lần nếu failover, vì khóa không phải giao dịch với DB. Nếu cần đúng hơn, em dựa vào unique job id trong DB.</p>`,
        tip: "Đừng nói SETNX không hạn là đủ an toàn."
      },
      {
        level: "Nâng cao",
        q: "Cache stampede là gì?",
        html: `<p>Key nóng hết hạn, hàng trăm request cùng thấy trượt và cùng đấm vào DB. Em giảm bằng TTL lệch nhau một chút, chỉ một request được nạp lại còn request kia chờ, hoặc lưu giá trị cũ thêm lúc đang làm mới. Với báo cáo nặng thì không để request người dùng kích hoạt tính lại đồng loạt.</p>`,
        tip: "Liên hệ giờ cao điểm đầu buổi làm việc của cán bộ."
      }
    ],
    quiz: [
      {
        q: "Redis phù hợp vai trò nào nhất trong hệ thống duyệt hồ sơ?",
        options: [
          "Nguồn duy nhất ghi quyết định đã duyệt",
          "Cache, session, khóa job, có TTL",
          "Thay khóa ngoại của PostgreSQL"
        ],
        correct: 1,
        explain: "Redis rất tốt cho dữ liệu nóng và ngắn hạn. Quyết định nghiệp vụ bền nằm ở database chính."
      }
    ]
  },
  {
    id: "broker",
    group: "Dữ liệu",
    title: "Kafka, NATS và xử lý message",
    level: "Nâng cao",
    summary: "JD nêu Kafka hoặc NATS. Bạn cần nói được producer, consumer, topic, ack, retry, message lỗi và vì sao consumer phải chịu message trùng.",
    theory: [
      {
        h: "Các khái niệm",
        html: `<ul>
          <li><strong>Queue:</strong> một message thường một consumer trong nhóm xử lý việc.</li>
          <li><strong>Topic và pub/sub:</strong> nhiều nhóm cùng nhận bản sao, ví dụ vừa gửi thông báo vừa ghi thống kê.</li>
          <li><strong>Producer</strong> gửi. <strong>Consumer</strong> nhận và xử lý.</li>
          <li><strong>Ack:</strong> báo đã xử lý xong để không giao lại. Ack trước khi xử lý xong thì mất việc khi process chết. Ack sau khi xong thì có thể nhận trùng.</li>
          <li><strong>Retry</strong> cho lỗi tạm: timeout, DB chớp nhoáng. Giới hạn số lần, có khoảng chờ tăng dần.</li>
          <li><strong>Dead letter:</strong> message sai dữ liệu hoặc hết lượt retry, để người vận hành xem, không chặn cả hàng.</li>
        </ul>`
      },
      {
        h: "Kafka và NATS, cách nói vừa sức",
        html: `<p>Kafka giữ log theo partition, consumer nhớ offset, hợp luồng sự kiện lớn, nhiều bên đọc lại. Thứ tự chỉ đảm bảo trong một partition — em chọn key, ví dụ mã hồ sơ, nếu các event của cùng hồ sơ cần đi tuần tự. NATS gọn, độ trễ thấp, phù hợp điều khiển và sự kiện nội bộ; JetStream thêm lưu và ack nếu cần bền hơn core NATS. Em không thuộc mọi tham số vận hành, nhưng em thiết kế consumer idempotent và quan sát được lag.</p>`
      }
    ],
    questions: [
      {
        level: "Cơ bản",
        q: "Vì sao consumer phải idempotent?",
        html: `<p>Broker có thể giao lại message sau timeout dù lần trước bạn đã ghi DB nhưng chưa kịp ack. Nếu mỗi lần nhận là tạo một dòng thông báo, người dân nhận trùng. Em dùng id sự kiện unique trong DB. Gặp lại id đã xử lý thì bỏ qua và vẫn ack.</p>`,
        tip: "Câu này gần như chắc chắn bị hỏi nếu bạn nói đã dùng queue."
      },
      {
        level: "Trung cấp",
        q: "Ack sớm và ack muộn khác gì?",
        html: `<p>Ack sớm: nhận là đánh dấu xong, process chết giữa chừng thì mất message. Ack muộn: xử lý và commit DB xong mới ack. Chết trước ack thì bị giao lại — an toàn hơn nếu việc xử lý lặp lại không gây hại. Em chọn ack muộn cộng idempotent.</p>`,
        tip: "Nói thêm poison message: một bản ghi hỏng không được retry mãi làm nghẽn partition."
      },
      {
        level: "Trung cấp",
        q: "Thứ tự message trong Kafka bạn giữ thế nào?",
        html: `<p>Trong một partition thì có thứ tự ghi. Nhiều partition thì không có thứ tự toàn cục. Em gắn key là mã hồ sơ để mọi event của hồ sơ đó vào cùng partition, consumer xử lý lần lượt event nộp rồi event duyệt. Tăng partition để nhanh hơn thì không được giả định thứ tự giữa hai hồ sơ, và cũng không giả định thứ tự toàn hệ thống.</p>`,
        tip: "Nếu họ hỏi NATS, nói thứ tự không phải mặc định của mọi hệ pub/sub, phải xem đúng chế độ bạn bật."
      },
      {
        level: "Nâng cao",
        q: "Outbox và consumer idempotent phối hợp ra sao?",
        html: `<p>Service nguồn ghi dữ liệu và dòng outbox trong một transaction, tiến trình gửi Kafka, có thể gửi trùng nếu ack từ Kafka mất. Consumer dùng id sự kiện để ghi đúng một lần. Như vậy không mất và không nhân đôi tác dụng. Em vẫn cần màn hình outbox kẹt và consumer lag để biết liên thông đang chậm, vì dự án nhà nước hay bị hỏi “vì sao bên kia chưa thấy hồ sơ”.</p>`,
        tip: "Vẽ ba hộp: DB nghiệp vụ, bảng outbox, consumer có unique event id."
      }
    ],
    quiz: [
      {
        q: "Message được giao lại sau khi bạn đã ghi DB. Thiết kế đúng là gì?",
        options: [
          "Tắt retry để khỏi trùng",
          "Xử lý idempotent theo id sự kiện rồi mới ack",
          "Ack ngay khi vừa nhận để broker nhẹ việc"
        ],
        correct: 1,
        explain: "Retry là cần cho lỗi tạm. Idempotent khiến lần giao lại không tạo tác dụng thứ hai."
      }
    ]
  }
);
