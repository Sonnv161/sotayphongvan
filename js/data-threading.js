(function () {
  const mod = MODULES.find((item) => item.id === "java");
  const at = mod.theory.findIndex((block) => block.h.startsWith("Nâng cao — Đa luồng"));
  mod.theory.splice(at, 0,
    {
      h: "Trung cấp — Process, thread và request",
      html: `<p>Process là một chương trình đang chạy, có bộ nhớ riêng. Thread là một lối thực thi bên trong process, dùng chung heap, mỗi thread có stack riêng. Hai thread của cùng một API cùng nhìn thấy một <code>static</code> map. Đó vừa là cách chia sẻ cache, vừa là cách làm hỏng dữ liệu.</p>
      <p>Tomcat nhận mỗi request trên một thread trong pool. Hết request thì thread được trả về pool, không bị hủy. Vì vậy dữ liệu gắn trên thread, nếu không xóa, sẽ dính sang request sau.</p>
      <p>Tạo <code>new Thread()</code> cho từng hồ sơ thì hết request là có thể có hàng trăm thread: tốn bộ nhớ stack, và không có trần. Việc nền phải đi qua pool có số lượng tối đa.</p>`
    },
    {
      h: "Trung cấp — Race condition nhìn từ một biến đếm",
      html: `<p>Hai thread cùng làm <code>count++</code>. Mỗi lần tăng là đọc giá trị, cộng một, ghi lại. Cả hai đọc được 10, cả hai ghi 11. Mất một lần đếm. Kết quả không sai ngay mọi lần, nên test một người bấm sẽ không thấy. Đây là race.</p>
      <pre><code>int count = 0;
void nhanBanTin() {
  count++; // không an toàn nếu nhiều thread
}</code></pre>
      <p>Sửa tùy việc. Chỉ cần đếm thì <code>AtomicInteger.incrementAndGet()</code>. Cần nhiều bước đi cùng nhau, ví dụ kiểm tra mã chưa có rồi mới thêm, thì một lần tăng atomic không đủ — phải khóa cả cụm hoặc dùng thao tác nguyên tử của map như <code>putIfAbsent</code>.</p>
      <p>Trong job đồng bộ, race thường là hai worker cùng nhận một mã hồ sơ. Khóa ở bộ nhớ của một process không giúp gì nếu có hai process. Khi đó khóa phải nằm ở DB hoặc ở một khóa phân tán, và phía ghi vẫn cần unique trên mã bản tin.</p>`
    },
    {
      h: "Trung cấp — synchronized, volatile và atomic",
      html: `<p><code>synchronized</code> chiếm khóa của object. Thread khác muốn vào khối cùng khóa thì chờ. Khi thread giữ khóa ra khỏi khối, thread sau nhìn thấy mọi ghi đã xảy ra trong khối. Khóa quá rộng, ví dụ cả method dài có gọi mạng, sẽ làm các request xếp hàng.</p>
      <pre><code>private final Object khoa = new Object();

void ghiMotLan(String ma) {
  synchronized (khoa) {
    if (daXuLy.contains(ma)) return;
    daXuLy.add(ma);
  }
}</code></pre>
      <p><code>volatile</code> chỉ bảo đảm đọc thấy lần ghi mới nhất của đúng biến đó. Hợp cờ <code>dungJob</code>. Không hợp <code>count++</code> vì cộng vẫn là ba bước. <code>AtomicInteger</code> và <code>AtomicReference</code> làm một thao tác nhỏ thành nguyên tử, không cần tự viết khóa.</p>
      <p><code>ReentrantLock</code> cùng ý với synchronized nhưng có <code>tryLock</code> để khỏi chờ mãi. Dùng khi job thứ hai nên bỏ qua nếu job thứ nhất đang chạy, thay vì xếp hàng phía sau.</p>`
    },
    {
      h: "Trung cấp — ExecutorService",
      html: `<p>Pool giữ sẵn một số thread, có hàng đợi việc. Đưa task vào, không tự tạo thread.</p>
      <pre><code>ExecutorService pool = Executors.newFixedThreadPool(4);
pool.submit(() -&gt; xuLyLo(maLo));
// khi tắt ứng dụng
pool.shutdown();</code></pre>
      <ul>
        <li><strong>Fixed pool:</strong> số thread cố định, hàng đợi không giới hạn ở bản <code>newFixedThreadPool</code>. Hàng đợi vô hạn có thể nuốt hết bộ nhớ nếu việc vào nhanh hơn việc xử lý.</li>
        <li><strong>Cached pool:</strong> tạo thêm thread khi thiếu. Dễ phình thread nếu mỗi task đang chờ mạng.</li>
        <li>Nên tự tạo <code>ThreadPoolExecutor</code> với trần thread, trần hàng đợi, và chính sách khi đầy: từ chối hoặc chạy trên thread gọi.</li>
      </ul>
      <p>Đặt tên thread, ví dụ <code>dong-bo-san-bay</code>, để thread dump đọc được. Tắt ứng dụng thì <code>shutdown</code>, chờ một lúc, rồi <code>shutdownNow</code> nếu còn kẹt. Quên tắt pool thì process không thoát, hoặc thread nền còn chạy sau khi context Spring đã đóng.</p>`
    }
  );
  const after = mod.theory.findIndex((block) => block.h.startsWith("Nâng cao — Đa luồng")) + 1;
  mod.theory.splice(after, 0,
    {
      h: "Nâng cao — CompletableFuture",
      html: `<p><code>CompletableFuture</code> là một việc sẽ có kết quả sau. Hợp khi gọi vài hệ thống độc lập rồi ghép kết quả, không hợp khi các bước phải cùng một transaction DB.</p>
      <pre><code>CompletableFuture&lt;String&gt; a = CompletableFuture.supplyAsync(() -&gt; goiKenhA(), pool);
CompletableFuture&lt;String&gt; b = CompletableFuture.supplyAsync(() -&gt; goiKenhB(), pool);
String ketQua = a.thenCombine(b, (x, y) -&gt; x + "|" + y).join();</code></pre>
      <p><code>supplyAsync</code> không truyền pool thì dùng pool chung của JVM. Task chậm sẽ chiếm pool đó và làm chậm cả những chỗ khác đang dùng parallel stream. Em truyền pool riêng cho tích hợp.</p>
      <p><code>join</code> chờ và bọc lỗi thành runtime. Cần xem lỗi gốc thì <code>exceptionally</code> hoặc bắt <code>CompletionException</code> rồi lấy cause. Timeout bằng <code>orTimeout</code> để khỏi treo thread gọi. Future hủy không có nghĩa hệ thống bên kia đã dừng xử lý — bên nhận vẫn phải idempotent.</p>`
    },
    {
      h: "Nâng cao — Chọn số thread và hàng đợi",
      html: `<p>Việc tốn CPU, như nén hoặc tính trên dữ liệu đã có trong RAM, số thread gần bằng số lõi. Thêm nữa chỉ thêm đổi ngữ cảnh.</p>
      <p>Việc chờ IO, như gọi đối tác, chờ Diode, chờ DB, thread đang ngủ. Có thể nhiều hơn số lõi, nhưng mỗi thread vẫn chiếm stack và vẫn giữ connection nếu bạn mở transaction quanh lúc chờ. Trần nên đặt theo số connection DB và số cuộc gọi đối tác chịu được, không đặt theo số hồ sơ trong file.</p>
      <p>Hàng đợi có trần. Đầy thì từ chối lô mới và để lịch chạy lần sau, tốt hơn là nhận vô hạn rồi chết vì hết bộ nhớ. Đo: độ dài hàng đợi, thời gian một lô, số thread đang chạy. Thấy hàng đợi tăng mãi thì thiếu năng lực xử lý hoặc phía nhận đang chậm, thêm thread mù sẽ đánh ngã DB.</p>`
    },
    {
      h: "Nâng cao — Job lịch và nhiều instance",
      html: `<p>Schedule trên Tibco hoặc <code>@Scheduled</code> của Spring đều gặp một việc: production có hai node thì lịch có thể nổ hai lần. Khóa <code>synchronized</code> chỉ có tác dụng trong một process.</p>
      <ol>
        <li>Mỗi bản tin một mã duy nhất trong DB. Chạy trùng vẫn chỉ ghi một lần.</li>
        <li>Mốc lô đã xử lý để lần sau không đọc lại từ đầu.</li>
        <li>Nếu cần đúng một node chạy, dùng khóa có hạn. Node chết thì khóa hết hạn, node khác nhận. Job vẫn phải chịu một lần chạy chồng ngắn khi failover.</li>
        <li>Không giữ khóa trong lúc chờ mạng lâu. Nhận việc, nhả khóa chọn việc, rồi xử lý idempotent.</li>
      </ol>
      <p>Cách nói gắn với việc em đã làm: job đồng bộ sân bay và job nhận giao dịch đều chạy lại được. Em dựa vào mã nghiệp vụ trên DB, không chỉ dựa vào lịch chạy một lần.</p>`
    },
    {
      h: "Nâng cao — Khi production kẹt luồng",
      html: `<p>Dấu hiệu: API chậm dần, CPU thấp, nhiều request đang chờ. Em lấy thread dump, không restart ngay nếu còn cách xem.</p>
      <ul>
        <li>Nhiều thread ở trạng thái chờ DB: hết pool connection, hoặc transaction giữ connection quá lâu.</li>
        <li>Nhiều thread BLOCKED trên cùng một khóa: khóa quá rộng, hoặc deadlock.</li>
        <li>Pool Tomcat đầy vì mỗi request đang chờ một cuộc gọi không có timeout.</li>
      </ul>
      <p>Hướng xử lý khớp nguyên nhân: timeout cho client HTTP, thu ngắn transaction, giảm số job song song, thêm unique để tắt được retry an toàn. Restart chỉ để lấy lại dịch vụ, không thay cho việc biết vì sao đầy luồng.</p>
      <p><code>ThreadLocal</code> trong pool, nếu không <code>remove</code> ở finally, request sau dùng nhầm user của request trước. Với API phân quyền theo đơn vị, đó là lỗi bảo mật. Em xóa ở cuối request hoặc dùng cơ chế của framework đã được xóa sẵn và không tự giữ thêm.</p>`
    }
  );
  mod.questions.push(
    {
      level: "Trung cấp",
      q: "Race condition là gì? Cho một ví dụ trong job đồng bộ.",
      html: `<p>Hai lối thực thi cùng sửa một dữ liệu mà kết quả phụ thuộc thứ tự xen kẽ. Ví dụ hai job cùng thấy mã hồ sơ chưa xử lý, cùng ghi một lần đồng bộ, thành hai dòng hoặc cộng tiền hai lần. Em chặn bằng ràng buộc unique trên mã bản tin, và bằng một thao tác nhận việc nguyên tử. Kiểm tra rồi mới ghi, nếu hai bước tách rời, thì vẫn race.</p>`,
      tip: "Vẽ hai worker trên giấy. Đừng chỉ định nghĩa."
    },
    {
      level: "Trung cấp",
      q: "volatile có đủ cho biến đếm số bản tin đã xử lý không?",
      html: `<p>Không. volatile giúp thread khác thấy giá trị mới, nhưng tăng biến vẫn là đọc, cộng, ghi. Hai thread đọc cùng một số thì một lần tăng biến mất. Đếm thì dùng AtomicInteger. Nếu vừa đếm vừa quyết định có ghi DB hay không thì atomic của riêng biến đếm cũng chưa đủ, phải khóa cả quyết định hoặc để DB làm trọng tài bằng unique.</p>`,
      tip: "Phân biệt thấy dữ liệu mới với làm một cụm việc không bị xen."
    },
    {
      level: "Trung cấp",
      q: "Vì sao không tạo thread mới cho từng hồ sơ trong file đồng bộ?",
      html: `<p>File vài nghìn dòng sẽ thành vài nghìn thread, mỗi thread một stack, và tất cả cùng chờ DB hoặc chờ kênh. Hệ thống hết tài nguyên trước khi xử lý xong. Em dùng pool có trần, hàng đợi có trần. Đầy thì dừng nhận thêm và để lịch sau chạy tiếp từ mốc. Số thread em đặt theo khả năng của DB và của phía nhận, không đặt bằng số dòng trong file.</p>`,
      tip: "Nhắc tên thread để thread dump còn đọc được."
    },
    {
      level: "Nâng cao",
      q: "Hai node cùng lịch chạy job thì synchronized có ngăn được không?",
      html: `<p>Không. synchronized chỉ khóa trong một JVM. Node thứ hai có khóa riêng. Em để unique mã bản tin trên DB để lần chạy thứ hai không ghi đôi, và nếu cần chỉ một node làm việc lấy lô thì dùng khóa có thời hạn ở DB hoặc Redis. Khóa hết hạn khi node chết để node kia nhận. Em vẫn giả định có một khoảng hai node cùng nghĩ mình đang giữ việc, nên bước ghi phải idempotent.</p>`,
      tip: "Gắn vào job sân bay hoặc job nhận giao dịch nếu họ muốn ví dụ thật."
    },
    {
      level: "Nâng cao",
      q: "Thread dump thấy nhiều thread đang chờ connection. Bạn nghĩ gì?",
      html: `<p>Pool connection cạn hoặc đang bị giữ. Em xem transaction có bao quanh lời gọi mạng không, job có mở quá nhiều việc song song so với kích thước pool không, và có câu SQL nào giữ khóa lâu không. Thêm thread lúc này làm hết connection nhanh hơn. Em giảm độ song song, đưa IO ra khỏi transaction, và đặt timeout. Restart chỉ để mở lại cửa nếu người dùng đang kẹt.</p>`,
      tip: "Nói một công cụ bạn dùng được: jstack, actuator, hoặc thread dump của máy chủ ứng dụng."
    }
  );
  mod.quiz.push(
    {
      q: "Hai thread cùng count++ trên một biến thường. Chuyện gì có thể xảy ra?",
      options: [
        "Luôn đủ số lần tăng",
        "Mất một số lần tăng vì đọc và ghi xen kẽ",
        "JVM tự khóa biến int"
      ],
      correct: 1,
      explain: "Đọc, cộng, ghi không phải một thao tác nguyên tử. Cần atomic hoặc khóa."
    },
    {
      q: "synchronized trên một node có chặn job cùng lịch ở node thứ hai không?",
      options: [
        "Có, vì khóa dùng chung cả cụm",
        "Không, khóa đó chỉ trong một process",
        "Chỉ chặn khi method là static"
      ],
      correct: 1,
      explain: "Hai JVM là hai khóa riêng. Chống ghi đôi phải dùng unique trên DB hoặc khóa phân tán, và xử lý idempotent."
    }
  );
})();
