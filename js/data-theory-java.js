(function () {
  const mod = MODULES.find((item) => item.id === "java");
  mod.summary = "Lộ trình Java cho mức khoảng 3 năm: từ JVM và kiểu dữ liệu, qua collection và exception, tới stream, đa luồng và bộ nhớ. Đọc từ trên xuống.";
  mod.theory = [
    {
      h: "Cơ bản — JDK, JRE và JVM",
      html: `<p>Bạn viết file <code>.java</code>. Trình biên dịch <code>javac</code> trong JDK biến nó thành bytecode <code>.class</code>. JVM đọc bytecode và chạy trên từng hệ điều hành. JRE là JVM cộng thư viện chạy. Từ Java 11 người ta cài JDK, không tách JRE như trước.</p>
      <p>Cùng một file class chạy được trên Windows và Linux vì khác nhau nằm ở JVM, không nằm ở mã nguồn. Khi production lỗi <code>UnsupportedClassVersionError</code>, bytecode được dịch bằng JDK mới hơn JVM đang chạy.</p>
      <ul>
        <li><strong>JDK:</strong> công cụ cho người viết code — compiler, jar, jstack, javadoc.</li>
        <li><strong>JVM:</strong> máy ảo thực thi bytecode, có bộ thu gom rác.</li>
        <li><strong>Bytecode:</strong> ngôn ngữ trung gian, không phải mã máy.</li>
      </ul>`
    },
    {
      h: "Cơ bản — Kiểu dữ liệu, biến và so sánh",
      html: `<p>Kiểu nguyên thủy (<code>int</code>, <code>long</code>, <code>boolean</code>, <code>double</code>…) giữ giá trị. Kiểu đối tượng giữ tham chiếu tới vùng nhớ trên heap. <code>==</code> với đối tượng so sánh tham chiếu, không so nội dung. So nội dung dùng <code>equals</code>.</p>
      <p><code>Integer</code> cache sẵn các giá trị từ -128 đến 127. Hai <code>Integer.valueOf(100)</code> có thể <code>==</code> nhau, hai <code>Integer.valueOf(1000)</code> thì không. Đừng dựa vào đó. Id hồ sơ, tiền, số lượng luôn so bằng <code>equals</code> hoặc kiểu nguyên thủy.</p>
      <p><code>double</code> không dùng cho tiền. Sai số nhị phân khiến <code>0.1 + 0.2</code> không ra đúng 0.3. Tiền để <code>BigDecimal</code> hoặc số nguyên nhỏ nhất (đồng).</p>`
    },
    {
      h: "Cơ bản — Lớp, interface, abstract, enum",
      html: `<ul>
        <li><strong>class</strong> là khuôn. Object là bản cụ thể.</li>
        <li><strong>abstract class</strong> vừa có code dùng chung vừa có method chưa làm. Một lớp chỉ kế thừa một class.</li>
        <li><strong>interface</strong> là hợp đồng. Một lớp làm nhiều interface. Java 8 trở đi interface có method <code>default</code>, nhưng đừng biến interface thành nơi nhét nghiệp vụ.</li>
        <li><strong>enum</strong> là tập giá trị cố định: trạng thái hồ sơ, loại văn bản. So enum bằng <code>==</code> được vì mỗi hằng là một instance. Enum có field và method, an toàn hơn hằng <code>String</code> gõ sai vẫn biên dịch.</li>
      </ul>
      <p>Quyền truy cập: <code>private</code> trong lớp, không ghi gì thì trong package, <code>protected</code> cho package và lớp con, <code>public</code> cho mọi nơi. Field public trên entity làm người khác sửa dữ liệu không qua rule.</p>`
    },
    {
      h: "Cơ bản — String bất biến",
      html: `<p><code>String</code> không sửa được. <code>text = text + "a"</code> tạo chuỗi mới. Trong vòng lặp hàng nghìn lần thì dùng <code>StringBuilder</code>. <code>StringBuffer</code> là bản có khóa, gần như không cần trong code mới.</p>
      <p>Literal như <code>"HaNoi"</code> được đưa vào pool. <code>new String("HaNoi")</code> là object mới, <code>==</code> với literal có thể false. Luôn <code>equals</code> khi so mã, email, tên trạng thái.</p>
      <pre><code>StringBuilder sql = new StringBuilder("select id from ho_so where 1=1");
if (ma != null) sql.append(" and ma = ?");</code></pre>
      <p>Nối SQL bằng chuỗi từ người dùng là lỗ hổng injection. <code>StringBuilder</code> chỉ để ghép phần cố định; giá trị lọc vẫn là tham số <code>?</code>.</p>`
    },
    {
      h: "Trung cấp — equals, hashCode, Comparable",
      html: `<p>Quy ước: nếu <code>equals</code> trả true thì <code>hashCode</code> phải bằng nhau. Ngược lại không bắt buộc — hai object khác nhau được phép trùng hash, gọi là đụng độ, <code>HashMap</code> vẫn đúng nhưng chậm hơn.</p>
      <p><code>HashMap</code> tìm ô bằng hash, rồi mới so <code>equals</code> trong ô đó. Quên <code>hashCode</code> thì hai hồ sơ “bằng nhau” nằm hai ô, <code>HashSet</code> chứa cả hai.</p>
      <p>Không lấy field hay đổi, như trạng thái hay số lần sửa, để tính hash của khóa. Với entity JPA, id lúc mới tạo còn null nên <code>equals</code> theo id dễ hỏng khi entity vừa được persist. Khóa nghiệp vụ ổn định (mã hồ sơ) thường an toàn hơn.</p>
      <p><code>Comparable</code> là thứ tự tự nhiên của lớp, ví dụ sort theo mã. <code>Comparator</code> là thứ tự bên ngoài, ví dụ màn hình muốn sort theo ngày. Một lớp có một <code>compareTo</code> nhưng nhiều comparator.</p>`
    },
    {
      h: "Trung cấp — Exception và đóng tài nguyên",
      html: `<p>Cây lỗi: <code>Throwable</code> chia thành <code>Error</code> (hết bộ nhớ, lỗi JVM — không bắt để sửa nghiệp vụ) và <code>Exception</code>. Exception lại chia thành checked (bắt khai báo <code>throws</code>) và runtime (không bắt khai báo).</p>
      <p>Trong service, lỗi nghiệp vụ dự kiến được (“hồ sơ đã khóa”) nên là runtime exception có mã, để khỏi khai báo ném qua năm tầng. Không <code>catch (Exception e)</code> rồi trả null. Không bắt xong nuốt. Log một lần ở biên API, kèm id truy vết, không log rồi ném lại thành hai dòng giống nhau.</p>
      <p><code>try-with-resources</code> đóng mọi thứ implement <code>AutoCloseable</code>: connection JDBC, stream file, response HTTP. Quên đóng connection là cạn pool — triệu chứng timeout dù CPU còn rảnh.</p>
      <pre><code>try (var conn = dataSource.getConnection();
     var ps = conn.prepareStatement("select id from ho_so where ma = ?")) {
  ps.setString(1, ma);
  try (var rs = ps.executeQuery()) {
    return rs.next();
  }
}</code></pre>`
    },
    {
      h: "Trung cấp — Collection nên chọn cái nào",
      html: `<ul>
        <li><strong>ArrayList:</strong> danh sách có thứ tự, cho trùng, đọc theo chỉ số rất nhanh. Mặc định chọn cái này.</li>
        <li><strong>LinkedList:</strong> chèn giữa danh sách trên lý thuyết rẻ, nhưng tìm tới vị trí đó vẫn phải đi từng nút. Với dữ liệu vừa và nhỏ, ArrayList gần như luôn nhanh hơn nhờ cache CPU.</li>
        <li><strong>HashSet:</strong> tập không trùng, không thứ tự, dựa trên hashCode/equals.</li>
        <li><strong>LinkedHashSet:</strong> không trùng và giữ thứ tự thêm vào.</li>
        <li><strong>TreeSet:</strong> không trùng, sắp xếp, chậm hơn hash một chút.</li>
        <li><strong>HashMap:</strong> khóa-giá trị, cho một khóa null. Không an toàn khi nhiều luồng cùng ghi.</li>
        <li><strong>LinkedHashMap:</strong> nhớ thứ tự. Hợp cache LRU tự viết.</li>
        <li><strong>TreeMap:</strong> khóa được sắp xếp.</li>
        <li><strong>ConcurrentHashMap:</strong> nhiều luồng đọc ghi. Không nhận khóa null hay giá trị null.</li>
      </ul>
      <p>Sửa danh sách trong lúc đang duyệt bằng for-each sẽ ném <code>ConcurrentModificationException</code>. Xóa thì dùng iterator hoặc xóa sau vòng lặp. Đừng dùng <code>Hashtable</code> và <code>Vector</code> trong code mới — đó là bản cũ khóa cả cấu trúc.</p>`
    },
    {
      h: "Trung cấp — Generics, lambda, Stream, Optional",
      html: `<p>Generics chặn nhét nhầm kiểu lúc biên dịch. Lúc chạy, thông tin kiểu trong <code>List&lt;String&gt;</code> bị xóa (type erasure), nên không viết được <code>new T()</code> và không overload hai method mà sau khi xóa kiểu thì trùng chữ ký.</p>
      <p>Lambda là hàm ngắn, dùng với interface chỉ có một method trừu tượng. Stream mô tả các bước lọc, map, gom. Bước trung gian lười: chưa có bước kết thúc như <code>collect</code>, <code>count</code>, <code>findFirst</code> thì chưa chạy. Stream dùng một lần.</p>
      <p>Stream song song không phải lúc nào cũng nhanh. Nó dùng pool chung, dễ tranh với việc khác, và sai nếu lambda sửa biến dùng chung hoặc gọi IO giữ connection. Chỉ bật khi dữ liệu lớn, việc thuần CPU, và đã đo.</p>
      <p><code>Optional</code> nói “có thể không có” ở giá trị trả về. Đừng dùng làm field entity hay tham số mọi nơi.</p>
      <ul>
        <li><code>orElse(macDinh())</code> luôn gọi <code>macDinh()</code> dù đã có giá trị.</li>
        <li><code>orElseGet(this::macDinh)</code> chỉ gọi khi rỗng. Dùng cái này nếu tạo giá trị mặc định đắt.</li>
        <li><code>get()</code> ném lỗi nếu rỗng. Ưu tiên <code>orElseThrow</code>.</li>
      </ul>`
    },
    {
      h: "Nâng cao — Đa luồng ở mức đi làm được",
      html: `<p>Mỗi request trên Tomcat hay Jetty đã là một luồng (hoặc một tác vụ) trong pool. Không tạo thêm <code>new Thread()</code> cho từng hồ sơ. Dùng <code>ExecutorService</code> với số luồng có trần nếu phải xử lý song song có kiểm soát.</p>
      <ul>
        <li><code>synchronized</code> để một lúc chỉ một luồng vào khối code, và luồng khác thấy dữ liệu mới nhất sau khi ra khỏi khối.</li>
        <li><code>volatile</code> chỉ bảo đảm đọc thấy lần ghi mới nhất của biến đó. <code>count++</code> trên biến volatile vẫn sai vì đọc-sửa-ghi là ba bước.</li>
        <li><code>AtomicInteger</code> cho đếm. <code>ConcurrentHashMap</code> cho map dùng chung.</li>
      </ul>
      <p><code>ThreadLocal</code> gắn dữ liệu theo luồng, ví dụ user hiện tại. Pool tái sử dụng luồng, nên quên <code>remove()</code> sẽ làm request sau nhìn thấy user của request trước. Đó là lỗi bảo mật, không chỉ lỗi chức năng.</p>
      <p>Deadlock ứng dụng giống deadlock DB: luồng 1 giữ khóa A chờ B, luồng 2 giữ B chờ A. Khóa theo một thứ tự, và đừng giữ khóa trong lúc gọi HTTP.</p>`
    },
    {
      h: "Nâng cao — Bộ nhớ, GC và record",
      html: `<p>Biến cục bộ và tham chiếu nằm trên stack của luồng. Object tạo bằng <code>new</code> nằm trên heap. GC thu object không còn ai trỏ tới. GC không sửa được rò rỉ do chính bạn còn giữ tham chiếu: map static càng ngày càng thêm, listener quên gỡ, cache không TTL.</p>
      <p>Phần lớn object chết trẻ ở vùng young generation. Đưa object sống lâu (cache, metadata) sẽ sang old generation. <code>OutOfMemoryError</code> là <code>Error</code>. Bắt nó rồi tiếp tục thường làm process ở trạng thái hỏng. Cách làm là giới hạn kích thước cache, stream dữ liệu lớn thay vì tải hết vào list, và xem heap dump khi sự cố lặp lại.</p>
      <p>Đừng gọi <code>System.gc()</code> trên production. Không cần thuộc mọi tham số G1 để phỏng vấn Middle. Cần nói được: rò rỉ là còn tham chiếu, triệu chứng là heap tăng theo thời gian và full GC dày, hướng xử lý là tìm cấu trúc sống mãi.</p>
      <p><code>record</code> là lớp bất biến nông, hợp DTO. Nếu record chứa <code>List</code> mà bạn trả list gốc, người gọi vẫn sửa được phần tử bên trong. Copy list lúc tạo record nếu đó là dữ liệu không được đổi.</p>`
    }
  ];
  mod.questions.push(
    {
      level: "Cơ bản",
      q: "JDK, JRE và JVM khác nhau thế nào?",
      html: `<p>JVM là nơi chạy bytecode. JRE là JVM cộng thư viện để chạy ứng dụng. JDK gồm JRE và công cụ để viết, dịch, đóng gói. Mã nguồn dịch một lần, JVM của từng hệ điều hành đảm nhiệm phần còn lại. Lệch phiên bản JDK lúc build và JVM lúc chạy sẽ không mở được class.</p>`,
      tip: "Ngắn. Nếu họ hỏi tiếp GC, hãy nói GC nằm trong JVM và chỉ thu object không còn tham chiếu."
    },
    {
      level: "Cơ bản",
      q: "Vì sao không dùng double để tính tiền?",
      html: `<p>Số thực nhị phân không biểu diễn chính xác nhiều số thập phân. Cộng nhiều khoản sẽ lệch một vài đồng, báo cáo và đối soát sẽ không khớp. Em dùng <code>BigDecimal</code> hoặc lưu số nguyên là số đồng. So sánh tiền không dùng <code>equals</code> của float.</p>`,
      tip: "Kèm một câu: làm tròn theo quy tắc nghiệp vụ ở một chỗ, không làm tròn rải rác."
    },
    {
      level: "Trung cấp",
      q: "Bạn chọn ArrayList, HashSet hay HashMap trong tình huống nào?",
      html: `<p>Danh sách hồ sơ giữ thứ tự và cho trùng thì ArrayList. Tập mã đã xử lý, cần biết có hay chưa trong O(1), thì HashSet. Tra cứu hồ sơ theo mã thì HashMap. Nhiều luồng cùng ghi map thì ConcurrentHashMap. Em gần như không dùng LinkedList trừ khi có đo đạc chứng minh nó nhanh hơn.</p>`,
      tip: "Nhắc equals và hashCode nếu khóa là object tự viết."
    },
    {
      level: "Trung cấp",
      q: "orElse khác orElseGet thế nào?",
      html: `<p><code>orElse</code> nhận một giá trị đã được tính sẵn, nên lời gọi đắt tiền bên trong vẫn chạy dù Optional có dữ liệu. <code>orElseGet</code> nhận hàm, chỉ chạy khi Optional rỗng. Em dùng orElse cho hằng số, orElseGet khi phải tạo object, gọi DB hoặc dựng thông báo lỗi.</p>`,
      tip: "Một câu ví dụ là đủ, không cần giải thích cả Stream."
    },
    {
      level: "Nâng cao",
      q: "volatile có thay được synchronized không?",
      html: `<p>Không, nếu thao tác không phải một lần ghi nguyên vẹn. volatile bảo đảm luồng khác thấy giá trị mới của đúng biến đó. Nó không gom được nhiều bước thành một. Tăng bộ đếm, kiểm tra rồi mới thêm vào map, vẫn phải dùng khóa, atomic, hoặc cấu trúc concurrent. Em dùng volatile cho cờ dừng vòng lặp, dùng synchronized hoặc concurrent collection cho dữ liệu dùng chung.</p>`,
      tip: "Thêm ThreadLocal nếu họ đang hỏi lỗi user bị lẫn trên production: pool tái sử dụng luồng, phải remove."
    }
  );
  mod.quiz.push(
    {
      q: "orElseGet khác orElse ở điểm nào khi giá trị mặc định đắt để tạo?",
      options: [
        "orElseGet chỉ tạo giá trị mặc định khi Optional đang rỗng",
        "Hai cách luôn chạy như nhau",
        "orElse bỏ qua giá trị đã có"
      ],
      correct: 0,
      explain: "orElse nhận giá trị đã tính. orElseGet nhận hàm và chỉ gọi hàm khi không có giá trị."
    },
    {
      q: "GC thu được những object nào?",
      options: [
        "Mọi object sống quá 5 phút",
        "Object không còn tham chiếu tới được",
        "Mọi object trong map static"
      ],
      correct: 1,
      explain: "Map static còn giữ tham chiếu thì GC không thu. Đó là dạng rò rỉ bộ nhớ thường gặp."
    }
  );
})();
