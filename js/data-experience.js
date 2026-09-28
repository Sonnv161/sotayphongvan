MODULES.unshift({
  id: "kinh-nghiem",
  group: "Kinh nghiệm của bạn",
  title: "Kinh nghiệm thực tế để kể",
  level: "Trung cấp",
  summary: "Các bài nói theo CV của Nguyễn Văn Sơn: dịch vụ công xuất nhập cảnh, LGSP, job nền, đối soát và hệ thống hạ tầng giao thông. Chỉ kể chi tiết bạn đã làm. Chỗ ghi gợi ý là cách triển khai câu, hãy sửa lại cho khớp việc thật.",
  theory: [
    {
      h: "Cách dùng mục này",
      html: `<p>Mỗi dự án có bản nói khoảng 90 giây, rồi phần đào sâu. Tập nói to một lần. Người phỏng vấn Middle muốn nghe việc của bạn, quyết định kỹ thuật, và một lần sự cố hoặc một lần giữ dữ liệu đúng.</p>
      <p>Không đọc số điện thoại, không mô tả sơ đồ mạng nội bộ, không đưa dữ liệu thật của người dân, không nói mật khẩu hay đường kết nối. Nói vai trò, luồng dữ liệu và cách xử lý khi lệch hoặc khi kênh bị kẹt.</p>
      <div class="tip"><strong>Câu mở 20 giây.</strong> Em là backend, từ 2023 làm ở GTEL ICT trên hệ thống dịch vụ công và nền tảng tích hợp LGSP, chủ yếu Java, Tibco BusinessWorks, Oracle và PostgreSQL. Trước đó em làm firmware công nghiệp. Gần đây em làm thêm hệ thống quản lý kết cấu hạ tầng giao thông bằng Spring Boot và PostgreSQL.</div>`
    },
    {
      h: "90 giây — Dịch vụ công xuất nhập cảnh",
      html: `<p><strong>Bối cảnh.</strong> Nâng cấp ứng dụng để đáp ứng cổng dịch vụ công quốc gia mức độ 3 và 4, cho Cục Quản lý xuất nhập cảnh. Hệ thống nói chuyện với cổng dịch vụ công của Bộ Công an và với Bộ tư lệnh Bộ đội Biên phòng.</p>
      <p><strong>Việc của em.</strong> Em phụ trách luồng đồng bộ dữ liệu bảo mật giữa vùng trong và vùng ngoài qua Data Diode, nghĩa là dữ liệu đi một chiều, không mở đường mạng hai chiều giữa hai vùng. Em xây và vận hành các kênh truyền nhận, theo dõi kênh có kẹt không, và xử lý sự cố khi liên thông liên ngành bị dừng.</p>
      <p><strong>Điểm kỹ thuật để nói.</strong> Bên gửi ghi nhận đã đưa vào kênh. Bên nhận xử lý theo mã bản tin. Cùng một mã gửi lại thì không tạo thêm bản ghi. Có trạng thái đang gửi, đã nhận, lỗi, để người vận hành biết hồ sơ đang nằm ở đâu. Log theo mã hồ sơ và mã kênh, không log nội dung giấy tờ.</p>
      <div class="tip"><strong>Nếu họ hỏi sự cố.</strong> Kênh dừng hoặc bên kia chưa thấy dữ liệu. Em khoanh: bản tin đã vào kênh chưa, bên nhận đã trả trạng thái chưa, đang nằm ở hàng lỗi hay đang chờ. Gửi lại đúng mã cũ để khỏi nhân đôi. Sau đó mới tìm vì sao lần đó bị coi là thành công trong khi bên kia chưa ghi.</div>`
    },
    {
      h: "90 giây — LGSP và tích hợp liên thông",
      html: `<p><strong>Bối cảnh.</strong> Nền tảng tích hợp dữ liệu LGSP tại Cục Công nghệ thông tin. Nhiều module nghiệp vụ dùng chung cách kết nối, không phải mỗi việc một kiểu gọi.</p>
      <p><strong>Việc của em.</strong> Em nghiên cứu framework sẵn của hệ thống để viết module, phối hợp frontend lần lỗi nghiệp vụ, và làm luồng đồng bộ tệp giữa vùng trong và vùng ngoài qua Diode. Em cũng làm adapter kết nối LGSP để khai thác dữ liệu dân cư, với xác thực, mã hóa và kiểm soát ai được gọi.</p>
      <p><strong>Điểm kỹ thuật để nói.</strong> Adapter là lớp bọc: bên trong hệ thống chỉ thấy một interface, bên ngoài là hợp đồng của LGSP. Timeout, mã lỗi và chữ ký nằm trong adapter. Dữ liệu lớn thì xử lý theo lô, có mốc để chạy tiếp, không tải cả tập vào bộ nhớ. Quyền kiểm tra ở service, không chỉ tin cổng ngoài đã cho đi qua.</p>
      <div class="tip"><strong>Câu đào sâu hay gặp.</strong> Làm sao biết đồng bộ tệp bị thiếu? Em đối theo mã tệp và số lượng ở hai đầu, không so bằng mắt. Thiếu thì gửi lại đúng mã. Thừa thì tìm lần xử lý không idempotent.</div>`
    },
    {
      h: "90 giây — Job nền, sân bay và đối soát",
      html: `<p>Trên CV, các việc này nằm ở khối tích hợp: background service và schedule job trên Tibco cho tác vụ nặng, đồng bộ từ trung tâm xuất nhập cảnh ra các sân bay, và nhận giao dịch từ Vietcombank để đối soát.</p>
      <p><strong>Cách kể job.</strong> Việc nặng không nằm trong request của người dùng. Job lấy một lô, ghi mốc đã xử lý, lỗi từng bản thì vào danh sách lỗi chứ không làm dừng cả lô. Job phải chạy lại được. Trên nhiều instance thì chỉ một nơi giữ khóa, hoặc mỗi bản tin có khóa duy nhất trong DB.</p>
      <p><strong>Cách kể sân bay.</strong> Trung tâm là nguồn. Sân bay là nơi cần bản cập nhật. Em quan tâm thứ tự và đủ dữ liệu: một hồ sơ không được áp dụng trạng thái cũ đè trạng thái mới, và lần đồng bộ lỗi phải chạy tiếp từ mốc, không làm lại từ đầu nếu đã áp dụng rồi.</p>
      <p><strong>Cách kể Vietcombank.</strong> Mỗi giao dịch có mã riêng. Nhận lại cùng mã thì không cộng tiền thêm lần nữa. Đối soát là so số tiền và số món giữa hai phía, lấy vài mã lệch để đi từ đầu tới cuối, rồi mới sửa chỗ gây lệch. Không sửa số dư bằng tay nếu chưa có đối chiếu.</p>
      <div class="tip"><strong>Chỉ nói tên ngân hàng và tên sân bay nếu họ hỏi phạm vi tích hợp.</strong> Không mô tả định dạng file nội bộ, tài khoản kết nối, hay cách ký.</div>`
    },
    {
      h: "90 giây — Hạ tầng giao thông bằng Spring Boot",
      html: `<p><strong>Bối cảnh.</strong> Hệ thống quản lý và số hóa kết cấu hạ tầng giao thông, từ tháng 12/2025 đến tháng 08/2026. Java, Spring Boot, PostgreSQL, REST. Việc chính là vòng đời dữ liệu tài sản hạ tầng, biến động, báo cáo.</p>
      <p><strong>Việc của em.</strong> Em thiết kế API cho vòng đời dữ liệu, chuẩn một format phản hồi dùng chung để frontend đỡ lệch từng màn, và ngồi với BA để chốt phân đoạn hạ tầng cùng luồng giao thông. Em refactor và tối ưu SQL khi danh sách và báo cáo nặng.</p>
      <p><strong>Điểm kỹ thuật để nói.</strong> Một format lỗi và một format danh sách có phân trang. Không trả cả bảng. Câu báo cáo lọc theo khoảng thời gian và đơn vị quản lý, index theo đúng điều kiện đó. Đếm sau khi join một-nhiều thì đếm distinct, kẻo số tài sản bị nhân theo số lần biến động.</p>
      <div class="tip"><strong>Nếu họ hỏi con số.</strong> Chỉ nói thời gian query trước và sau nếu bạn còn nhớ. Không bịa phần trăm. Nói được câu lệnh nào chậm và index nào thêm là đủ.</div>`
    },
    {
      h: "Nếu họ hỏi giai đoạn firmware",
      html: `<p>Từ 02/2022 đến 01/2023 em làm kỹ sư nhúng tại Gia Khang, C/C++ trên STM32 và ESP32, PLC, Modbus, UART, SPI. Hệ thống điều khiển và giám sát công nghiệp.</p>
      <p>Câu nối sang backend: em quen thiết bị và giao thức không được mất gói, phải có timeout và phải biết gói gửi lại. Sang hệ thống doanh nghiệp thì cùng nguyên tắc đó với kênh đồng bộ và job: ack, thử lại, không xử lý hai lần. Em chuyển sang backend từ 2023 và từ đó làm Java, Tibco, Oracle, PostgreSQL, rồi Spring Boot.</p>`
    },
    {
      h: "Thứ tự kể khi họ bảo hãy vẽ hệ thống",
      html: `<ol>
        <li>Ai dùng: cán bộ trên cổng dịch vụ công, đơn vị liên thông, hoặc người quản lý tài sản hạ tầng.</li>
        <li>Cửa vào: API hoặc kênh tích hợp, có xác thực.</li>
        <li>Phần em giữ: module nghiệp vụ, adapter, job đồng bộ.</li>
        <li>Dữ liệu nằm ở Oracle hoặc PostgreSQL. Trạng thái hiện tại một bảng, lịch sử thay đổi một bảng.</li>
        <li>Vùng trong và vùng ngoài ngăn bằng Diode, dữ liệu đi một chiều.</li>
        <li>Một sự cố em đã khoanh được bằng mã hồ sơ và trạng thái kênh.</li>
      </ol>
      <p>Dừng ở biên việc của em. Phần chữ ký số hoặc vận hành cụm nếu đội khác giữ thì nói thẳng là em gọi qua adapter, không vẽ thay họ.</p>`
    }
  ],
  questions: [
    {
      level: "Cơ bản",
      q: "Hãy giới thiệu bản thân theo CV này.",
      html: `<p>Em là Nguyễn Văn Sơn, backend. Em học điện điện tử tại Học viện Công nghệ Bưu chính Viễn thông, làm firmware khoảng một năm, rồi từ giữa 2023 làm backend tại GTEL ICT. Em tham gia hệ thống dịch vụ công xuất nhập cảnh và nền tảng LGSP: API, đồng bộ qua Data Diode, job nền, tích hợp liên ngành trên Oracle và PostgreSQL, công cụ chính là Java và Tibco BusinessWorks. Em cũng làm hệ thống quản lý kết cấu hạ tầng giao thông bằng Spring Boot, từ thiết kế API đến tối ưu SQL. Em quen làm với BA và frontend, và quen đọc log để xử lý sự cố trên môi trường đang chạy.</p>`,
      tip: "Khoảng 60–90 giây. Kết bằng việc bạn muốn làm tiếp: backend dịch vụ dùng chung, tích hợp, hệ thống cần dữ liệu đúng."
    },
    {
      level: "Trung cấp",
      q: "Kể một việc khó trên hệ thống dịch vụ công.",
      html: `<p>Khó nhất là đồng bộ giữa vùng trong và vùng ngoài qua Diode, vì không gọi API hai chiều như hệ thống thường. Em phải thiết kế theo kênh: bên gửi đưa bản tin có mã, bên nhận áp dụng đúng một lần, có trạng thái để biết đang chờ, xong hay lỗi. Khi liên thông với Biên phòng hoặc cổng dịch vụ công bị kẹt, em không sửa dữ liệu tay ngay. Em lấy một mã hồ sơ, xem nó dừng ở khâu nào, gửi lại đúng mã nếu bên kia thiếu, và chỉ kết luận sau khi hai đầu khớp số lượng.</p>`,
      tip: "Giữ ở mức luồng và trạng thái. Không vẽ thiết bị, dải địa chỉ hay tên máy."
    },
    {
      level: "Trung cấp",
      q: "Job đồng bộ ra sân bay làm sao khỏi ghi đè dữ liệu mới bằng dữ liệu cũ?",
      html: `<p>Mỗi bản cập nhật có mã hồ sơ và mốc thời gian hoặc số phiên bản. Bên nhận chỉ áp dụng nếu mốc mới hơn mốc đang lưu. Bản gửi lại do timeout thì cùng mã, cùng mốc, nên bỏ qua sau khi đã áp dụng. Job ghi mốc lô đã xong để lần sau chạy tiếp. Nếu một sân bay nghỉ rồi bật lại, em chạy từ mốc còn thiếu chứ không đẩy lại toàn bộ lịch sử nếu các mốc đó đã được xác nhận.</p>`,
      tip: "Nếu thực tế bạn dùng số thứ tự bản tin thay vì thời gian, hãy nói đúng thứ bạn dùng. Đừng trộn cả hai nếu hệ thống chỉ có một."
    },
    {
      level: "Trung cấp",
      q: "Đối soát giao dịch Vietcombank bạn nói thế nào?",
      html: `<p>Em nhận giao dịch để đối soát, không để mỗi lần nhận file là cộng thêm một khoản. Khóa là mã giao dịch. Đã có thì cập nhật trạng thái đối soát hoặc bỏ qua, không tạo dòng tiền thứ hai. Cuối kỳ so số món và số tiền. Lệch thì lấy vài mã, đi từ bản nhận, qua bản đã ghi, tới trạng thái nghiệp vụ. Chỗ hay lệch là timeout bị hiểu nhầm thành chưa nhận nên xử lý lại, hoặc một giao dịch đảo mà chưa có chiều hoàn.</p>`,
      tip: "Nhấn mạnh tính đúng của tiền trước khi nói đến hiệu năng."
    },
    {
      level: "Trung cấp",
      q: "Ở dự án hạ tầng giao thông, API dùng chung giúp gì?",
      html: `<p>Frontend có nhiều màn danh sách và form biến động. Nếu mỗi API một kiểu lỗi và một kiểu phân trang thì tích hợp chậm và dễ sót. Em chốt format: dữ liệu, mã lỗi, thông điệp, phân trang. Vòng đời tài sản đi qua API có trạng thái rõ, không sửa cột trạng thái từ nhiều chỗ. Câu thống kê em viết theo khoảng ngày và đơn vị quản lý, xem plan, thêm index đúng thứ tự lọc, và đếm distinct khi phải join sang bảng biến động.</p>`,
      tip: "Kể một màn hình cụ thể nếu bạn nhớ tên: danh sách tài sản, lịch sử biến động, hoặc báo cáo theo đơn vị."
    },
    {
      level: "Nâng cao",
      q: "Họ hỏi: bạn xử lý sự cố production từ đầu tới cuối ra sao?",
      html: `<p>Em lấy thời điểm, mã hồ sơ hoặc mã giao dịch, và kênh nào. Xem đúng bản vừa đưa lên chưa. Đọc log theo mã đó. Tách việc: một bản tin lỗi hay cả kênh dừng, một sân bay hay mọi điểm, một câu SQL chậm hay đối tác timeout. Nếu bản mới gây lỗi diện rộng thì lùi bản đã biết là ổn, rồi sửa có test. Sau khi thông luồng, em ghi lại vì sao lần đó không phát hiện sớm, ví dụ thiếu trạng thái trung gian hoặc thiếu đối soát số lượng.</p>`,
      tip: "Chọn một sự cố thật trước buổi phỏng vấn. Cấu trúc này chỉ là khung."
    }
  ],
  quiz: [
    {
      q: "Khi cùng một bản tin đồng bộ được gửi lại, cách xử lý đúng là gì?",
      options: [
        "Tạo thêm một hồ sơ nữa cho chắc",
        "Nhận theo mã bản tin và không áp dụng lần thứ hai",
        "Xóa dữ liệu bên nhận rồi nhập lại từ đầu"
      ],
      correct: 1,
      explain: "Kênh một chiều và job chạy lại đều có thể giao trùng. Mã bản tin phải giúp lần sau thành thao tác rỗng."
    },
    {
      q: "Đối soát giao dịch ngân hàng cần khóa duy nhất theo gì?",
      options: [
        "Theo giờ nhận file",
        "Theo mã giao dịch",
        "Theo tên người import"
      ],
      correct: 1,
      explain: "Cùng một giao dịch có thể xuất hiện lại. Mã giao dịch giúp không ghi nhận tiền hai lần."
    }
  ]
});
