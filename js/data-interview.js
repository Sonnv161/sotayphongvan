(function () {
  function mod(id) {
    return MODULES.find((item) => item.id === id);
  }
  function talk(id, theories, questions) {
    const target = mod(id);
    if (theories) target.theory.unshift(...theories);
    target.questions.push(...questions);
  }

  talk("java", null, [
    {
      level: "Trung cấp",
      q: "Hãy kể HashMap làm gì khi put một khóa.",
      html: `<p>Em tính hash của khóa để chọn ô. Trong ô, em so equals để biết khóa đã có chưa. Có rồi thì thay value. Chưa có thì thêm. Nếu hai khóa khác nhau mà cùng ô, đó là đụng độ, map vẫn đúng nhưng phải đi thêm vài phần tử. Từ Java 8, ô quá đông có thể thành cây để đỡ chậm khi hash kém.</p>
      <p>Vì tìm ô bằng hash rồi mới so equals, hai method phải đi cùng nhau. Khóa phải bất biến. Sửa field đang dùng để tính hash sau khi đã put thì lần get sau không thấy.</p>
      <p>Map này không dành cho nhiều luồng cùng ghi. Job đồng bộ dùng chung một map đếm trong bộ nhớ thì em chuyển sang ConcurrentHashMap, hoặc tốt hơn là để DB giữ mã đã xử lý vì có thể có hơn một process.</p>`,
      tip: "Nếu họ hỏi null: HashMap cho một khóa null. ConcurrentHashMap thì không."
    },
    {
      level: "Trung cấp",
      q: "equals theo id của entity JPA sai ở đâu?",
      html: `<p>Lúc mới new, id còn null. Hai hồ sơ mới cùng chưa có id sẽ bị coi là bằng nhau nếu equals chỉ nhìn id, rồi Set nuốt mất một phần tử. Sau khi save, id được gán, hash đổi, object biến mất khỏi HashSet đã chứa nó từ trước.</p>
      <p>Em không dùng field hay đổi như trạng thái để tính hash. Với hồ sơ đã có mã nghiệp vụ ổn định, em equals theo mã đó. Với entity chỉ có id tự tăng, em chấp nhận equals theo id nhưng không nhét entity mới vào Set trước khi persist.</p>
      <p>Trong dự án đồng bộ, em không dựa vào equals của entity để chống ghi trùng. Em để unique constraint trên mã bản tin. Bộ nhớ mà sai còn cứu được bằng DB. DB không có khóa thì job chạy lại sẽ nhân đôi.</p>`,
      tip: "Đừng nói em luôn dùng id. Nói rõ lúc id còn null thì hợp đồng equals vỡ."
    },
    {
      level: "Trung cấp",
      q: "try-with-resources liên quan gì tới sự cố cạn connection?",
      html: `<p>Connection, statement và result set đều phải đóng. Quên đóng thì connection không về pool. Một lúc sau request mới chờ mãi dù CPU còn rảnh. try-with-resources đóng dù trong khối có return hay ném lỗi, miễn đối tượng implement AutoCloseable.</p>
      <p>Em vẫn không giữ connection lâu. Đóng đúng chưa đủ nếu transaction bao cả lúc gọi mạng. Pool cạn theo hai kiểu: rò vì không đóng, hoặc giữ quá lâu vì transaction dài.</p>
      <p>Khi xem sự cố, em nhìn số connection đang active và thread đang chờ pool. Active dính ở một câu SQL thì là query hoặc khóa. Active nhiều mà không có SQL đang chạy thì là đang chờ mạng trong lúc chưa nhả connection.</p>`,
      tip: "Kể được một triệu chứng: timeout hàng loạt, log pool exhausted."
    },
    {
      level: "Nâng cao",
      q: "ThreadLocal có thể làm lẫn quyền người dùng thế nào?",
      html: `<p>ThreadLocal gắn dữ liệu theo luồng. Pool Tomcat dùng lại đúng luồng đó cho request sau. Nếu request trước để user trong ThreadLocal mà không xóa, request sau đọc phải user cũ và có thể thấy dữ liệu đơn vị khác.</p>
      <p>Em xóa trong finally, hoặc dùng cơ chế của framework đã được dọn ở cuối request và không tự nhét thêm. Test thì gọi hai request liên tiếp trên cùng luồng giả lập, request sau không còn principal của request trước.</p>
      <p>Job nền cũng vậy. Worker trong pool xử lý hồ sơ của đơn vị A xong phải bỏ context trước khi nhận hồ sơ đơn vị B. Đây là lỗi bảo mật, không chỉ lỗi chức năng, vì nó không hiện mỗi lần.</p>`,
      tip: "Nếu họ hỏi volatile, đừng lẫn. ThreadLocal là kho theo luồng, không phải cờ chia sẻ."
    },
    {
      level: "Nâng cao",
      q: "Bạn đặt timeout cho CompletableFuture khi gọi hai kênh thế nào?",
      html: `<p>Em không để join chờ vô hạn. Mỗi cuộc gọi có timeout riêng. Hết giờ thì coi kênh đó lỗi, không giữ thread của người gọi. Pool em truyền vào là pool riêng của tích hợp, không dùng pool chung của JVM, vì một kênh chậm sẽ chiếm chỗ của việc khác.</p>
      <p>Timeout ở phía mình không có nghĩa bên kia đã dừng. Bản tin có thể tới sau. Bên nhận phải nhận theo mã và không áp dụng lần hai. Future hủy không thay được idempotent.</p>
      <p>Hai kênh độc lập thì em chạy song song rồi ghép kết quả. Nếu bước sau phụ thuộc bước trước, hoặc cả hai phải cùng commit một transaction, em không tách future. Em đi tuần tự trong một transaction ngắn, việc chờ mạng để ngoài.</p>`,
      tip: "Nhắc lấy cause từ CompletionException, đừng chỉ log mỗi dòng wrapper."
    }
  ]);

  talk("spring", null, [
    {
      level: "Cơ bản",
      q: "Ứng dụng khởi động xong nhưng gọi API thì thiếu bean. Bạn kiểm tra gì?",
      html: `<p>Em xem lớp main có đứng trên package của service không. Spring chỉ quét từ package của lớp gắn SpringBootApplication trở xuống. Lớp main nằm ở nhánh con thì các service ở package cha không thành bean, tới lúc gọi mới vỡ.</p>
      <p>Em xem interface có được triển khai và có stereotype hoặc được khai báo bằng Bean không. Inject nhầm một kiểu có hai implementation mà không có Qualifier thì ứng dụng không lên được. Trường hợp lên được nhưng sai bean thì em đặt tên và qualifier cho rõ.</p>
      <p>Em không sửa bằng cách new service trong controller. New là mất transaction, mất proxy, và test không thay được phụ thuộc. Thiếu bean thì sửa biên quét hoặc cấu hình, rồi khởi động lại để lỗi hiện ngay lúc start.</p>`,
      tip: "Một câu về constructor injection: thiếu phụ thuộc thì ứng dụng không khởi động, không chờ tới request mới null."
    },
    {
      level: "Trung cấp",
      q: "Open-in-view đang giúp gì và đang giấu gì?",
      html: `<p>Spring Boot mặc định giữ session JPA tới hết request. Vì vậy ra khỏi service vẫn chạm được quan hệ lazy, API đỡ vỡ. Đổi lại connection bị giữ tới khi trả hết JSON, và N+1 xảy ra ở tầng trả dữ liệu nên service tưởng mình chỉ có một câu SQL.</p>
      <p>Em tắt trên hệ thống nhiều người dùng. Service tải đúng thứ API cần, bằng join fetch hoặc DTO. Sau đó session đóng, controller chỉ còn dữ liệu đã phẳng. Lazy lỗi lúc đó là tín hiệu thiếu tải, không phải lý do để bật lại open-in-view.</p>
      <p>Trong dự án danh sách hồ sơ hoặc tài sản, em bật log SQL, mở một trang 20 dòng và đếm số câu. Nếu thấy một câu cha rồi nhiều câu con, em sửa query trước khi tăng pool.</p>`,
      tip: "Đừng nói open-in-view là sai tuyệt đối. Nói em biết nó giấu N+1 và giữ connection."
    },
    {
      level: "Trung cấp",
      q: "Vì sao không trả entity JPA thẳng ra API?",
      html: `<p>Entity có cột nội bộ, quan hệ lazy và field người gọi không được sửa. Trả thẳng sẽ lộ dữ liệu, vỡ khi session đóng, và client có thể gửi ngược một field họ không được phép đổi. Jackson lần theo quan hệ thì dễ thành vòng lặp hoặc thành một đống query.</p>
      <p>Em tách request DTO và response DTO. Request chỉ chứa field được nhập. Response chỉ chứa field màn hình cần. Map ở service sau khi rule đã chạy xong. Đổi bảng không bắt frontend vỡ nếu DTO giữ nguyên hợp đồng.</p>
      <p>Ở hệ thống hạ tầng giao thông em làm, format phản hồi dùng chung cũng vì lý do này: nhiều màn cùng một kiểu dữ liệu và một kiểu lỗi, đỡ mỗi API một dạng.</p>`,
      tip: "Nếu họ hỏi hiệu năng, thêm một câu: DTO còn giúp khỏi kéo cả graph."
    },
    {
      level: "Nâng cao",
      q: "CascadeType.ALL trên quan hệ tới danh mục thì sao?",
      html: `<p>ALL gồm cả remove. Xóa một hồ sơ có thể kéo theo xóa đơn vị hoặc danh mục đang dùng chung. Đó là mất dữ liệu hàng loạt, không phải cascade tiện tay. Em chỉ cascade persist hoặc merge sang dòng con thực sự thuộc hồ sơ, ví dụ các mục chi tiết không sống một mình.</p>
      <p>orphanRemoval em bật khi gỡ dòng chi tiết khỏi hồ sơ là muốn xóa dòng đó. Em không bật cho quan hệ nhiều hồ sơ trỏ cùng một danh mục. Khóa ngoại phía DB em để restrict với đơn vị, để người xóa nhầm bị chặn thay vì xóa sạch con.</p>
      <p>Em nói với người phỏng vấn rằng tính tiện của CascadeType.ALL không đáng so với một lần xóa nhầm trên dữ liệu đã nghiệm thu.</p>`,
      tip: "Nhắc khác biệt ngắn: cascade remove là xóa cha thì xóa con. orphanRemoval là gỡ khỏi collection thì xóa con."
    },
    {
      level: "Nâng cao",
      q: "ddl-auto và @Scheduled trên hai node, bạn xử lý ra sao?",
      html: `<p>ddl-auto update hoặc create trên UAT và production là để Hibernate tự sửa bảng. Em không dùng. Schema đi bằng script đã review, ứng dụng chỉ validate hoặc tắt tự sửa. Lý do: đổi cột lúc khởi động không có bước tương thích, dễ khóa bảng giờ làm việc, và không ai duyệt câu lệnh đó.</p>
      <p>Scheduled mặc định có thể nổ trên mọi node. synchronized không xuyên được hai JVM. Em để mã nghiệp vụ unique trong DB để lần chạy thứ hai không ghi đôi, và nếu chỉ một node được lấy việc thì dùng khóa có hạn. Job sân bay hoặc job nhận giao dịch của em đều phải chạy lại được dù lịch bị bắn hai lần.</p>
      <p>Hai việc này cùng một nguyên tắc: không tin một process sẽ là process duy nhất, và không để framework tự quyết định dữ liệu production.</p>`,
      tip: "Tách hai ý rõ. Họ có thể chỉ hỏi một trong hai."
    }
  ]);

  talk("sql", null, [
    {
      level: "Cơ bản",
      q: "Hãy kể thứ tự một câu báo cáo đếm hồ sơ theo đơn vị.",
      html: `<p>Em viết SELECT nhưng em đọc theo thứ tự máy chạy. FROM và JOIN lấy hồ sơ với đơn vị. WHERE bỏ hồ sơ ngoài tháng và hồ sơ đã hủy, trước khi gom. GROUP BY gom theo đơn vị. HAVING bỏ nhóm không đủ số lượng nếu nghiệp vụ yêu cầu. SELECT lúc này mới tính count. ORDER BY xếp tên đơn vị sau cùng.</p>
      <p>Vì WHERE chạy trước SELECT, em không lọc bằng alias của count. Điều kiện trên bảng bên phải của LEFT JOIN em để trong ON, nếu không đơn vị không có hồ sơ sẽ mất. Đếm sau join sang bảng biến động thì em count distinct id hồ sơ, không count sao.</p>
      <p>Em dùng khoảng ngày nửa mở, từ mùng 1 đến trước mùng 1 tháng sau, để khỏi bọc cột bằng hàm và khỏi sót giờ của ngày cuối. Đây là câu em đối chiếu được với BA khi số nghiệm thu lệch.</p>`,
      tip: "Nói chậm từng mệnh đề. Họ thường chặn ở WHERE và HAVING."
    },
    {
      level: "Trung cấp",
      q: "Oracle DATE và PostgreSQL date khác nhau chỗ nào khi làm báo cáo?",
      html: `<p>PostgreSQL date là ngày lịch, không có giờ. timestamp mới có giờ. Oracle DATE gồm cả giờ phút giây. Người viết WHERE ngay = một ngày trên Oracle có thể mất các hồ sơ không rơi đúng nửa đêm.</p>
      <p>Em lọc bằng khoảng: lớn hơn hoặc bằng đầu ngày, nhỏ hơn đầu ngày hôm sau. Cách này dùng được trên cả hai hệ và còn đi index. Em không cắt ngày bằng hàm bọc cột trừ khi đã có index trên đúng biểu thức đó.</p>
      <p>Cột ngày nộp trên biểu mẫu em coi là ngày nghiệp vụ. Cột lúc bấm duyệt em coi là mốc thời gian. Trộn hai cột trong một điều kiện sẽ lệch hồ sơ quanh nửa đêm, nhất là khi máy chủ để UTC còn nghiệp vụ tính theo giờ Việt Nam.</p>`,
      tip: "Một câu này đủ để họ thấy bạn đã chạm cả hai database trên CV."
    },
    {
      level: "Trung cấp",
      q: "Soft delete thì unique mã hồ sơ phải đặt thế nào?",
      html: `<p>Nếu unique trên mọi dòng, hồ sơ đã hủy vẫn chiếm mã, không tạo lại được. Nếu bỏ unique, hai hồ sơ đang sống trùng mã. Em dùng unique một phần: chỉ các dòng chưa hủy. PostgreSQL làm bằng index WHERE da_huy = false. Oracle em dùng index function hoặc cột mã hiệu lực, tùy bản đang chạy, nhưng ý giống nhau.</p>
      <p>Hủy là cập nhật cờ và người hủy, thời điểm hủy, không DELETE. Khóa ngoại và lịch sử vẫn trỏ được bản cũ. Báo cáo đang hiệu lực thì lọc chưa hủy. Báo cáo đối soát thì vẫn thấy bản đã hủy.</p>
      <p>Em không tin mỗi điều kiện WHERE ở ứng dụng. Hai request tạo cùng lúc vẫn cần unique ở DB.</p>`,
      tip: "Nếu bạn chưa đặt partial index trên dự án, nói đúng mức: em biết phải để ràng buộc ở DB và sẽ hỏi DBA cú pháp của đúng bản Oracle đang dùng."
    },
    {
      level: "Trung cấp",
      q: "Bạn đọc EXPLAIN từ đâu?",
      html: `<p>Em không đọc từ trên xuống cho có. Em tìm nút đắt: seq scan trên bảng lớn, sort không có index, hoặc join ra số dòng phình. Rồi em đối chiếu WHERE, JOIN và ORDER BY với index hiện có. Số dòng ước lượng lệch xa số dòng thật thì em nghi thống kê cũ hoặc điều kiện không như mình tưởng.</p>
      <p>EXPLAIN chưa chạy câu. EXPLAIN ANALYZE chạy thật. Em không ANALYZE một câu cập nhật nặng trên production giờ làm việc. Seq scan bảng nhỏ thì em để yên. Thêm index chỉ sau khi thấy nút đó đắt và câu đó chạy thường.</p>
      <p>Trên cả Oracle và PostgreSQL em đều tìm được plan, khác cú pháp. Em không thuộc hint. Em thuộc việc đọc nút nào đang tốn thời gian.</p>`,
      tip: "Kể một câu danh sách hoặc báo cáo bạn đã xem plan, dù chỉ nhớ là nó đang seq scan."
    },
    {
      level: "Nâng cao",
      q: "SELECT FOR UPDATE bạn dùng lúc nào, và lúc nào không?",
      html: `<p>Em dùng khi thao tác ngắn kiểu đọc trạng thái rồi cập nhật ngay, và hai người không được cùng quyết định. Khóa giữ tới commit nên em không gọi mạng bên trong. SKIP LOCKED em dùng cho hàng đợi việc trong DB, mỗi worker lấy dòng chưa ai giữ. Em không dùng SKIP LOCKED cho màn hình cán bộ đang mở đúng một hồ sơ, vì bỏ qua là họ không thấy việc của mình.</p>
      <p>Xác suất đụng thấp, như duyệt hồ sơ, em dùng cột version. Hết đụng thì không ai phải chờ khóa. Hết version thì báo tải lại. FOR UPDATE em dành cho chỗ tranh chấp dày hoặc cần giữ đúng dòng trong vài câu liên tiếp.</p>
      <p>Job đồng bộ của em thường không cần khóa cả hồ sơ bên nguồn. Em cần mã bản tin unique bên nhận để chạy lại không ghi đè sai và không nhân đôi.</p>`,
      tip: "Phân biệt chờ khóa với mất cập nhật. Hai chuyện khác nhau."
    }
  ]);

  talk("rest", [
    {
      h: "Bài nói — Thiết kế một API để trả lời miệng",
      html: `<p>Em mở bằng tài nguyên và việc của người dùng, không mở bằng annotation. Ví dụ tạo hồ sơ: POST vào danh sách hồ sơ, body là dữ liệu được phép nhập, trả về mã hồ sơ và trạng thái ban đầu. Danh sách là GET có phân trang và lọc theo đơn vị. Sửa một phần là PATCH. Hủy không phải xóa vật lý.</p>
      <p>Lỗi một format: mã, thông điệp, field sai, trace id. 400 dữ liệu sai, 401 chưa đăng nhập, 403 không đủ quyền, 404 hoặc 403 khi id không thuộc phạm vi, 409 khi trạng thái đã đổi. Không trả stack.</p>
      <p>Việc có thể bị gửi lại thì có khóa idempotency hoặc unique mã nghiệp vụ. Việc dài thì trả mã tác vụ và xử lý nền, không giữ request đến khi liên thông xong. Em đã làm format dùng chung trên hệ thống hạ tầng để frontend không mỗi màn một kiểu.</p>`
    }
  ], [
    {
      level: "Trung cấp",
      q: "Hãy thiết kế API nộp hồ sơ trong hai phút.",
      html: `<p>POST /ho-so, body gồm các field nghiệp vụ được nhập, không gồm trạng thái nội bộ. Server tự đặt trạng thái chờ và sinh mã. Trả 201 cùng mã và đường dẫn chi tiết. Gửi lại cùng khóa idempotency thì trả lại đúng hồ sơ đã tạo, không tạo hồ sơ thứ hai. DB vẫn unique theo mã nghiệp vụ phòng khi khóa hết hạn.</p>
      <p>GET chi tiết kiểm tra cả quyền lẫn đơn vị. Đổi id trên URL không được thấy hồ sơ đơn vị khác. PATCH chỉ nhận field được sửa ở đúng trạng thái. Hủy là PATCH trạng thái hoặc POST hành động hủy, có lý do, có người hủy, không DELETE cứng.</p>
      <p>Nếu nộp xong phải sang hệ thống khác, em không hứa liên thông đã xong trong response của POST. Em trả trạng thái đã tiếp nhận, job hoặc kênh đẩy đi sau, client xem được trạng thái đồng bộ.</p>`,
      tip: "Nói chậm từng mã HTTP. Họ hay hỏi tiếp 409 và idempotency."
    },
    {
      level: "Trung cấp",
      q: "Đối tác cũ còn gọi API trong lúc bạn phải thêm field bắt buộc. Bạn làm gì?",
      html: `<p>Em không đổi hợp đồng cũ thành bắt buộc ngay. Field mới em thêm dạng không phá người gọi cũ: có mặc định, hoặc chỉ bắt buộc trên phiên bản mới. Đối tác bên ngoài em tách /v1 và /v2, hoặc giữ v1 một thời gian đã ghi trong biên bản.</p>
      <p>Em ghi rõ field nào thêm, mã lỗi nào mới, để QA và đơn vị tích hợp đối chiếu. Bản lên UAT là đúng bản sẽ nghiệm thu, không sửa lén response sau khi họ đã ký kịch bản test.</p>
      <p>Trong nội bộ, nếu chỉ có một frontend cùng nhịp phát hành, em vẫn giữ format lỗi cũ và thêm field tùy chọn trước. Bắt buộc sau khi màn hình mới đã đi cùng.</p>`,
      tip: "Nhấn mạnh hợp đồng API là tài liệu nghiệm thu, không chỉ là code."
    },
    {
      level: "Nâng cao",
      q: "API đồng bộ qua kênh một chiều khác API REST thông thường chỗ nào?",
      html: `<p>REST thông thường có response ngay. Kênh một chiều như Diode không có lời trả tức thì trên cùng kết nối. Em không kết luận thành công chỉ vì đã đưa vào kênh. Em có mã bản tin, trạng thái đã gửi, đã nhận, lỗi, và một việc đối soát số lượng hai đầu.</p>
      <p>Timeout không được hiểu là chưa gửi, cũng không được hiểu là đã xong. Nó là không rõ, phải hỏi lại theo mã. Gửi lại dùng đúng mã cũ. Bên nhận áp dụng một lần.</p>
      <p>Người dùng trên màn hình phải thấy trạng thái đang đồng bộ, không thấy nút bấm xong là liên thông đã xong. Đây là chỗ em giải thích với BA trước khi làm, để khỏi nghiệm thu theo kỳ vọng sai.</p>`,
      tip: "Đây là cầu nối giữa kiến thức REST và việc làm ở GTEL. Nói bằng trạng thái, không nói bằng thiết bị."
    }
  ]);

  talk("auth", [
    {
      h: "Bài nói — Đăng nhập, quyền và phạm vi dữ liệu",
      html: `<p>Em tách ba việc. Authentication là biết bạn là ai. Authorization là bạn được làm thao tác nào. Phạm vi dữ liệu là bạn được thấy hồ sơ của đơn vị nào. Role trong token chỉ là phần thô. API ghi và API xem chi tiết vẫn kiểm tra lại hồ sơ đó có thuộc phạm vi không.</p>
      <p>Access token sống ngắn. Refresh token lưu phía server để thu hồi được. Logout thì bỏ refresh và không tin access đã phát nếu thao tác nhạy cảm, hoặc để access hết hạn rất nhanh. Không nhét số giấy tờ vào token vì phần nội dung token đọc được nếu chỉ ký chứ không mã hóa.</p>
      <p>Mật khẩu chỉ lưu dạng băm một chiều. API không dùng cookie phiên thì CSRF không phải mối chính. Mối chính là token lộ và thiếu kiểm tra id trên URL.</p>`
    }
  ], [
    {
      level: "Trung cấp",
      q: "User đơn vị A gọi id hồ sơ của đơn vị B. Bạn chặn ở đâu?",
      html: `<p>Gateway chỉ biết họ đã đăng nhập và có role xem hồ sơ. Nó không biết hồ sơ 15 thuộc đơn vị nào nếu không đọc DB. Em kiểm tra trong service: tải hồ sơ, so đơn vị hoặc cây đơn vị với phạm vi của user. Không thuộc thì trả 403 hoặc 404, không trả thân hồ sơ.</p>
      <p>Em test bằng hai tài khoản, không test bằng một tài khoản admin. Case này gọi là IDOR. Nó qua được nếu chỉ kiểm tra JWT hợp lệ.</p>
      <p>Quyền vừa bị gỡ thì token còn sống có thể vẫn mang role cũ. Với API duyệt và API xem dữ liệu nhạy cảm, em hỏi lại quyền hoặc phiên bản quyền, không chỉ tin claim đến hết hạn token.</p>`,
      tip: "Nói một câu test case để QA viết được: user A gọi id của user B."
    },
    {
      level: "Trung cấp",
      q: "JWT và session, hệ thống nhiều node bạn chọn thế nào?",
      html: `<p>Nhiều node mà session nằm trong RAM của một node thì request sau sang node khác sẽ mất đăng nhập, trừ khi có sticky session hoặc session nằm ở Redis. JWT để mỗi node tự kiểm chữ ký, không cần kho session cho access token. Đổi lại muốn cắt quyền ngay thì phải access ngắn hoặc một kho thu hồi.</p>
      <p>Em không nói JWT bảo mật hơn. Em nói JWT hợp API không trạng thái. Hệ cần đá người dùng lập tức và số node ít thì session ở Redis rất rõ ràng. Refresh token của em vẫn lưu server để logout thật sự có tác dụng.</p>
      <p>Khóa ký không để trong Git và không để trong image. Mỗi môi trường một khóa. Lệch khóa giữa các node thì node này nhận token, node kia từ chối.</p>`,
      tip: "Nếu họ hỏi thuật toán, nói em dùng thuật toán bất đối xứng hoặc HMAC theo chuẩn đội, và em từ chối thuật toán none."
    },
    {
      level: "Nâng cao",
      q: "OAuth2 authorization code khác client credentials chỗ nào?",
      html: `<p>Authorization code là lúc có người dùng. Họ đăng nhập ở nhà cung cấp danh tính, ứng dụng của em không thấy mật khẩu. Ứng dụng nhận code rồi đổi lấy token phía server. Ứng dụng công khai trên trình duyệt thì dùng PKCE, không giấu secret trong JavaScript.</p>
      <p>Client credentials là service gọi service, không có người bấm đăng nhập. Mỗi bên có định danh client và được cấp đúng phạm vi API, không dùng chung một tài khoản admin.</p>
      <p>Adapter LGSP hoặc cổng dịch vụ công của em nằm ở kiểu này: người dân đăng nhập ở cổng, còn kênh giữa các hệ thống là định danh dịch vụ, có kiểm tra chữ ký và phạm vi. Em không tự bịa luồng gửi thẳng mật khẩu người dùng cho API của mình.</p>`,
      tip: "Đừng kể tên thư viện. Kể ai giữ mật khẩu và token nào được phép gọi API nào."
    }
  ]);
})();
