 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/App.jsx b/App.jsx
new file mode 100644
index 0000000000000000000000000000000000000000..9e6fa29f00e243bfd17df1aa0fe6a776d3e4fd32
--- /dev/null
+++ b/App.jsx
@@ -0,0 +1,205 @@
+const { useEffect, useMemo, useState } = React;
+
+const APP_ID = 'hospital-borrow-return-app';
+const DATA_PREFIX = `/artifacts/${APP_ID}/public/data/`;
+
+const STATUS = {
+  PENDING: 'Chờ duyệt',
+  DEBT: 'Đang nợ',
+  OVERDUE: 'Quá hạn',
+  DONE: 'Hoàn tất',
+};
+
+const MOCK_ITEMS = [
+  { id: 'M001', genericName: 'Paracetamol', brandName: 'Hapacol', strength: '500mg', isPoison: false, isControlled: false },
+  { id: 'M002', genericName: 'Morphin', brandName: 'Morphin Sulfate', strength: '10mg/ml', isPoison: true, isControlled: true },
+  { id: 'M003', genericName: 'Cefotaxim', brandName: 'Cefotaxim', strength: '1g', isPoison: false, isControlled: false },
+];
+
+function padQty(n) {
+  return String(n).padStart(2, '0');
+}
+
+function formatDrugName(item) {
+  return `${item.genericName} (${item.brandName}) ${item.strength}`;
+}
+
+function sortByRule(items) {
+  return [...items].sort((a, b) => {
+    if (a.isPoison !== b.isPoison) return a.isPoison ? -1 : 1;
+    return formatDrugName(a).localeCompare(formatDrugName(b), 'vi');
+  });
+}
+
+function makeOrderId() {
+  const d = new Date();
+  const ds = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
+  return `BR-${ds}-${Math.floor(Math.random() * 9000 + 1000)}`;
+}
+
+function getStatusBadge(status) {
+  if (status === STATUS.OVERDUE) return 'bg-red-100 text-red-700';
+  if (status === STATUS.DONE) return 'bg-green-100 text-green-700';
+  if (status === STATUS.DEBT) return 'bg-amber-100 text-amber-700';
+  return 'bg-slate-100 text-slate-700';
+}
+
+function App() {
+  const [profile, setProfile] = useState({ fullName: '', employeeId: '', phone: '', email: '', department: '', pin: '' });
+  const [selected, setSelected] = useState(MOCK_ITEMS[0].id);
+  const [qty, setQty] = useState(1);
+  const [borrowItems, setBorrowItems] = useState([]);
+  const [orders, setOrders] = useState([]);
+  const [activeOrder, setActiveOrder] = useState(null);
+
+  useEffect(() => {
+    const timer = setInterval(() => {
+      setOrders((prev) => prev.map((o) => {
+        if (o.status === STATUS.DONE || o.status === STATUS.OVERDUE) return o;
+        const overdue = Date.now() - o.createdAt > 48 * 60 * 60 * 1000;
+        return overdue ? { ...o, status: STATUS.OVERDUE } : o;
+      }));
+    }, 30000);
+    return () => clearInterval(timer);
+  }, []);
+
+  const sortedDraft = useMemo(() => sortByRule(borrowItems), [borrowItems]);
+
+  const addItem = () => {
+    const ref = MOCK_ITEMS.find((i) => i.id === selected);
+    if (!ref || qty < 1) return;
+    setBorrowItems((prev) => {
+      const existed = prev.find((x) => x.id === ref.id);
+      if (existed) return prev.map((x) => x.id === ref.id ? { ...x, quantityBorrowed: x.quantityBorrowed + qty, quantityRemaining: x.quantityRemaining + qty } : x);
+      return [...prev, { ...ref, name: formatDrugName(ref), quantityBorrowed: qty, quantityReturned: 0, quantityRemaining: qty }];
+    });
+  };
+
+  const createOrder = () => {
+    if (!profile.fullName || !profile.employeeId || !profile.phone || !profile.department || !profile.pin) {
+      alert('Vui lòng nhập đủ thông tin bắt buộc.');
+      return;
+    }
+    if (borrowItems.length === 0) {
+      alert('Cần ít nhất 1 thuốc/VTYT.');
+      return;
+    }
+    const order = {
+      id: crypto.randomUUID(),
+      orderID: makeOrderId(),
+      borrower: { ...profile },
+      status: STATUS.PENDING,
+      createdAt: Date.now(),
+      dueAt: Date.now() + 48 * 60 * 60 * 1000,
+      items: sortByRule(borrowItems),
+      history: [],
+      dataPath: `${DATA_PREFIX}orders`,
+    };
+    setOrders((prev) => [order, ...prev]);
+    setBorrowItems([]);
+    setActiveOrder(order);
+  };
+
+  const approveOrder = (id) => setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: STATUS.DEBT, approvedAt: Date.now() } : o));
+
+  const returnOne = (id, itemId, amount) => {
+    setOrders((prev) => prev.map((o) => {
+      if (o.id !== id) return o;
+      const items = o.items.map((it) => it.id === itemId ? {
+        ...it,
+        quantityReturned: Math.min(it.quantityBorrowed, it.quantityReturned + amount),
+        quantityRemaining: Math.max(0, it.quantityRemaining - amount),
+      } : it);
+      const done = items.every((it) => it.quantityRemaining === 0);
+      return {
+        ...o,
+        items,
+        status: done ? STATUS.DONE : STATUS.DEBT,
+        history: [...o.history, { at: new Date().toISOString(), itemId, amount }],
+      };
+    }));
+  };
+
+  return (
+    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-4">
+      <header className="bg-white rounded-xl border p-4 flex items-center justify-between">
+        <div>
+          <h1 className="text-xl md:text-2xl font-bold text-blue-800">Quản lý mượn/trả thuốc & VTYT</h1>
+          <p className="text-sm text-slate-600">MVP single-file App.jsx · Data prefix: <code>{DATA_PREFIX}</code></p>
+        </div>
+        <button className="no-print px-3 py-2 rounded bg-blue-600 text-white" onClick={() => window.print()}>In</button>
+      </header>
+
+      <section className="grid md:grid-cols-2 gap-4">
+        <div className="bg-white rounded-xl border p-4 space-y-3">
+          <h2 className="font-semibold text-blue-700">1) Thông tin người mượn</h2>
+          <input className="w-full border rounded px-3 py-2" placeholder="Họ tên *" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} />
+          <div className="grid grid-cols-2 gap-2">
+            <input className="border rounded px-3 py-2" placeholder="MSNV *" value={profile.employeeId} onChange={(e) => setProfile({ ...profile, employeeId: e.target.value })} />
+            <input className="border rounded px-3 py-2" placeholder="SĐT *" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
+          </div>
+          <div className="grid grid-cols-2 gap-2">
+            <input className="border rounded px-3 py-2" placeholder="Email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
+            <input className="border rounded px-3 py-2" placeholder="Khoa/Phòng *" value={profile.department} onChange={(e) => setProfile({ ...profile, department: e.target.value })} />
+          </div>
+          <input className="w-full border rounded px-3 py-2" placeholder="Mã PIN 4-6 số *" value={profile.pin} onChange={(e) => setProfile({ ...profile, pin: e.target.value.replace(/\D/g, '').slice(0, 6) })} />
+        </div>
+
+        <div className="bg-white rounded-xl border p-4 space-y-3">
+          <h2 className="font-semibold text-blue-700">2) Tạo danh sách mượn</h2>
+          <div className="flex gap-2">
+            <select className="flex-1 border rounded px-3 py-2" value={selected} onChange={(e) => setSelected(e.target.value)}>
+              {MOCK_ITEMS.map((i) => <option key={i.id} value={i.id}>{formatDrugName(i)}</option>)}
+            </select>
+            <input type="number" min="1" className="w-24 border rounded px-3 py-2" value={qty} onChange={(e) => setQty(Number(e.target.value || 1))} />
+            <button className="px-3 py-2 rounded bg-blue-600 text-white" onClick={addItem}>Thêm</button>
+          </div>
+
+          <ul className="space-y-2 max-h-48 overflow-auto">
+            {sortedDraft.map((it) => (
+              <li key={it.id} className="border rounded p-2 text-sm flex justify-between">
+                <span>{it.name} {it.isPoison ? '☠️' : ''}</span>
+                <span className="font-semibold">SL: {padQty(it.quantityBorrowed)}</span>
+              </li>
+            ))}
+          </ul>
+
+          <button className="w-full px-3 py-2 rounded bg-emerald-600 text-white font-semibold" onClick={createOrder}>Tạo phiếu mượn</button>
+        </div>
+      </section>
+
+      <section className="bg-white rounded-xl border p-4">
+        <h2 className="font-semibold text-blue-700 mb-3">3) Dashboard phiếu</h2>
+        <div className="space-y-3">
+          {orders.map((o) => (
+            <div key={o.id} className="border rounded p-3">
+              <div className="flex flex-wrap justify-between gap-2 mb-2">
+                <button className="font-semibold text-left" onClick={() => setActiveOrder(o)}>{o.orderID} · {o.borrower.department}</button>
+                <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadge(o.status)}`}>{o.status}</span>
+              </div>
+              <div className="text-xs text-slate-600">Người mượn: {o.borrower.fullName} · SĐT: {o.borrower.phone}</div>
+              <div className="mt-2 flex gap-2 no-print">
+                {o.status === STATUS.PENDING && <button className="px-2 py-1 rounded bg-blue-600 text-white text-xs" onClick={() => approveOrder(o.id)}>Duyệt</button>}
+                {o.status !== STATUS.DONE && o.items[0] && <button className="px-2 py-1 rounded bg-amber-600 text-white text-xs" onClick={() => returnOne(o.id, o.items[0].id, 1)}>Trả mẫu +1</button>}
+              </div>
+            </div>
+          ))}
+          {orders.length === 0 && <p className="text-sm text-slate-500">Chưa có phiếu.</p>}
+        </div>
+      </section>
+
+      {activeOrder && (
+        <section className="bg-white rounded-xl border p-4">
+          <h2 className="font-semibold text-blue-700 mb-2">Chi tiết: {activeOrder.orderID}</h2>
+          <ul className="space-y-1 text-sm">
+            {activeOrder.items.map((it) => (
+              <li key={it.id}>{it.name}: mượn {padQty(it.quantityBorrowed)} · đã trả {padQty(it.quantityReturned)} · còn nợ {padQty(it.quantityRemaining)}</li>
+            ))}
+          </ul>
+        </section>
+      )}
+    </div>
+  );
+}
+
+ReactDOM.createRoot(document.getElementById('root')).render(<App />);
 
EOF
)
