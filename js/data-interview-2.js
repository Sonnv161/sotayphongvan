(function () {
  function mod(id) {
    return MODULES.find((item) => item.id === id);
  }
  function talk(id, theories, questions) {
    const target = mod(id);
    if (theories) target.theory.unshift(...theories);
    target.questions.push(...questions);
  }

  talk("tx", [
    {
      h: "Bài nói — Giữ dữ liệu đúng khi có hai người và một kênh ngoài",
      html: `<p>Em bắt đầu bằng biên của transaction: những ghi nào phải cùng sống hoặc cùng mất. Đổi trạng thái hồ sơ và ghi lịch sử là một transaction. Gọi mạng, chờ file, gửi thông báo thì nằm ngoài.</p>
      <p>Hai người sửa cùng hồ sơ thì em dùng version. Người đến sau cập nhật không được dòng nào thì trả 409, mời tải lại. Read Committed vẫn cho phép đọc hai lần ra hai giá trị nếu người kia đã commit ở giữa. Báo cáo cần ảnh đứng yên thì em không nâng isolation cả hệ thống, em cô lập riêng câu báo cáo.</p>
      <p>Kênh ngoài không tham gia transaction DB. Em ghi trạng thái đang gửi, gửi xong cập nhật bằng transaction ngắn khác. Cần không mất sự kiện thì ghi bảng outbox cùng transaction với hồ sơ, tiến trình khác gửi đi. Bên nhận chống trùng bằng mã bản tin.</p>`
    }
  ], [
    {
      level: "Trung cấp",
      q: "Hai cán bộ cùng bấm duyệt. Hãy kể từng bước.",
      html: `<p>Cả hai đọc hồ sơ version 3, trạng thái chờ. Người thứ nhất cập nhật where id và version bằng 3, đưa version lên 4, commit. Người thứ hai chạy cùng điều kiện thì số dòng bằng 0. Em trả 409, không ghi đè thành trạng thái của người thứ hai.</p>
      <p>Nếu không có version, mức Read Committed vẫn cho người thứ hai ghi đè. Đó là mất cập nhật, không phải dirty read. Dirty read là đọc dữ liệu chưa commit, Read Committed đã chặn việc đó.</p>
      <p>Lịch sử duyệt em ghi cùng transaction với lần đổi trạng thái. Không có chuyện đã duyệt mà không còn dòng lịch sử. Em không khóa FOR UPDATE nếu thao tác chỉ là một lần cập nhật có version, vì khóa giữ người kia chờ trong khi version đã đủ để từ chối êm.</p>`,
      tip: "Vẽ hai dòng thời gian. Họ rất hay hỏi tiếp isolation."
    },
    {
      level: "Trung cấp",
      q: "Outbox khác việc vừa commit DB vừa gọi HTTP thế nào?",
      html: `<p>Gọi HTTP trong lúc transaction đang mở thì vừa giữ connection vừa không chắc phía kia đã nhận. Commit rồi mới gọi thì chết giữa chừng sẽ mất việc gửi. Gọi trước rồi mới commit thì phía kia đã nhận trong khi DB rollback.</p>
      <p>Outbox ghi dòng cần gửi vào cùng transaction với dữ liệu nghiệp vụ. Một tiến trình đọc bảng đó, gửi, đánh dấu đã gửi. Chết sau khi gửi nhưng trước khi đánh dấu thì gửi lại. Vì vậy bên nhận phải nhận một mã hai lần mà không tạo hai hồ sơ.</p>
      <p>Em dùng ý này cho kênh đồng bộ: đã ghi nhận trong DB là việc phải đi, không phụ thuộc một lời gọi HTTP nằm trong transaction. Màn hình vận hành phải thấy dòng đang kẹt, vì dự án liên thông hay bị hỏi vì sao bên kia chưa có hồ sơ.</p>`,
      tip: "Đừng kể outbox nếu họ chỉ hỏi rollback. Trả lời đúng câu đang hỏi rồi mới nối."
    },
    {
      level: "Nâng cao",
      q: "Saga bạn nói ở mức Middle thế nào, không biến thành bài giảng?",
      html: `<p>Em không hứa một transaction xuyên nhiều database qua mạng. Mỗi service commit việc của mình. Bước sau thất bại thì có hành động bù: hoàn trạng thái, ghi nợ đối soát, hoặc đưa vào hàng cần người xử lý. Người dùng thấy trạng thái đang xử lý, không thấy dữ liệu nhảy thẳng từ đầu đến cuối.</p>
      <p>Bù cũng có thể thất bại nên phải chạy lại được và phải có màn hình sự cố. Em không dùng 2PC cho kênh liên thông. Khóa hai pha giữ tài nguyên quá lâu và phía ngoài không tham gia được.</p>
      <p>Ví dụ em kể được: tiếp nhận hồ sơ đã commit, đẩy sang đơn vị kia thất bại, hồ sơ không bị xóa, trạng thái chuyển thành chờ gửi lại. Khi kênh sống, gửi đúng mã cũ.</p>`,
      tip: "Một ví dụ trạng thái là đủ. Không liệt kê hết tên pattern."
    }
  ]);

  talk("micro", [
    {
      h: "Bài nói — Kiến trúc nhiều phần, nói đúng tầm việc bạn đã làm",
      html: `<p>Em không nhận mình đã thiết kế cả nền tảng vi dịch vụ nếu việc thật là module, adapter và kênh đồng bộ. Em nói: hệ thống gồm nhiều phần triển khai và tích hợp với nhau, em giữ module nghiệp vụ, API, job và adapter. Phần em không giữ thì em nói tên biên, ví dụ chữ ký số hoặc vận hành cụm.</p>
      <p>Gọi đồng bộ khi cán bộ cần câu trả lời ngay và chuỗi gọi ngắn, có timeout. Việc sang vùng khác, sang sân bay, sang ngân hàng là bất đồng bộ: có trạng thái, có chạy lại, có đối soát. Em không cho service này đọc bảng của service kia. Đổi cột bên kia sẽ làm bên em vỡ lúc chạy.</p>
      <p>Cổng liên thông chết thì em ngắt nhanh, không để mọi request chờ hết timeout. Chức năng nội bộ còn chạy. Trạng thái liên thông để chờ gửi lại. Thêm máy không cứu được nếu nút thắt là một câu SQL hoặc một khóa giữ quá lâu.</p>`
    }
  ], [
    {
      level: "Trung cấp",
      q: "Khi nào bạn không tách microservice?",
      html: `<p>Em không tách chỉ vì mỗi bảng một service. Cùng một đội, cùng một kỳ phát hành, transaction phải đi cùng nhau, thì em giữ một ứng dụng có biên module rõ. Tách khi cần đưa lên riêng, scale riêng, hoặc bên khác được phép trễ vài phút.</p>
      <p>Tách sớm thì em phải gánh mã bản tin, trạng thái trung gian, log rải và phiên bản API trong khi chưa có lợi. Hệ thống dịch vụ công của em có nhiều kênh tích hợp, nhưng không có nghĩa mỗi kênh là một cơ sở dữ liệu riêng do em sở hữu.</p>
      <p>Nếu họ hỏi em sẽ làm gì ở hệ thống mới, em trả lời theo biên nghiệp vụ và theo chỗ nào được phép không nhất quán tức thì, không trả lời theo số lượng framework.</p>`,
      tip: "Thái độ này hợp Middle hơn là vẽ mười service cho một bài CRUD."
    },
    {
      level: "Trung cấp",
      q: "Timeout dây chuyền là gì? Bạn cắt ở đâu?",
      html: `<p>Cổng chờ service A 30 giây, A chờ B 30 giây, B chờ đối tác 30 giây. Một phía chết làm cả chuỗi giữ luồng. Pool đầy, những chức năng không liên quan cũng chậm.</p>
      <p>Em đặt timeout phía trong ngắn hơn phía ngoài, để A kịp trả lỗi có kiểm soát trước khi cổng cắt. Đối tác đã chết thì circuit breaker mở, các request sau thất bại nhanh hoặc đi phương án chờ gửi lại, không xếp hàng 30 giây nữa. Retry có trần và có khoảng chờ, không để mọi node cùng bắn lại ngay lúc đối tác vừa sống.</p>
      <p>Em nhìn được request bằng một mã truy vết xuyên cổng và service. Không có công cụ trace thì ít nhất header mã đó có trong log từng chặng.</p>`,
      tip: "Gắn vào một lần kênh liên thông chậm thật nếu bạn nhớ triệu chứng, không cần nhớ mili-giây."
    },
    {
      level: "Nâng cao",
      q: "Dữ liệu bên sân bay chậm hơn trung tâm một nhịp. Bạn có coi là lỗi không?",
      html: `<p>Không phải lỗi ngay nếu nghiệp vụ chấp nhận trễ và màn hình nói rõ đang đồng bộ. Là lỗi nếu người dùng được hứa là đã xong, hoặc nếu bản cũ đè bản mới.</p>
      <p>Em thiết kế mốc trên từng hồ sơ. Bên nhận chỉ áp dụng mốc mới hơn. Lệch số lượng thì đối theo mã, không đối bằng cách đếm tổng rồi kết luận. Thiếu thì gửi lại đúng mã. Thừa thì tìm lần xử lý không idempotent.</p>
      <p>Em không cho sân bay sửa thẳng bảng trung tâm để cho nhanh. Hai bên lệch schema là vỡ im. Họ hỏi API hoặc nhận bản tin, và chịu bản sao chậm hơn nguồn một nhịp.</p>`,
      tip: "Câu này phân biệt người đã làm liên thông với người chỉ học microservice."
    }
  ]);

  talk("broker", [
    {
      h: "Bài nói — Nếu họ hỏi Kafka trong khi bạn đã làm kênh đồng bộ",
      html: `<p>Em nói thẳng phần nào em đã vận hành. Em đã làm kênh truyền bản tin, job nền và đồng bộ lại khi lỗi, trên Tibco và các luồng liên thông. Em chưa lấy tên Kafka nếu dự án không dùng Kafka. Em map khái niệm để họ thấy em hiểu việc, không hiểu mỗi từ.</p>
      <p>Producer là bên đưa bản tin. Consumer là bên áp dụng. Ack muộn cộng với xử lý theo mã thì chạy lại không bị mất và không bị đôi. Bản tin hỏng không được thử lại mãi làm kẹt cả hàng. Thứ tự em chỉ hứa trong một hồ sơ, bằng cách các sự kiện của hồ sơ đó đi cùng một lối, không hứa thứ tự toàn hệ thống.</p>
      <p>Outbox là cách em không mất bản tin khi DB đã commit mà tiến trình gửi chết giữa chừng. Bên nhận vẫn chuẩn bị nhận trùng.</p>`
    }
  ], [
    {
      level: "Trung cấp",
      q: "At-least-once nghĩa là gì với người nhận?",
      html: `<p>Hệ thống hứa cố gửi đến khi bên nhận xác nhận, nên bản tin có thể tới hai lần nếu xác nhận bị mất. Em không thiết kế người nhận theo kiểu tới một lần là chắc. Em lưu mã sự kiện đã áp dụng. Lần sau thấy mã đó thì bỏ qua và vẫn xác nhận, để hàng không bị gửi lại mãi.</p>
      <p>Xác nhận trước khi ghi DB thì process chết sẽ mất việc. Em xác nhận sau khi ghi xong. Bản tin sai dữ liệu thì không xác nhận để rồi nhận lại vô hạn. Em đưa sang hàng lỗi sau một số lần, và để người vận hành xem.</p>
      <p>Việc đồng bộ sân bay và việc nhận giao dịch của em cùng mẫu này, dù kênh không mang tên Kafka. Em kể bằng mã bản tin và trạng thái, rồi mới nói tên công nghệ nếu họ hỏi đúng cái dự án đã dùng.</p>`,
      tip: "Đừng mở đầu bằng tôi thành thạo Kafka nếu CV không có Kafka."
    },
    {
      level: "Nâng cao",
      q: "Làm sao một hồ sơ không bị áp dụng duyệt trước khi áp dụng tiếp nhận?",
      html: `<p>Em không cần thứ tự toàn bộ hệ thống. Em cần thứ tự của một hồ sơ. Trên Kafka, em gắn key là mã hồ sơ để các sự kiện của hồ sơ đó vào cùng partition và được đọc lần lượt. Trên kênh khác, em mang số thứ tự hoặc mốc thời gian nghiệp vụ, bên nhận từ chối mốc cũ hơn mốc đang lưu.</p>
      <p>Tăng số luồng xử lý mà không giữ cùng khóa thì hai sự kiện của một hồ sơ có thể song song. Lúc đó em xử lý trong DB bằng version hoặc bằng ràng buộc trạng thái: không duyệt nếu chưa ở trạng thái đã tiếp nhận.</p>
      <p>DB vẫn là chốt cuối. Thứ tự trên hàng đợi giúp ít bất ngờ, không thay được rule chuyển trạng thái.</p>`,
      tip: "Nói cả hai lớp: hàng đợi và ràng buộc trạng thái trong DB."
    }
  ]);

  talk("mongo-redis", [
    {
      h: "Bài nói — Redis và Mongo, nói đúng việc đã dùng",
      html: `<p>CV của em là Oracle và PostgreSQL. Em không gắn Redis hoặc Mongo vào dự án nếu em chưa triển khai. Em trả lời phần nguyên tắc vì vị trí Middle vẫn hỏi.</p>
      <p>PostgreSQL giữ hồ sơ, ràng buộc, báo cáo. Mongo em chỉ chọn khi từng bản ghi là tài liệu ít quan hệ và cách đọc chủ yếu theo một khóa. Phần form linh hoạt em có thể để JSON trong Postgres trước khi tách Mongo.</p>
      <p>Redis em dùng cho cache, phiên, khóa job có hạn, không dùng làm nơi duy nhất ghi đã duyệt hay đã thu tiền. Cache trượt thì đọc DB. Ghi DB xong thì xóa key. Khóa cache có đơn vị để khỏi lẫn dữ liệu. Khóa phân tán phải có hạn và job vẫn phải idempotent.</p>`
    }
  ], [
    {
      level: "Trung cấp",
      q: "Chống ghi trùng bạn để ở Redis hay ở DB?",
      html: `<p>Em để ở DB bằng unique mã bản tin. Redis hết hạn, restart, hoặc hai lời gọi cùng lúc vẫn có cửa sổ cả hai đều thấy chưa có khóa. Unique trong transaction là chốt. Redis em dùng để giảm tải hoặc để một job biết node khác đang chạy, không dùng để quyết định đã cộng tiền hay chưa.</p>
      <p>Khóa Redis nếu có thì phải có TTL và chỉ xóa đúng giá trị của mình. Process chết không được giữ khóa mãi. Hết hạn rồi hai node cùng chạy thì DB vẫn chặn lần ghi thứ hai.</p>
      <p>Em nói rõ trên dự án đồng bộ em đã làm, chốt là cơ sở dữ liệu quan hệ. Redis là cách em sẽ thêm khi có nhiều node và cần giảm đọc lặp, không phải nơi chứa sự thật.</p>`,
      tip: "Câu này cứu bạn khỏi bị hỏi sâu một công cụ không có trên CV mà vẫn tỏ ra hiểu rủi ro."
    },
    {
      level: "Trung cấp",
      q: "Cache danh mục đơn vị thì để TTL bao lâu và lúc sửa thì sao?",
      html: `<p>Danh mục ít đổi thì TTL vài phút là đủ, và khi màn hình sửa danh mục thành công em xóa key. TTL là lưới khi lệnh xóa cache thất bại. Em không cache quyền duyệt hoặc số dư. Những thứ đó đọc từ DB hoặc cache rất ngắn có kiểm tra lại.</p>
      <p>Key có mã đơn vị hoặc mã hệ thống. Một key chung cho mọi đơn vị là lỗi lộ dữ liệu. Nhiều request cùng thấy key hết hạn thì em không để tất cả cùng đấm một câu SQL nặng. Một request nạp, request kia chờ hoặc dùng bản cũ thêm một nhịp.</p>
      <p>Em đo trước khi cache. Danh sách đã có index và chỉ 20 dòng thì chưa cần Redis. Báo cáo nhóm theo tháng, chạy đi chạy lại, mới đáng cache.</p>`,
      tip: "Nhắc cache stampede bằng giờ đầu buổi cán bộ cùng mở một báo cáo."
    }
  ]);

  talk("k8s", [
    {
      h: "Bài nói — Kubernetes ở mức đọc được sự cố, không kể như đã quản trị cụm",
      html: `<p>Em nói đúng kinh nghiệm vận hành của mình: sự cố kênh, job và SQL trên môi trường đang chạy, làm việc trên Linux. Phần Kubernetes em nắm để triển khai và để đọc khi UAT bảo pod chết, không nhận mình đã quản trị cụm nếu việc đó là của đội khác.</p>
      <p>Image là bản đóng gói. Pod là lần chạy, có thể chết. Deployment giữ số pod và đổi bản. Service là địa chỉ ổn định vì IP pod đổi. ConfigMap là cấu hình thường. Secret là mật khẩu, không commit, không đóng vào image. Ingress là cửa HTTP. Readiness là chưa sẵn sàng thì đừng nhận request. Liveness là process kẹt cứng thì mới khởi động lại.</p>
      <p>Ứng dụng nhiều pod thì không giữ phiên trong RAM, không ghi file cục bộ rồi mong request sau vào đúng pod, và pool DB nhân với số pod không được vượt quá DB chịu được. Job lịch phải chịu chạy trùng.</p>`
    }
  ], [
    {
      level: "Trung cấp",
      q: "UAT báo service chết. Bạn xem những gì trước?",
      html: `<p>Em lấy thời điểm và mã hồ sơ QA đang bấm. Xem pod có đang chạy không, có bị kéo lại liên tục không, sự kiện có báo thiếu secret hoặc thiếu cấu hình không. Rồi em đọc log của đúng bản vừa triển khai, tìm mã đó.</p>
      <p>Pod sống nhưng API 500 thì là lỗi ứng dụng hoặc lỗi kết nối DB, không phải lỗi kéo image. Pod chết ngay khi lên thì em xem cấu hình, biến môi trường, và câu lệnh migrate. Em không sửa code trong container đang chạy. Em sửa trên nhánh, ra bản mới, đưa lại đúng môi trường.</p>
      <p>Readiness sai sẽ đưa traffic vào pod chưa nối được DB. Liveness kiểm tra một thứ quá nặng sẽ giết pod lành. Em hỏi probe nào đang thất bại trước khi kết luận code hỏng.</p>`,
      tip: "Thứ tự: đúng bản chưa, pod thế nào, log theo mã, rồi mới sửa."
    },
    {
      level: "Nâng cao",
      q: "Vì sao tăng số pod mà job đối soát vẫn có thể ghi trùng?",
      html: `<p>Mỗi pod một lịch. synchronized và bộ nhớ local không sang pod khác. Hai pod cùng đọc một giao dịch chưa xử lý và cùng ghi. Em cần unique mã giao dịch ở DB. Khóa chọn việc nếu có thì phải nằm ngoài pod và có hạn.</p>
      <p>Tăng pod giúp API chịu nhiều request hơn khi ứng dụng không giữ trạng thái trong RAM. Nó không sửa job không idempotent, và nó làm DB nhận nhiều connection hơn. Em tăng sau khi biết nút thắt không phải là một câu SQL.</p>
      <p>Image production em gắn bằng số bản đã qua UAT, không dùng latest. Lùi bản khi sự cố diện rộng là lùi đúng bản đã biết, không build lại từ nhánh khác.</p>`,
      tip: "Nối được sang việc đối soát ngân hàng thì câu trả lời có trọng lượng."
    }
  ]);

  talk("gov", [
    {
      h: "Bài nói — Dự án cơ quan nhà nước theo đúng việc trên CV",
      html: `<p>Em không kể mình làm cả cổng dịch vụ công. Em kể phần backend em giữ: nâng cấp để đáp ứng mức nộp và trả kết quả trực tuyến, đồng bộ vùng trong và vùng ngoài, kênh với các đơn vị liên ngành, adapter LGSP, job và đối soát.</p>
      <p>Mức 3 là nộp hồ sơ trực tuyến. Mức 4 là nộp và nhận kết quả trực tuyến. Phần em làm nằm dưới các mức đó: dữ liệu phải tới đúng nơi, tới một lần, và truy được trạng thái khi nghiệm thu hỏi vì sao chưa thấy.</p>
      <p>Em làm việc có tài liệu và có phiếu lỗi. Số liệu lệch thì đối theo mã, không sửa tay hàng loạt. Audit là ai làm, lúc nào, giá trị trước và sau, ghi cùng transaction với việc đổi, không phải một dòng log quay vòng. Dữ liệu người dân không đưa xuống máy cá nhân và không in đầy đủ vào log.</p>`
    }
  ], [
    {
      level: "Trung cấp",
      q: "Mức độ 3 và 4 của dịch vụ công liên quan gì tới việc backend của bạn?",
      html: `<p>Mức 3 là người dân nộp hồ sơ trực tuyến. Mức 4 là nộp và nhận kết quả trực tuyến. Ứng dụng em tham gia nâng cấp để đáp ứng các mức đó trên cổng dịch vụ công quốc gia. Việc em làm không phải toàn bộ giao diện cổng. Em giữ luồng dữ liệu bên dưới: tiếp nhận, đồng bộ sang vùng còn lại, kết nối đơn vị liên ngành, và trạng thái để biết hồ sơ đang ở đâu.</p>
      <p>Vì có trả kết quả và có liên thông, em không thiết kế theo kiểu bấm nút là xong nếu kênh bên kia chưa xác nhận. Màn hình phải có trạng thái trung gian. Nghiệm thu sẽ hỏi một hồ sơ cụ thể, em phải chỉ được log và trạng thái của đúng mã đó.</p>
      <p>Em phối hợp BA để kịch bản test có case nộp lại, case bên kia chưa nhận, và case không đủ quyền xem hồ sơ đơn vị khác.</p>`,
      tip: "Nói gọn mức 3 và mức 4, rồi kéo về phần bạn làm. Đừng thuyết trình cả nghị định."
    },
    {
      level: "Trung cấp",
      q: "Adapter LGSP bạn mô tả trong một phút thế nào?",
      html: `<p>LGSP là nền để các hệ thống trao đổi dữ liệu theo hợp đồng chung, không phải mỗi đơn vị một kiểu nối riêng. Adapter của em bọc hợp đồng đó. Service nghiệp vụ gọi một method nội bộ. Adapter lo đổi dữ liệu, chữ ký hoặc xác thực, timeout, mã lỗi, và giới hạn kích thước lô.</p>
      <p>Dữ liệu dân cư không được kéo thừa và không được ghi cả gói vào log. Quyền xem vẫn kiểm tra ở service của mình, không chỉ tin phía ngoài đã cho đi qua. Lô lớn thì có mốc, lỗi một bản ghi không làm mất cả lô.</p>
      <p>Đổi nhà cung cấp hoặc đổi field bên ngoài thì em sửa adapter, không sửa rải trong nghiệp vụ duyệt hồ sơ.</p>`,
      tip: "Dừng ở biên adapter. Không mô tả endpoint nội bộ hay mẫu dữ liệu thật."
    },
    {
      level: "Nâng cao",
      q: "Buổi nghiệm thu họ bảo số hai bên không khớp. 30 phút đầu bạn làm gì?",
      html: `<p>Em không sửa dữ liệu. Em hỏi định nghĩa số: tính đến thời điểm nào, trạng thái nào được đếm, múi giờ nào. Rồi em lấy một mã lệch, không lấy tổng. Em xem mã đó đã ghi nhận gửi chưa, đã được bên kia xác nhận chưa, có nằm ở hàng lỗi không, có bị ghi hai lần không.</p>
      <p>Thiếu ở bên kia thì gửi lại đúng mã. Thừa thì tìm thao tác không idempotent hoặc báo cáo đang đếm sau một join một-nhiều. Em ghi lại câu đối soát để chạy lại được, đưa QA đúng mã đã kiểm.</p>
      <p>Xong ca đó em mới nói nguyên nhân gốc: timeout bị coi là thành công, hoặc hai màn hình đếm hai công thức. Không kết luận bằng cảm giác đường truyền.</p>`,
      tip: "Giọng hợp tác với QA. Đây là câu rất gần việc thật của bạn."
    }
  ]);

  const exp = mod("kinh-nghiem");
  exp.questions.push(
    {
      level: "Nâng cao",
      q: "Họ bảo kể sâu một quyết định kỹ thuật, không kể lại mô tả dự án.",
      html: `<p>Em chọn quyết định không coi việc đưa bản tin vào kênh là đã đồng bộ xong. Nếu coi là xong, timeout sẽ thành mất hồ sơ hoặc thành ghi hai lần khi gửi lại. Em tách trạng thái đã tiếp nhận, đang gửi, bên kia đã nhận, và lỗi. Mã bản tin là khóa để lần gửi sau không tạo hồ sơ mới.</p>
      <p>Cái được: nghiệm thu truy được một hồ sơ đang kẹt ở đâu, và job chạy lại an toàn. Cái mất: màn hình phức tạp hơn một nút thành công, BA phải chấp nhận trạng thái trung gian. Em thống nhất điều đó trước khi code, không để tới UAT mới cãi nhau về chữ đã xong.</p>
      <p>Nếu quyết định trên dự án hạ tầng dễ kể hơn, em chọn việc đếm distinct sau khi join lịch sử biến động, vì nếu không số tài sản trên báo cáo sẽ lớn hơn số thật.</p>`,
      tip: "Chỉ kể quyết định bạn thực sự đã tham gia. Đổi ví dụ nếu việc mã bản tin là của người khác."
    },
    {
      level: "Nâng cao",
      q: "Điểm yếu trên CV là bạn có nhiều công cụ tích hợp nhưng ít kể test và CI. Bạn trả lời sao?",
      html: `<p>Em không giả là đã xây cả nền tảng Kubernetes nếu việc đó không phải của em. Em nói em đưa code qua Git, có review, có môi trường tách nhau, và bản nào lên UAT thì truy được. Phần em tự kiểm là rule trạng thái, case gửi lại cùng mã, và câu SQL của báo cáo.</p>
      <p>Em biết chỗ cần bổ sung của một middle: test tự động cho các bước chuyển trạng thái và cho unique khi gửi trùng, pipeline đóng đúng một bản image hoặc một gói, không sửa trên máy đang chạy. Em đang làm việc đó rõ hơn trên hệ thống Spring Boot, nơi em chủ động từ API đến câu lệnh.</p>
      <p>Em biến câu hỏi điểm yếu thành việc em kiểm dữ liệu thế nào trên hệ thống đang chạy: đối mã, đọc log, không sửa tay hàng loạt.</p>`,
      tip: "Thành thật về biên giới việc của bạn. Người phỏng vấn tin hơn là một CV nghe như làm mọi tầng."
    },
    {
      level: "Trung cấp",
      q: "Vì sao từ firmware sang backend mà vẫn liên quan?",
      html: `<p>Ở Gia Khang em làm thiết bị và giao thức Modbus, UART, SPI. Gói tin có timeout và có thể gửi lại. Em không được xử lý một gói hai lần và không được mất gói rồi coi như máy vẫn đúng.</p>
      <p>Sang GTEL, kênh đồng bộ và job nền là cùng bài đó ở tầng phần mềm: ack, chạy lại, mã duy nhất, trạng thái khi chưa chắc đã tới nơi. Khác ở chỗ dữ liệu là hồ sơ và giao dịch, có đối soát và có nghiệm thu, không phải thanh ghi của thiết bị.</p>
      <p>Em học thêm Java, SQL, Spring Boot và cách làm việc với BA. Em không nói firmware thay được kinh nghiệm API. Em nói nó giải thích vì sao em để ý trường hợp chạy lại trước khi để ý trường hợp đẹp.</p>`,
      tip: "Ngắn. Đừng đi vào sơ đồ mạch."
    }
  );
})();
