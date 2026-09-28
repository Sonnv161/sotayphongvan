(function () {
  function before(id, prefix, blocks) {
    const mod = MODULES.find((item) => item.id === id);
    const index = mod.theory.findIndex((block) => block.h.startsWith(prefix));
    mod.theory.splice(index, 0, ...blocks);
    return mod;
  }

  const java = before("java", "Trung cấp", [
    {
      h: "Cơ bản — Method, overload và override",
      html: `<p>Method là hành vi của lớp. Chữ ký gồm tên và danh sách kiểu tham số. Kiểu trả về và tên tham số không nằm trong chữ ký.</p>
      <p><strong>Overload</strong> là nhiều method cùng tên, khác tham số, trong cùng một lớp. Trình biên dịch chọn method lúc dịch. Ví dụ <code>tim(String ma)</code> và <code>tim(String ma, Long donViId)</code>.</p>
      <p><strong>Override</strong> là lớp con viết lại method của lớp cha, cùng tên và cùng tham số. Method nào chạy phụ thuộc kiểu thật của object lúc chạy. Gắn <code>@Override</code> để trình biên dịch bắt lỗi gõ sai tên. Không được thu hẹp quyền truy cập, không được ném thêm checked exception mà cha không khai báo.</p>
      <pre><code>class HoSo {
  String trangThai() { return "CHO"; }
}
class HoSoDaDuyet extends HoSo {
  @Override
  String trangThai() { return "DA_DUYET"; }
}</code></pre>
      <p>Method <code>static</code> không override được. Lớp con khai báo lại static cùng tên chỉ là che method của cha, lời gọi lấy theo kiểu biến lúc dịch, không theo object thật. Constructor không được kế thừa. Lớp con muốn gọi constructor cha thì <code>super(...)</code> phải là dòng đầu tiên.</p>`
    },
    {
      h: "Cơ bản — static, final và cách truyền tham số",
      html: `<p><code>static</code> thuộc về lớp, dùng chung mọi object, không có <code>this</code>. Hợp hằng số, hàm thuần không đụng dữ liệu từng hồ sơ. Không hợp để giữ user đang đăng nhập hay hồ sơ đang xử lý — request sau sẽ đè request trước.</p>
      <p><code>final</code> trên biến nghĩa là không gán lại. Trên method nghĩa là lớp con không override. Trên class nghĩa là không được kế thừa, ví dụ <code>String</code>. Field final của object vẫn có thể chứa list và list đó vẫn bị sửa phần tử nếu bạn không bọc lại.</p>
      <p>Java truyền tham số theo giá trị. Với kiểu nguyên thủy, hàm nhận một bản sao, sửa trong hàm không đổi biến ngoài. Với object, hàm nhận bản sao của tham chiếu: sửa field của object thì người gọi thấy, còn gán tham số bằng <code>new</code> thì người gọi không thấy biến của họ đổi sang object mới.</p>
      <pre><code>void doiTen(HoSo hs) {
  hs.ten = "A";          // người gọi thấy tên mới
  hs = new HoSo();       // người gọi vẫn giữ object cũ
}</code></pre>`
    },
    {
      h: "Cơ bản — null, mảng và vòng lặp",
      html: `<p><code>null</code> nghĩa là tham chiếu chưa trỏ object nào. Gọi method trên null thì <code>NullPointerException</code>. Đây là lỗi gặp nhiều nhất lúc mới viết service. Chặn ở biên: DTO vào đã được validate, query không thấy dữ liệu thì ném lỗi nghiệp vụ “không tìm thấy”, không trả null để năm tầng sau mới vỡ.</p>
      <p>Mảng có độ dài cố định, chỉ số từ 0. <code>List</code> co giãn được và là thứ bạn dùng trong API. For-each đọc danh sách gọn nhưng không cho chỉ số, và không được thêm hoặc xóa phần tử ngay trong vòng đó — sẽ <code>ConcurrentModificationException</code>.</p>
      <pre><code>String ma = hoSo == null ? "" : hoSo.getMa();
for (int i = 0; i &lt; danhSach.size(); i++) {
  HoSo hs = danhSach.get(i);
}</code></pre>
      <p>So chuỗi đến từ ngoài thì cân nhắc null trước, hoặc <code>Objects.equals(a, b)</code> vì <code>a.equals(b)</code> vẫn vỡ nếu <code>a</code> là null.</p>`
    },
    {
      h: "Cơ bản — Một lớp nhỏ đọc từ trên xuống",
      html: `<p>Lớp backend thường có field private, constructor nhận dữ liệu bắt buộc, và method đổi trạng thái có kiểm tra. Người khác không gán <code>trangThai = "DA_DUYET"</code> từ bên ngoài.</p>
      <pre><code>public class HoSo {
  private final String ma;
  private String trangThai;

  public HoSo(String ma) {
    if (ma == null || ma.isBlank()) {
      throw new IllegalArgumentException("Thieu ma");
    }
    this.ma = ma;
    this.trangThai = "CHO_DUYET";
  }

  public void duyet() {
    if (!"CHO_DUYET".equals(trangThai)) {
      throw new IllegalStateException("Sai buoc");
    }
    this.trangThai = "DA_DUYET";
  }
}</code></pre>
      <p><code>this.ma</code> là field, <code>ma</code> là tham số. <code>isBlank()</code> đúng cả chuỗi rỗng và chuỗi chỉ có dấu cách. Rule “chỉ duyệt khi đang chờ” nằm trong lớp, không nằm rải ở từng controller.</p>`
    }
  ]);

  before("java", "Nâng cao", [
    {
      h: "Trung cấp — Ngày giờ với java.time",
      html: `<p>Code mới không dùng <code>java.util.Date</code> và <code>Calendar</code>. Chúng lẫn múi giờ, tháng đánh số từ 0, và khó test.</p>
      <ul>
        <li><code>LocalDate</code>: ngày lịch, không có giờ. Hợp ngày nộp, ngày sinh, ngày hiệu lực.</li>
        <li><code>LocalDateTime</code>: ngày và giờ nhưng không có múi. Dễ lệch khi máy chủ để UTC còn người dùng ở Việt Nam.</li>
        <li><code>Instant</code>: một mốc trên đồng hồ UTC. Hợp thời điểm ghi log, audit.</li>
        <li><code>ZonedDateTime</code>: ngày giờ kèm múi, ví dụ <code>Asia/Ho_Chi_Minh</code>. Dùng khi cần biết “hết ngày làm việc” theo giờ hành chính.</li>
      </ul>
      <p>Cột “ngày nộp” trên báo cáo nhà nước thường là ngày lịch. Cột “lúc bấm duyệt” là mốc thời gian. Trộn hai thứ này sẽ lệch hồ sơ nộp lúc 23:30 hoặc 00:30. Chốt một quy ước ở biên API, đổi sang kiểu Java rõ nghĩa, và test một case quanh nửa đêm.</p>
      <pre><code>LocalDate homNay = LocalDate.now(ZoneId.of("Asia/Ho_Chi_Minh"));
boolean conHan = !ngayHetHan.isBefore(homNay);</code></pre>`
    },
    {
      h: "Trung cấp — HashMap làm việc bên trong",
      html: `<p>Khóa được tính hash, hash chọn ô trong mảng. Nhiều khóa rơi vào cùng ô thì nối thành chuỗi, rồi so <code>equals</code> để tìm đúng khóa. Vì vậy hai method đó phải đi cùng nhau.</p>
      <p>Sức chứa ban đầu thường 16 ô. Khi số phần tử vượt khoảng 75% số ô, map giãn ra gấp đôi và băm lại. Giãn liên tục trên map rất lớn làm chậm một nhịp ghi. Nếu biết trước vài chục nghìn mã, hãy tạo map với sức chứa ước lượng.</p>
      <p>Từ Java 8, một ô quá đông được chuyển thành cây để đỡ tệ khi hash kém. Khóa phải bất biến: đưa object vào map rồi sửa field đang dùng để tính hash thì lần sau không tìm thấy. <code>HashMap</code> không giữ thứ tự và không cho nhiều luồng cùng ghi. Cần thứ tự thì <code>LinkedHashMap</code>. Nhiều luồng thì <code>ConcurrentHashMap</code>, và loại này không nhận null.</p>`
    },
    {
      h: "Trung cấp — Stream trên một danh sách hồ sơ",
      html: `<p>Stream hợp khi biến đổi collection đã có trong bộ nhớ. Không hợp để giấu câu query trong từng phần tử.</p>
      <pre><code>Map&lt;Long, Long&gt; dem = hoSoList.stream()
  .filter(hs -&gt; "DA_DUYET".equals(hs.getTrangThai()))
  .collect(Collectors.groupingBy(HoSo::getDonViId, Collectors.counting()));</code></pre>
      <p>Đọc từ trái sang: lấy luồng, giữ hồ sơ đã duyệt, gom theo đơn vị và đếm. <code>filter</code> và <code>map</code> chưa chạy cho đến khi có bước kết như <code>collect</code>, <code>count</code>, <code>findFirst</code>. Stream dùng xong một lần, gọi tiếp sẽ lỗi.</p>
      <p>Không gọi repository bên trong <code>map</code>. Trông gọn nhưng thành N câu SQL và khó thấy trong review. Lấy dữ liệu bằng một query, rồi stream chỉ để đổi dạng. <code>parallel()</code> để sau khi đã đo và khi từng phần tử không đụng DB, không đụng biến chung.</p>`
    },
    {
      h: "Trung cấp — Lỗi nghiệp vụ và lỗi kỹ thuật",
      html: `<p>Tách hai loại. Lỗi nghiệp vụ là tình huống đã lường: sai bước, hết quyền, trùng mã. Người dùng sửa được dữ liệu và gửi lại. Lỗi kỹ thuật là đứt DB, timeout, lỗi lập trình. Người dùng không sửa được, cần id truy vết để đọc log.</p>
      <pre><code>public class LoiNghiepVu extends RuntimeException {
  private final String ma;
  public LoiNghiepVu(String ma, String message) {
    super(message);
    this.ma = ma;
  }
}</code></pre>
      <p>Khi bắt lỗi tầng dưới, giữ nguyên cause: <code>throw new LoiNghiepVu("TRUNG_MA", "Ma da ton tai")</code> hoặc bọc lỗi kỹ thuật kèm exception gốc. Mất cause là mất stack, hôm sau không biết vỡ ở dòng nào. Không log ở service rồi ném tiếp để controller log lại cùng một lỗi.</p>
      <p>Checked exception của JDBC bắt ở biên repository, đổi thành exception của ứng dụng. Tầng service không nên khai báo <code>throws Exception</code>.</p>`
    }
  ]);
  java.questions.push(
    {
      level: "Cơ bản",
      q: "Overload khác override thế nào?",
      html: `<p>Overload là cùng tên, khác tham số, chọn lúc biên dịch. Override là lớp con viết lại đúng chữ ký của cha, chọn lúc chạy theo object thật. Em gắn @Override để khỏi tưởng mình đang override nhưng thực ra đã overload vì lệch một kiểu tham số. Method static không override, chỉ bị che theo kiểu khai báo của biến.</p>`,
      tip: "Lấy ví dụ tim theo mã và tim theo mã cộng đơn vị cho overload. Lấy trạng thái hồ sơ cho override."
    },
    {
      level: "Cơ bản",
      q: "Java truyền tham số theo giá trị hay theo tham chiếu?",
      html: `<p>Theo giá trị. Kiểu nguyên thủy thì hàm nhận bản sao, sửa không ảnh hưởng biến ngoài. Object thì hàm nhận bản sao của tham chiếu: đổi field thì người gọi thấy, gán tham số thành object mới thì người gọi không đổi biến. Em không nói Java truyền object theo tham chiếu, vì không gán lại được biến của người gọi.</p>`,
      tip: "Nếu họ hỏi tiếp, nói đây là lý do method đổi trạng thái nên sửa chính object đó, còn muốn trả object khác thì return."
    },
    {
      level: "Trung cấp",
      q: "LocalDate khác Instant thế nào khi lưu hồ sơ?",
      html: `<p>LocalDate là ngày lịch, không có giờ và múi, hợp ngày nộp trên biểu mẫu. Instant là một mốc UTC, hợp lúc cán bộ bấm duyệt để đưa vào audit. Dùng LocalDateTime không múi cho cột audit thì báo cáo dễ lệch giữa máy chủ UTC và giờ Việt Nam. Em chốt múi Asia/Ho_Chi_Minh ở biên ngày nghiệp vụ, và lưu mốc kỹ thuật bằng Instant hoặc timestamp có múi.</p>`,
      tip: "Nhắc một case nửa đêm: nộp 00:30 có thể sang ngày mới tùy múi giờ mình đã chốt."
    }
  );

  const spring = before("spring", "Trung cấp", [
    {
      h: "Cơ bản — Một request đi qua những đâu",
      html: `<p>Người dùng gọi <code>GET /ho-so/15</code>. Thứ tự trong ứng dụng Spring Boot web thường là:</p>
      <ol>
        <li>Filter: mã hóa, trace id, xác thực token nếu có.</li>
        <li>DispatcherServlet nhận HTTP và tìm controller khớp method cùng đường dẫn.</li>
        <li>Controller lấy tham số, gọi service, nhận DTO.</li>
        <li>Service kiểm tra quyền và rule, mở transaction, gọi repository.</li>
        <li>Repository chạy SQL.</li>
        <li>Controller trả object, Jackson đổi thành JSON, kèm mã HTTP.</li>
      </ol>
      <p>Controller không chứa câu SQL và không tự quyết “được duyệt hay không” nếu rule đó còn dùng ở chỗ khác. Service không lắp chữ JSON. Repository không biết mã HTTP. Mỗi tầng một việc thì sửa rule không phải lục khắp nơi.</p>`
    },
    {
      h: "Cơ bản — Annotation gặp hàng ngày",
      html: `<ul>
        <li><code>@SpringBootApplication</code>: lớp chạy ứng dụng, bật quét bean và auto-config.</li>
        <li><code>@RestController</code>: lớp nhận HTTP và trả JSON.</li>
        <li><code>@Service</code>: lớp nghiệp vụ.</li>
        <li><code>@Repository</code>: lớp hoặc interface nói chuyện với DB.</li>
        <li><code>@Autowired</code> hoặc constructor: xin bean. Ưu tiên constructor.</li>
        <li><code>@GetMapping</code>, <code>@PostMapping</code>, <code>@PutMapping</code>, <code>@PatchMapping</code>, <code>@DeleteMapping</code>: gắn verb và URL.</li>
        <li><code>@PathVariable</code>, <code>@RequestParam</code>, <code>@RequestBody</code>: lấy dữ liệu từ URL, query, hoặc JSON.</li>
        <li><code>@Valid</code>: chạy Bean Validation trên DTO.</li>
        <li><code>@Transactional</code>: bọc method trong transaction.</li>
      </ul>
      <p>Annotation không tự chạy nếu lớp không được quét thành bean, hoặc nếu gọi method nội bộ trong cùng lớp với những annotation dựa trên proxy như transaction.</p>`
    },
    {
      h: "Cơ bản — Controller tối thiểu",
      html: `<pre><code>@RestController
@RequestMapping("/ho-so")
public class HoSoController {
  private final HoSoService service;

  public HoSoController(HoSoService service) {
    this.service = service;
  }

  @GetMapping("/{id}")
  public HoSoResponse chiTiet(@PathVariable Long id) {
    return service.chiTiet(id);
  }

  @PostMapping
  public HoSoResponse tao(@Valid @RequestBody TaoHoSoRequest request) {
    return service.tao(request);
  }
}</code></pre>
      <p><code>id</code> trên URL là định danh. Body JSON là nội dung tạo mới. <code>@Valid</code> thiếu thì <code>@NotBlank</code> trong request không có tác dụng. Service trả DTO, không trả entity, để Jackson không kéo quan hệ lazy và không lộ cột nội bộ.</p>`
    },
    {
      h: "Cơ bản — Log để hôm sau còn đọc được",
      html: `<p>Dùng SLF4J, không <code>System.out</code>. Mức <code>info</code> cho mốc nghiệp vụ: đã nhận hồ sơ nào. Mức <code>warn</code> cho tình huống lường được nhưng bất thường: gọi đối tác timeout rồi thử lại. Mức <code>error</code> cho việc thất bại cần người đọc log. <code>debug</code> bật khi lần lỗi, không để mặc định trên production vì rất nhiều và có thể lỡ in dữ liệu.</p>
      <pre><code>log.info("Tao ho so ma={} donVi={}", ma, donViId);</code></pre>
      <p>Để tham số trong <code>{}</code>, đừng cộng chuỗi, để khỏi cộng khi mức log đang tắt. Không log mật khẩu, token, số giấy tờ đầy đủ, body nguyên xi của form dân sự. Mỗi request có một trace id thì QA gửi đúng id đó là tìm được dòng log.</p>`
    }
  ]);

  before("spring", "Nâng cao", [
    {
      h: "Trung cấp — Từ bảng tới API của một hồ sơ",
      html: `<p>Một module nhỏ đi bốn lớp. Entity khớp bảng. Repository chỉ tìm và lưu. Service giữ transaction và rule. Controller đổi HTTP thành lời gọi service.</p>
      <pre><code>@Entity
public class HoSo {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String ma;
  private String trangThai;
}

public interface HoSoRepository extends JpaRepository&lt;HoSo, Long&gt; {
  Optional&lt;HoSo&gt; findByMa(String ma);
}</code></pre>
      <p>Service tạo hồ sơ thì kiểm tra mã chưa tồn tại, set trạng thái ban đầu, rồi <code>save</code>. Duyệt hồ sơ thì tải theo id, kiểm tra đúng đơn vị của user, gọi rule chuyển trạng thái, và để transaction commit. Không để controller gọi <code>repository.save</code> thẳng vì mọi chỗ sẽ tự nghĩ ra một cách đổi trạng thái.</p>`
    },
    {
      h: "Trung cấp — Phân trang, không trả cả bảng",
      html: `<p>Danh sách hồ sơ luôn có trang. Spring Data nhận <code>Pageable</code>: số trang, kích thước, cột sắp xếp. <code>Page</code> trả nội dung và tổng số dòng. Tổng số dòng là một câu <code>count</code> thêm, báo cáo lớn sẽ đắt. Nếu màn hình chỉ cần “còn trang sau không” thì dùng <code>Slice</code>, khỏi đếm toàn bộ.</p>
      <p>Không tin kích thước trang client gửi. Có người gọi <code>size=100000</code>. Em chặn trần, ví dụ 100, và chỉ cho sắp xếp các cột đã liệt kê. Cột sort đưa thẳng vào câu lệnh là cánh cửa để chèn SQL. Với lọc nhiều điều kiện, tên method repository sẽ quá dài — chuyển sang một query có tên hoặc Specification, nhưng điều kiện vẫn là tham số, không nối chuỗi.</p>`
    },
    {
      h: "Trung cấp — Entity đang được theo dõi hay đã tách",
      html: `<p>Hibernate không ghi DB ngay khi bạn sửa field. Trong transaction, entity đang được theo dõi (managed). Lúc flush, thường là trước commit, Hibernate so với bản đã đọc và sinh <code>UPDATE</code> cho field đổi. Vì vậy sửa entity rồi quên gọi save vẫn có thể bị ghi.</p>
      <ul>
        <li><strong>Mới:</strong> vừa <code>new</code>, chưa gắn với session.</li>
        <li><strong>Managed:</strong> đã load hoặc đã persist trong session đang mở.</li>
        <li><strong>Detached:</strong> session đã đóng, object còn trong tay bạn. Sửa field không còn được ghi cho đến khi merge lại.</li>
      </ul>
      <p>Open-in-view giữ session tới hết request nên entity vẫn managed cả khi ra khỏi service. Tắt open-in-view thì sang controller là detached, chạm collection lazy sẽ lỗi — và đó là tín hiệu bạn chưa tải đủ dữ liệu trong service.</p>`
    },
    {
      h: "Trung cấp — Nhìn N+1 trên log và cascade",
      html: `<p>Log đúng thì một màn danh sách chỉ nên có rất ít câu SQL. Dấu hiệu N+1:</p>
      <pre><code>select * from ho_so where trang_thai = ?
select * from don_vi where id = ?
select * from don_vi where id = ?
-- lặp lại theo từng hồ sơ</code></pre>
      <p>Câu đầu lấy danh sách, mỗi dòng sau lấy đơn vị vì quan hệ lazy bị chạm trong vòng lặp. Sửa ở chỗ tải dữ liệu, không sửa bằng cách tăng pool connection.</p>
      <p><code>cascade</code> là “làm thao tác này trên cha thì làm luôn trên con”. Cascade persist hợp khi hồ sơ và các dòng chi tiết luôn được lưu cùng nhau. Cascade remove trên quan hệ tới danh mục dùng chung là nguy hiểm: xóa một hồ sơ không được xóa đơn vị. <code>orphanRemoval</code> khác một chút: gỡ dòng chi tiết khỏi hồ sơ thì dòng đó bị xóa, vì nó không có lý do tồn tại một mình. Không bật <code>CascadeType.ALL</code> cho đỡ nghĩ.</p>`
    }
  ]);
  spring.questions.push(
    {
      level: "Cơ bản",
      q: "Một request GET chi tiết hồ sơ đi qua những tầng nào?",
      html: `<p>Filter xử lý trace id và xác thực. DispatcherServlet tìm method controller khớp GET và đường dẫn. Controller lấy id, gọi service. Service kiểm tra quyền trên hồ sơ đó, gọi repository trong transaction đọc. Repository chạy SQL. Kết quả được map thành DTO rồi Jackson thành JSON. Em không để SQL trong controller và không để mã HTTP trong repository.</p>`,
      tip: "Vẽ năm hộp bằng lời. Họ hay hỏi tiếp: validation đứng ở đâu — ở DTO và @Valid, trước khi vào rule trong service."
    },
    {
      level: "Trung cấp",
      q: "Vì sao sửa field entity trong transaction lại thành câu UPDATE dù không gọi save?",
      html: `<p>Entity vừa load đang managed. Hibernate giữ bản gốc, lúc flush thì thấy field đổi và tự viết UPDATE trước commit. save chỉ bắt buộc với entity mới chưa được theo dõi. Em dựa vào điều này có chủ đích trong service, và không sửa entity “cho tiện” ở controller vì open-in-view có thể khiến sửa đó cũng bị ghi.</p>`,
      tip: "Nếu họ hỏi detached: session đóng rồi thì sửa field không còn được flush, phải merge hoặc tải lại trong transaction mới."
    },
    {
      level: "Trung cấp",
      q: "Bạn chặn phân trang thế nào cho API danh sách?",
      html: `<p>Em nhận page và size nhưng khống chế size tối đa. Sort chỉ nhận cột trong danh sách trắng. Page trả về gồm dữ liệu và tổng, nên có thêm một câu đếm. Danh sách rất lớn mà UI chỉ cần trang kế thì em chuyển sang Slice hoặc phân trang theo mốc để khỏi count full bảng. Không cho client tự chọn mọi tên cột sort.</p>`,
      tip: "Một câu về count query bị chậm là điểm cộng, nếu bạn đã từng thấy nó trên log."
    }
  );

  const sql = before("sql", "Trung cấp", [
    {
      h: "Cơ bản — Bảng, kiểu cột và câu ghi",
      html: `<p>Một bảng là một thực thể: hồ sơ, đơn vị, người dùng. Mỗi cột một kiểu. Mỗi dòng một bản ghi.</p>
      <pre><code>create table ho_so (
  id bigint generated always as identity primary key,
  ma varchar(50) not null,
  don_vi_id bigint not null,
  trang_thai varchar(30) not null,
  ngay_nop date not null,
  so_tien numeric(18, 0) not null default 0
);</code></pre>
      <ul>
        <li><code>varchar(n)</code>: chuỗi có trần độ dài. <code>text</code> trên PostgreSQL khi nội dung dài không cố định.</li>
        <li><code>numeric</code>: số chính xác, dùng cho tiền. Không dùng float.</li>
        <li><code>date</code>: ngày. <code>timestamp</code>: ngày giờ.</li>
        <li><code>bigint</code>: id. Identity hoặc sequence để DB tự tăng.</li>
      </ul>
      <p>Oracle không có <code>date</code> thuần như PostgreSQL: kiểu <code>DATE</code> của Oracle gồm cả giờ. Mang thói quen “DATE là nửa đêm” từ hệ này sang hệ kia sẽ lệch báo cáo. <code>INSERT</code> thêm dòng, <code>UPDATE</code> sửa dòng đã có, <code>DELETE</code> xóa. Với hồ sơ đã phát sinh, thường không DELETE mà cập nhật trạng thái hủy.</p>`
    },
    {
      h: "Cơ bản — Lọc, rẽ nhánh và tập hợp",
      html: `<p><code>AND</code> hẹp kết quả, <code>OR</code> nới ra. Thiếu ngoặc thì <code>AND</code> được tính trước <code>OR</code>, dễ ra sai tập hồ sơ. Viết ngoặc đúng ý nghiệp vụ.</p>
      <pre><code>select id, ma,
       case trang_thai
         when 'CHO_DUYET' then 'Cho duyet'
         when 'DA_DUYET' then 'Da duyet'
         else 'Khac'
       end as ten_trang_thai
from ho_so
where don_vi_id = 10
  and ngay_nop between date '2026-09-01' and date '2026-09-30'
  and trang_thai in ('CHO_DUYET', 'DA_DUYET');</code></pre>
      <p><code>LIKE 'HS%'</code> là mã bắt đầu bằng HS. Dấu <code>%</code> thay cụm bất kỳ, dấu <code>_</code> thay một ký tự. <code>IN</code> là thuộc một danh sách. <code>BETWEEN</code> gồm cả hai đầu. <code>DISTINCT</code> gộp các dòng giống hệt nhau, không thay thế cho GROUP BY khi bạn cần đếm.</p>
      <p><code>UNION</code> nối hai kết quả và bỏ dòng trùng, nên có thêm bước so sánh. <code>UNION ALL</code> giữ mọi dòng, rẻ hơn, dùng khi hai vế chắc chắn không trùng hoặc khi trùng vẫn phải đếm.</p>`
    },
    {
      h: "Cơ bản — Truy vấn con",
      html: `<p>Truy vấn con là một SELECT nằm trong SELECT khác. Một giá trị đơn, ví dụ ngày nộp mới nhất, phải trả về đúng một dòng một cột — nhiều hơn sẽ lỗi. Danh sách cho <code>IN</code> được trả nhiều dòng.</p>
      <pre><code>select ma
from ho_so
where don_vi_id in (
  select id from don_vi where tinh = 'HN'
);</code></pre>
      <p>Truy vấn con tương quan là vế trong tham chiếu dòng vế ngoài, nên có thể chạy lặp theo từng hồ sơ. Đọc được nhưng dễ chậm. Nếu chỉ cần “có tồn tại hay không”, <code>EXISTS</code> nói đúng ý hơn <code>IN</code> và tránh bẫy NULL. Nếu cần cột của cả hai bảng, viết JOIN cho dễ đọc.</p>`
    }
  ]);

  before("sql", "Nâng cao", [
    {
      h: "Trung cấp — JOIN làm số đếm bị nhân",
      html: `<p>Hồ sơ 15 có ba dòng phê duyệt. <code>ho_so join phe_duyet</code> ra ba dòng cho cùng hồ sơ đó. <code>count(*)</code> đếm ba, trong khi số hồ sơ là một. Báo cáo “số hồ sơ đã từng trình” sẽ phình nếu đếm sau khi join một-nhiều.</p>
      <pre><code>select h.don_vi_id, count(distinct h.id) as so_ho_so
from ho_so h
join phe_duyet p on p.ho_so_id = h.id
where p.buoc = 'TRUONG_PHONG'
group by h.don_vi_id;</code></pre>
      <p><code>count(distinct h.id)</code> kéo lại đúng số hồ sơ. Cách khác là lọc id hồ sơ bằng <code>EXISTS</code> rồi đếm trên bảng hồ sơ, không nhân dòng. Khi số liệu nghiệm thu lệch, em hỏi câu đếm đang đứng trước hay sau JOIN.</p>`
    },
    {
      h: "Trung cấp — Hai cán bộ sửa cùng một dòng",
      html: `<p>Mức Read Committed không giữ nguyên dòng bạn vừa đọc. Diễn biến không có cột version:</p>
      <ol>
        <li>Cán bộ A đọc hồ sơ trạng thái chờ.</li>
        <li>Cán bộ B đọc cùng hồ sơ, duyệt, commit thành đã duyệt.</li>
        <li>A ghi lại trạng thái chờ vì màn hình của A còn dữ liệu cũ. Ghi đè thành công.</li>
      </ol>
      <p>Đó là mất cập nhật. Thêm cột <code>version</code>. A và B cùng đọc version 3. B cập nhật <code>where id = ? and version = 3</code>, đưa version lên 4. A chạy cùng điều kiện thì số dòng cập nhật bằng 0, ứng dụng báo hồ sơ đã được người khác sửa, mời tải lại. Khóa <code>FOR UPDATE</code> cũng chặn được nhưng giữ khóa lâu hơn, chỉ hợp thao tác rất ngắn.</p>`
    },
    {
      h: "Trung cấp — Một báo cáo đếm theo đơn vị",
      html: `<pre><code>select d.ten,
       count(*) as so_ho_so,
       coalesce(sum(h.so_tien), 0) as tong_tien
from don_vi d
left join ho_so h
  on h.don_vi_id = d.id
 and h.ngay_nop &gt;= date '2026-09-01'
 and h.ngay_nop &lt; date '2026-10-01'
 and h.trang_thai &lt;&gt; 'DA_HUY'
group by d.id, d.ten
having count(h.id) &gt; 0
order by d.ten;</code></pre>
      <p>LEFT JOIN để còn thấy đơn vị nếu sau này bỏ HAVING. Điều kiện của hồ sơ nằm ở ON, nếu không đơn vị không có hồ sơ trong tháng sẽ bị WHERE loại mất. Khoảng ngày là nửa mở: từ ngày 1 đến trước ngày 1 tháng sau, để khỏi lệ thuộc hàm bọc cột và khỏi sót giờ của ngày cuối tháng. <code>coalesce</code> đổi tổng null thành 0 khi đơn vị không có dòng tiền. GROUP BY kèm id đơn vị, không chỉ tên, vì hai đơn vị có thể trùng tên.</p>`
    },
    {
      h: "Trung cấp — Khóa ngoại và ON DELETE",
      html: `<p>Khóa ngoại bắt <code>ho_so.don_vi_id</code> phải là id có thật trong <code>don_vi</code>, trừ khi cột cho phép null. Xóa đơn vị trong khi còn hồ sơ thì DB chặn. Đó là hành vi mình muốn.</p>
      <ul>
        <li><strong>RESTRICT hoặc NO ACTION:</strong> không xóa cha khi còn con.</li>
        <li><strong>CASCADE:</strong> xóa cha thì xóa luôn con. Hợp dòng chi tiết thuộc đúng một hồ sơ. Không hợp đơn vị, danh mục, người dùng.</li>
        <li><strong>SET NULL:</strong> xóa cha thì cột con thành null. Chỉ khi nghiệp vụ cho phép hồ sơ tạm không thuộc đơn vị.</li>
      </ul>
      <p>Index trên cột khóa ngoại. Thiếu index thì mỗi lần xóa hoặc sửa cha, DB phải tìm con bằng cách quét cả bảng hồ sơ. Đặt tên ràng buộc rõ, ví dụ <code>fk_ho_so_don_vi</code>, để log lỗi nói được đang vướng chỗ nào thay vì một mã khó đọc.</p>`
    },
    {
      h: "Trung cấp — View và cách đọc plan ngắn",
      html: `<p>View là câu SELECT được đặt tên. Người gọi view như một bảng. View không tự làm câu chậm thành câu nhanh — DB thường gắn câu của view vào câu bên ngoài rồi mới lập kế hoạch. View hữu ích để giấu cột nhạy cảm hoặc để mọi báo cáo dùng cùng một định nghĩa “hồ sơ đang hiệu lực”.</p>
      <p><code>EXPLAIN</code> cho thấy DB định quét bảng hay đi index, định join kiểu gì, ước lượng bao nhiêu dòng. <code>EXPLAIN ANALYZE</code> chạy câu đó và hiện thời gian thật. Số dòng ước lượng lệch rất xa số dòng thật là dấu hiệu thống kê bảng đã cũ, hoặc điều kiện không như mình tưởng.</p>
      <p>Thứ tự đọc một plan đơn giản: tìm nút đắt nhất, thường là seq scan trên bảng lớn hoặc sort không có index. Rồi đối chiếu với WHERE và ORDER BY. Chưa thấy nút đắt thì chưa thêm index.</p>`
    }
  ]);
  sql.questions.push(
    {
      level: "Cơ bản",
      q: "AND và OR trong cùng một WHERE cần lưu ý gì?",
      html: `<p>AND được xét trước OR nếu không có ngoặc. Câu “hồ sơ của sở A, hoặc sở B nhưng chỉ trong tháng này” rất dễ ra thành mọi hồ sơ của sở A cộng thêm hồ sơ tháng này của sở B. Em đặt ngoặc theo đúng phát biểu của BA, rồi lấy vài dòng mẫu đối chiếu: một hồ sơ đúng, một hồ sơ phải bị loại.</p>`,
      tip: "Đưa một ví dụ hai dòng là thuyết phục hơn đọc lại thứ tự ưu tiên."
    },
    {
      level: "Trung cấp",
      q: "Vì sao đếm hồ sơ sau JOIN sang bảng phê duyệt lại nhiều hơn số hồ sơ?",
      html: `<p>Một hồ sơ có nhiều dòng phê duyệt thì join nhân số dòng. count(*) đếm dòng đã nhân, không đếm hồ sơ. Em dùng count(distinct id hồ sơ), hoặc lọc bằng EXISTS rồi đếm trên bảng hồ sơ. Lúc đối soát báo cáo, em hỏi câu đếm đang đứng trước hay sau join một-nhiều.</p>`,
      tip: "Nêu số cụ thể: 1 hồ sơ, 3 bước duyệt, đếm ra 3."
    },
    {
      level: "Trung cấp",
      q: "ON DELETE CASCADE nên dùng khi nào?",
      html: `<p>Khi dòng con không có ý nghĩa nếu không có cha, ví dụ các mục trong một hồ sơ và hồ sơ đó được phép xóa thật. Không dùng cho đơn vị, danh mục dùng chung, tài khoản. Những quan hệ đó để RESTRICT: còn hồ sơ thì không xóa đơn vị. Xóa nhầm danh mục mà cascade sẽ mất dữ liệu hàng loạt, khó hoàn tác lúc nghiệm thu.</p>`,
      tip: "Nhắc index trên cột khóa ngoại, vì xóa cha phải đi tìm con."
    }
  );
})();
