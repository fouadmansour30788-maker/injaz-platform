import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const supabase = SUPABASE_URL ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD || "bouche2024";
const DEMO = !SUPABASE_URL;

const C = {
  bg: "#FDF6F0", bgAlt: "#F5EAE0", card: "#FFFFFF",
  primary: "#C8855A", primaryDark: "#A86840", primaryLight: "#F5E6DA",
  accent: "#D4A853", text: "#3D1F0D", muted: "#9E7B6B",
  light: "#C4A090", border: "#EDD9C8", borderLight: "#F7EEE8",
  green: "#27AE60", red: "#E53E3E",
};

const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.bg}; font-family: 'DM Sans', sans-serif; color: ${C.text}; min-height: 100vh; -webkit-font-smoothing: antialiased; }
  button { font-family: 'DM Sans', sans-serif; cursor: pointer; border: none; }
  input, textarea, select { font-family: 'DM Sans', sans-serif; }
  .card { background: ${C.card}; border-radius: 16px; border: 1px solid ${C.border}; }
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; font-weight: 600; transition: all .18s; cursor: pointer; }
  .btn-primary { background: ${C.primary}; color: #fff; padding: 12px 24px; border-radius: 12px; font-size: 14px; }
  .btn-primary:hover:not(:disabled) { background: ${C.primaryDark}; transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }
  .btn-ghost { background: transparent; color: ${C.primary}; padding: 10px 20px; border-radius: 10px; border: 1.5px solid ${C.primary}; font-size: 14px; }
  .btn-ghost:hover { background: ${C.primaryLight}; }
  .input { width: 100%; padding: 12px 16px; border: 1.5px solid ${C.border}; border-radius: 12px; font-size: 14px; color: ${C.text}; background: #fff; outline: none; transition: border-color .18s; }
  .input:focus { border-color: ${C.primary}; box-shadow: 0 0 0 3px rgba(200,133,90,0.1); }
  .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; white-space: nowrap; }
  .overlay { position: fixed; inset: 0; background: rgba(61,31,13,0.45); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 16px; backdrop-filter: blur(3px); }
  .drawer { position: fixed; right: 0; top: 0; bottom: 0; width: min(420px, 100vw); background: #fff; z-index: 200; box-shadow: -8px 0 32px rgba(61,31,13,0.12); display: flex; flex-direction: column; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
  @keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
  @keyframes slideRight { from { transform: translateX(100%); } to { transform: none; } }
  @keyframes spin { to { transform: rotate(360deg); } }
  .fade-up { animation: fadeUp .3s ease both; }
  .fade-in { animation: fadeIn .25s ease both; }
  .slide-in { animation: slideRight .28s cubic-bezier(.22,.68,0,1.2) both; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }
  @media (max-width: 640px) { .grid-2 { grid-template-columns: 1fr !important; } }
`;

if (typeof document !== "undefined") {
  const s = document.createElement("style");
  s.textContent = GLOBAL_CSS;
  document.head.appendChild(s);
}

const DEMO_CATEGORIES = [
  { id: "c1", name: "Pastries", icon: "🥐", sort_order: 1 },
  { id: "c2", name: "Cakes", icon: "🎂", sort_order: 2 },
  { id: "c3", name: "Desserts", icon: "🍮", sort_order: 3 },
  { id: "c4", name: "Drinks", icon: "☕", sort_order: 4 },
  { id: "c5", name: "Savory", icon: "🥪", sort_order: 5 },
];

const DEMO_ITEMS = [
  { id: "i1",  category_id: "c1", name: "Butter Croissant",    description: "Classic flaky croissant, freshly baked every morning",                  price: 3.50, emoji: "🥐", available: true, featured: true  },
  { id: "i2",  category_id: "c1", name: "Pain au Chocolat",     description: "Buttery puff pastry filled with dark Belgian chocolate",                price: 4.00, emoji: "🍫", available: true, featured: true  },
  { id: "i3",  category_id: "c1", name: "Almond Croissant",     description: "Twice-baked croissant with frangipane cream and toasted almonds",     price: 4.50, emoji: "🌾", available: true, featured: false },
  { id: "i4",  category_id: "c1", name: "Eclair au Cafe",       description: "Choux pastry filled with coffee cream, topped with coffee glaze",     price: 5.00, emoji: "✨", available: true, featured: true  },
  { id: "i5",  category_id: "c1", name: "Mille-Feuille",        description: "Layers of puff pastry with vanilla creme patissiere",                price: 6.00, emoji: "🥧", available: true, featured: false },
  { id: "i6",  category_id: "c2", name: "Fraisier Cake",        description: "Genoise sponge with fresh strawberries and mousseline cream",        price: 8.00, emoji: "🍓", available: true, featured: true  },
  { id: "i7",  category_id: "c2", name: "Opera Cake",           description: "Coffee-soaked almond sponge layered with chocolate ganache",         price: 7.50, emoji: "🎭", available: true, featured: false },
  { id: "i8",  category_id: "c2", name: "Tarte au Citron",      description: "Crisp tart shell with silky lemon curd and Italian meringue",       price: 6.50, emoji: "🍋", available: true, featured: true  },
  { id: "i9",  category_id: "c3", name: "Creme Brulee",         description: "Velvety vanilla custard with a caramelized sugar crust",            price: 5.50, emoji: "🍮", available: true, featured: false },
  { id: "i10", category_id: "c3", name: "Macaron Box (6)",      description: "Assorted French macarons - classic and seasonal flavors",           price: 9.00, emoji: "🎨", available: true, featured: true  },
  { id: "i11", category_id: "c3", name: "Profiteroles (3)",     description: "Choux puffs with vanilla ice cream, drizzled with hot chocolate",  price: 6.00, emoji: "🍦", available: true, featured: false },
  { id: "i12", category_id: "c4", name: "Cafe Latte",           description: "Double espresso with steamed milk and latte art",                   price: 4.00, emoji: "☕", available: true, featured: false },
  { id: "i13", category_id: "c4", name: "Matcha Latte",         description: "Ceremonial grade matcha with oat milk",                            price: 4.50, emoji: "🍵", available: true, featured: true  },
  { id: "i14", category_id: "c4", name: "Fresh Lemonade",       description: "Cold-pressed lemon with sparkling water and mint",                  price: 3.50, emoji: "🍋", available: true, featured: false },
  { id: "i15", category_id: "c4", name: "Hot Chocolate",        description: "Rich Valrhona dark chocolate with steamed milk",                   price: 4.50, emoji: "🍫", available: true, featured: false },
  { id: "i16", category_id: "c5", name: "Croque Monsieur",      description: "Toasted brioche with ham, bechamel and melted Gruyere",            price: 7.00, emoji: "🥪", available: true, featured: false },
  { id: "i17", category_id: "c5", name: "Quiche Lorraine",      description: "Buttery shortcrust pastry with cream, bacon and Gruyere",          price: 7.50, emoji: "🥧", available: true, featured: true  },
];

const db = {
  async getCategories() {
    if (DEMO) return DEMO_CATEGORIES;
    const { data } = await supabase.from("categories").select("*").eq("active", true).order("sort_order");
    return data || [];
  },
  async getMenuItems() {
    if (DEMO) return DEMO_ITEMS;
    const { data } = await supabase.from("menu_items").select("*").order("sort_order");
    return data || [];
  },
  async createOrder(order) {
    if (DEMO) return { id: "DEMO" + Date.now().toString().slice(-6), ...order };
    const { data, error } = await supabase.from("orders").insert({
      order_type: order.order_type, customer_name: order.customer_name,
      customer_phone: order.customer_phone, customer_address: order.customer_address || null,
      table_number: order.table_number || null, notes: order.notes || null,
      total: order.total, status: "pending",
    }).select().single();
    if (error) throw error;
    await supabase.from("order_items").insert(order.items.map(i => ({
      order_id: data.id, item_id: i.id, item_name: i.name, item_price: i.price,
      quantity: i.quantity, subtotal: parseFloat((i.price * i.quantity).toFixed(2)),
    })));
    return data;
  },
  async getOrders() {
    if (DEMO) return [];
    const { data } = await supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
    return data || [];
  },
  async updateOrderStatus(id, status) {
    if (DEMO) return;
    await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  },
  async createMenuItem(item) {
    if (DEMO) return;
    const { error } = await supabase.from("menu_items").insert(item);
    if (error) throw error;
  },
  async updateMenuItem(id, updates) {
    if (DEMO) return;
    const { error } = await supabase.from("menu_items").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) throw error;
  },
  async deleteMenuItem(id) {
    if (DEMO) return;
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) throw error;
  },
  async createCategory(cat) {
    if (DEMO) return;
    const { error } = await supabase.from("categories").insert(cat);
    if (error) throw error;
  },
};

const ToastCtx = createContext(null);
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((msg, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  }, []);
  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 999, display: "flex", flexDirection: "column-reverse", gap: 8, alignItems: "center", pointerEvents: "none" }}>
        {toasts.map(t => (
          <div key={t.id} className="fade-up" style={{ background: t.type === "error" ? C.red : t.type === "warning" ? "#E67E22" : C.green, color: "#fff", padding: "11px 22px", borderRadius: 40, fontSize: 14, fontWeight: 600, boxShadow: "0 4px 20px rgba(0,0,0,0.18)", whiteSpace: "nowrap" }}>{t.msg}</div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
const useToast = () => useContext(ToastCtx);

const CartCtx = createContext(null);
function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const add = useCallback((item) => {
    setItems(prev => {
      const ex = prev.find(i => i.id === item.id);
      if (ex) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);
  const remove = useCallback((id) => setItems(prev => prev.filter(i => i.id !== id)), []);
  const update = useCallback((id, qty) => {
    if (qty < 1) { remove(id); return; }
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  }, [remove]);
  const clear = useCallback(() => setItems([]), []);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);
  return <CartCtx.Provider value={{ items, add, remove, update, clear, total, count }}>{children}</CartCtx.Provider>;
}
const useCart = () => useContext(CartCtx);

function Spinner({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ animation: "spin 0.9s linear infinite", flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeDasharray="40" strokeDashoffset="15" />
    </svg>
  );
}

function CloseBtn({ onClick }) {
  return <button className="btn" onClick={onClick} style={{ background: C.bgAlt, color: C.muted, borderRadius: "50%", width: 36, height: 36, fontSize: 20, flexShrink: 0 }}>×</button>;
}

function Header({ onCartOpen }) {
  const { count } = useCart();
  return (
    <header style={{ background: "#fff", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px", height: 66, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: C.primary, letterSpacing: 0.5, lineHeight: 1.1 }}>Bouche Sucree</div>
          <div style={{ fontSize: 10, color: C.light, letterSpacing: 2.5, textTransform: "uppercase" }}>Patisserie & Cafe - Beirut</div>
        </div>
        <button className="btn" onClick={onCartOpen} style={{ background: count > 0 ? C.primary : "#fff", color: count > 0 ? "#fff" : C.primary, border: `1.5px solid ${count > 0 ? C.primary : C.border}`, padding: "10px 18px", borderRadius: 40, fontSize: 14, transition: "all .2s" }}>
          <span>🛒</span>
          <span style={{ fontWeight: 700 }}>Cart</span>
          {count > 0 && <span style={{ background: "#fff", color: C.primary, borderRadius: "50%", width: 22, height: 22, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0 }}>{count}</span>}
        </button>
      </div>
    </header>
  );
}

function CategoryTabs({ categories, selected, onSelect }) {
  const tabs = [{ id: "all", name: "All", icon: "✦" }, ...categories];
  return (
    <div style={{ overflowX: "auto", padding: "0 20px", display: "flex", gap: 8, scrollbarWidth: "none" }}>
      {tabs.map(c => (
        <button key={c.id} className="btn" onClick={() => onSelect(c.id)} style={{ padding: "9px 18px", borderRadius: 40, fontSize: 13, whiteSpace: "nowrap", background: selected === c.id ? C.primary : "#fff", color: selected === c.id ? "#fff" : C.muted, border: `1.5px solid ${selected === c.id ? C.primary : C.border}`, fontWeight: selected === c.id ? 700 : 500, flexShrink: 0 }}>
          {c.icon && <span>{c.icon} </span>}{c.name}
        </button>
      ))}
    </div>
  );
}

function MenuItemCard({ item }) {
  const { add } = useCart();
  const { show } = useToast();
  const [flash, setFlash] = useState(false);
  const handleAdd = () => {
    if (!item.available) return;
    add(item); show(`${item.name} added to cart`);
    setFlash(true); setTimeout(() => setFlash(false), 1200);
  };
  return (
    <div className="card" style={{ padding: "18px 20px", display: "flex", gap: 16, alignItems: "flex-start", opacity: item.available ? 1 : 0.5 }}>
      <div style={{ width: 68, height: 68, borderRadius: 14, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, flexShrink: 0 }}>{item.emoji || "🍽️"}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 3 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.text, lineHeight: 1.3 }}>{item.name}</div>
          {item.featured && <span className="badge" style={{ background: C.primaryLight, color: C.primaryDark, flexShrink: 0 }}>★ Popular</span>}
        </div>
        <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 12, lineHeight: 1.55 }}>{item.description}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: C.primary }}>${item.price.toFixed(2)}</div>
          {item.available
            ? <button className="btn btn-primary" onClick={handleAdd} style={{ padding: "8px 16px", fontSize: 13, background: flash ? C.green : C.primary }}>{flash ? "✓ Added" : "+ Add"}</button>
            : <span className="badge" style={{ background: C.bgAlt, color: C.light }}>Unavailable</span>}
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ onClose, onCheckout }) {
  const { items, remove, update, total, count } = useCart();
  return (
    <>
      <div style={{ position: "fixed", inset: 0, background: "rgba(61,31,13,0.3)", zIndex: 199 }} onClick={onClose} />
      <div className="drawer slide-in">
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: C.text }}>Your Cart {count > 0 && <span style={{ color: C.muted, fontWeight: 400, fontSize: 14 }}>({count})</span>}</div>
          <CloseBtn onClick={onClose} />
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {items.length === 0
            ? <div style={{ textAlign: "center", padding: "64px 0", color: C.muted }}><div style={{ fontSize: 52, marginBottom: 12 }}>🛒</div><div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Your cart is empty</div><div style={{ fontSize: 13 }}>Add something delicious!</div></div>
            : items.map(item => (
              <div key={item.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "13px 0", borderBottom: `1px solid ${C.borderLight}` }}>
                <div style={{ fontSize: 26, width: 36, textAlign: "center" }}>{item.emoji || "🍽️"}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: C.text, marginBottom: 2 }}>{item.name}</div>
                  <div style={{ fontSize: 13, color: C.primary, fontWeight: 700 }}>${item.price.toFixed(2)}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button className="btn" onClick={() => update(item.id, item.quantity - 1)} style={{ width: 28, height: 28, borderRadius: "50%", background: C.bgAlt, color: C.text, fontSize: 16 }}>−</button>
                  <span style={{ fontWeight: 700, minWidth: 18, textAlign: "center", fontSize: 15 }}>{item.quantity}</span>
                  <button className="btn" onClick={() => update(item.id, item.quantity + 1)} style={{ width: 28, height: 28, borderRadius: "50%", background: C.primary, color: "#fff", fontSize: 16 }}>+</button>
                </div>
                <button className="btn" onClick={() => remove(item.id)} style={{ color: C.light, background: "transparent", fontSize: 20, padding: 2, flexShrink: 0 }}>×</button>
              </div>
            ))}
        </div>
        {items.length > 0 && (
          <div style={{ padding: "20px 24px", borderTop: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 15, color: C.muted }}>Total</span>
              <span style={{ fontWeight: 800, fontSize: 22, color: C.text }}>${total.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary" onClick={onCheckout} style={{ width: "100%", padding: "15px", fontSize: 15 }}>Checkout →</button>
          </div>
        )}
      </div>
    </>
  );
}

const ORDER_TYPES = [
  { id: "dine_in",  label: "Dine In",  icon: "🍽️", desc: "Enjoy your meal at our cafe" },
  { id: "takeaway", label: "Takeaway", icon: "🥡", desc: "Pick up your order at the counter" },
  { id: "delivery", label: "Delivery", icon: "🛵", desc: "We deliver to your door" },
];

function StepIndicator({ current }) {
  const steps = ["Order Type", "Your Details", "Confirm"];
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "20px 28px 0" }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 60 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", fontSize: 13, fontWeight: 700, background: current > i + 1 ? C.green : current === i + 1 ? C.primary : C.borderLight, color: current >= i + 1 ? "#fff" : C.light, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}>{current > i + 1 ? "✓" : i + 1}</div>
            <div style={{ fontSize: 10, color: current === i + 1 ? C.primary : C.muted, marginTop: 5, fontWeight: current === i + 1 ? 700 : 400, textAlign: "center" }}>{s}</div>
          </div>
          {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: current > i + 1 ? C.green : C.borderLight, margin: "0 4px", marginBottom: 16, transition: "background .2s" }} />}
        </div>
      ))}
    </div>
  );
}

function CheckoutModal({ onClose, onSuccess }) {
  const { items, total, clear } = useCart();
  const { show } = useToast();
  const [step, setStep] = useState(1);
  const [orderType, setOrderType] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", address: "", table: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const validateStep2 = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (orderType === "delivery" && !form.address.trim()) e.address = "Delivery address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const order = await db.createOrder({ order_type: orderType, customer_name: form.name.trim(), customer_phone: form.phone.trim(), customer_address: form.address.trim() || null, table_number: form.table.trim() || null, notes: form.notes.trim() || null, total, items });
      clear(); onSuccess(order);
    } catch (e) { show("Failed to place order. Please try again.", "error"); }
    finally { setLoading(false); }
  };
  const Field = ({ label, required, error, children }) => (
    <div>
      <label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>{label}{required && <span style={{ color: C.red }}> *</span>}</label>
      {children}
      {error && <div style={{ fontSize: 12, color: C.red, marginTop: 4 }}>{error}</div>}
    </div>
  );
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="card fade-in" style={{ width: "100%", maxWidth: 500, maxHeight: "92vh", overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 22, color: C.text }}>Checkout</div>
          <CloseBtn onClick={onClose} />
        </div>
        <StepIndicator current={step} />
        <div style={{ padding: "24px 28px 28px" }}>
          {step === 1 && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.muted, marginBottom: 18 }}>How would you like your order?</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {ORDER_TYPES.map(t => (
                  <button key={t.id} className="btn" onClick={() => setOrderType(t.id)} style={{ padding: "16px 20px", borderRadius: 14, justifyContent: "flex-start", gap: 14, border: `2px solid ${orderType === t.id ? C.primary : C.border}`, background: orderType === t.id ? C.primaryLight : "#fff", textAlign: "left" }}>
                    <span style={{ fontSize: 30, flexShrink: 0 }}>{t.icon}</span>
                    <div style={{ flex: 1 }}><div style={{ fontWeight: 700, color: C.text, fontSize: 15 }}>{t.label}</div><div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{t.desc}</div></div>
                    {orderType === t.id && <span style={{ color: C.primary, fontSize: 20, flexShrink: 0 }}>✓</span>}
                  </button>
                ))}
              </div>
              <button className="btn btn-primary" onClick={() => orderType && setStep(2)} disabled={!orderType} style={{ marginTop: 20, width: "100%", padding: "14px", fontSize: 15, opacity: orderType ? 1 : 0.45 }}>Continue →</button>
            </div>
          )}
          {step === 2 && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.muted, marginBottom: 18 }}>Fill in your details below</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Field label="Full Name" required error={errors.name}><input className="input" value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: "" })); }} placeholder="Your full name" /></Field>
                <Field label="Phone Number" required error={errors.phone}><input className="input" value={form.phone} type="tel" onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); setErrors(er => ({ ...er, phone: "" })); }} placeholder="+961 XX XXX XXX" /></Field>
                {orderType === "dine_in" && <Field label="Table Number"><input className="input" value={form.table} onChange={e => setForm(f => ({ ...f, table: e.target.value }))} placeholder="e.g. Table 5" /></Field>}
                {orderType === "delivery" && <Field label="Delivery Address" required error={errors.address}><textarea className="input" rows={3} value={form.address} onChange={e => { setForm(f => ({ ...f, address: e.target.value })); setErrors(er => ({ ...er, address: "" })); }} placeholder="Street, building, floor, area..." style={{ resize: "none" }} /></Field>}
                <Field label="Special Notes (optional)"><textarea className="input" rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Allergies, special requests..." style={{ resize: "none" }} /></Field>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button className="btn btn-ghost" onClick={() => setStep(1)} style={{ flex: 1, padding: "13px" }}>← Back</button>
                <button className="btn btn-primary" onClick={() => validateStep2() && setStep(3)} style={{ flex: 2, padding: "13px", fontSize: 15 }}>Review Order →</button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.muted, marginBottom: 18 }}>Review your order before confirming</div>
              <div style={{ background: C.bgAlt, borderRadius: 14, padding: "16px 18px", marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.primary, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Order Items</div>
                {items.map(i => <div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "5px 0", borderBottom: `1px solid ${C.borderLight}` }}><span>{i.quantity}x {i.name}</span><span style={{ fontWeight: 600 }}>${(i.price * i.quantity).toFixed(2)}</span></div>)}
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 17, marginTop: 12, paddingTop: 4 }}><span>Total</span><span style={{ color: C.primary }}>${total.toFixed(2)}</span></div>
              </div>
              <div style={{ background: C.bgAlt, borderRadius: 14, padding: "14px 18px", marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.primary, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Details</div>
                {[["Order Type", ORDER_TYPES.find(t => t.id === orderType)?.label],["Name",form.name],["Phone",form.phone],form.table&&["Table",form.table],form.address&&["Address",form.address],form.notes&&["Notes",form.notes]].filter(Boolean).map(([k,v]) => <div key={k} style={{ fontSize: 13, color: C.muted, marginBottom: 5 }}>{k}: <strong style={{ color: C.text }}>{v}</strong></div>)}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-ghost" onClick={() => setStep(2)} style={{ flex: 1, padding: "13px" }}>← Back</button>
                <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ flex: 2, padding: "13px", fontSize: 15 }}>{loading ? <><Spinner size={16} color="#fff" /> Placing...</> : "Place Order ✓"}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OrderConfirmation({ order, onClose }) {
  return (
    <div className="overlay">
      <div className="card fade-in" style={{ width: "100%", maxWidth: 400, padding: "44px 32px", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700, color: C.primary, marginBottom: 8 }}>Order Placed!</div>
        <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 28 }}>Thank you! We are preparing your order with care.</div>
        {order?.id && (
          <div style={{ background: C.primaryLight, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 20px", marginBottom: 28 }}>
            <div style={{ fontSize: 11, color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Order Number</div>
            <div style={{ fontWeight: 800, fontSize: 24, color: C.primary, letterSpacing: 3 }}>#{String(order.id).slice(-6).toUpperCase()}</div>
          </div>
        )}
        {DEMO && <div style={{ fontSize: 12, color: C.muted, marginBottom: 20, fontStyle: "italic" }}>Demo mode - order not saved to database</div>}
        <button className="btn btn-primary" onClick={onClose} style={{ width: "100%", padding: "14px", fontSize: 15 }}>Continue Browsing</button>
      </div>
    </div>
  );
}

function CustomerApp() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCat, setSelectedCat] = useState("all");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([db.getCategories(), db.getMenuItems()])
      .then(([cats, its]) => { setCategories(cats); setItems(its); })
      .finally(() => setLoading(false));
  }, []);
  const filtered = selectedCat === "all" ? items : items.filter(i => i.category_id === selectedCat);
  const featured = items.filter(i => i.featured && i.available).slice(0, 3);
  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      <Header onCartOpen={() => setCartOpen(true)} />
      <div style={{ background: "linear-gradient(135deg, #FDF0E8 0%, #F8E4CF 60%, #F2D8BE 100%)", padding: "52px 20px", textAlign: "center", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ fontSize: 11, color: C.primary, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>Artisan Patisserie</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: 14 }}>Crafted with Passion,<br />Served with Love</div>
          <div style={{ fontSize: 15, color: C.muted, lineHeight: 1.75, marginBottom: 24 }}>Freshly made pastries, celebration cakes, and cafe favorites. Order for dine-in, takeaway, or delivery.</div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {ORDER_TYPES.map(t => <span key={t.id} style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 40, padding: "7px 16px", fontSize: 13, color: C.text }}>{t.icon} {t.label}</span>)}
          </div>
          {DEMO && <div style={{ marginTop: 20, background: "rgba(200,133,90,0.1)", border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 18px", display: "inline-block", fontSize: 12, color: C.primaryDark }}>Demo Mode - Connect Supabase to enable live ordering</div>}
        </div>
      </div>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {!loading && featured.length > 0 && (
          <div style={{ padding: "36px 20px 0" }}>
            <div style={{ fontSize: 11, color: C.primary, letterSpacing: 2.5, textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>Customer Favorites</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
              {featured.map(item => <MenuItemCard key={item.id} item={item} />)}
            </div>
          </div>
        )}
        <div style={{ padding: "36px 0 80px" }}>
          <div style={{ padding: "0 20px", marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: C.primary, letterSpacing: 2.5, textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Our Menu</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: C.text }}>Browse & Order</div>
          </div>
          {loading
            ? <div style={{ display: "flex", justifyContent: "center", padding: 80 }}><Spinner size={36} color={C.primary} /></div>
            : <>
                <div style={{ marginBottom: 24 }}><CategoryTabs categories={categories} selected={selectedCat} onSelect={setSelectedCat} /></div>
                {filtered.length === 0
                  ? <div style={{ textAlign: "center", padding: "60px 20px", color: C.muted }}>No items in this category yet.</div>
                  : <div style={{ padding: "0 20px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>{filtered.map(item => <MenuItemCard key={item.id} item={item} />)}</div>}
              </>}
        </div>
      </div>
      <footer style={{ borderTop: `1px solid ${C.border}`, background: "#fff", padding: "28px 20px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: C.primary, fontWeight: 700, marginBottom: 4 }}>Bouche Sucree</div>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>Patisserie & Cafe - Beirut, Lebanon</div>
        <a href="https://www.instagram.com/bouchesucree/" target="_blank" rel="noreferrer" style={{ fontSize: 12, color: C.primary, textDecoration: "none" }}>@bouchesucree on Instagram</a>
        <div style={{ marginTop: 20, borderTop: `1px solid ${C.borderLight}`, paddingTop: 16 }}><a href="?admin=1" style={{ fontSize: 11, color: C.light, textDecoration: "none" }}>Staff Portal</a></div>
      </footer>
      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} />}
      {checkoutOpen && <CheckoutModal onClose={() => setCheckoutOpen(false)} onSuccess={order => { setCheckoutOpen(false); setConfirmedOrder(order); }} />}
      {confirmedOrder && <OrderConfirmation order={confirmedOrder} onClose={() => setConfirmedOrder(null)} />}
    </div>
  );
}

const STATUS_META = {
  pending:   { bg: "#FEF3C7", color: "#92400E", label: "Pending",   next: ["confirmed", "cancelled"] },
  confirmed: { bg: "#DBEAFE", color: "#1E40AF", label: "Confirmed", next: ["preparing", "cancelled"] },
  preparing: { bg: "#E0E7FF", color: "#3730A3", label: "Preparing", next: ["ready", "cancelled"] },
  ready:     { bg: "#D1FAE5", color: "#065F46", label: "Ready",     next: ["completed"] },
  completed: { bg: "#F3F4F6", color: "#374151", label: "Completed", next: [] },
  cancelled: { bg: "#FEE2E2", color: "#991B1B", label: "Cancelled", next: [] },
};

function AdminLogin({ onLogin }) {
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const submit = (e) => { e.preventDefault(); if (pass === ADMIN_PASS) onLogin(); else { setErr("Incorrect password."); setPass(""); } };
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="card fade-in" style={{ width: "100%", maxWidth: 380, padding: "44px 36px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: C.primary, marginBottom: 4 }}>Bouche Sucree</div>
        <div style={{ fontSize: 12, color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 36 }}>Staff Portal</div>
        <form onSubmit={submit}>
          <input className="input" type="password" placeholder="Enter admin password" value={pass} onChange={e => { setPass(e.target.value); setErr(""); }} style={{ marginBottom: 12 }} autoFocus />
          {err && <div style={{ fontSize: 13, color: C.red, marginBottom: 12, textAlign: "left" }}>{err}</div>}
          <button className="btn btn-primary" type="submit" style={{ width: "100%", padding: "13px", marginTop: 4 }}>Sign In</button>
        </form>
        <a href="?" style={{ display: "block", marginTop: 20, fontSize: 13, color: C.muted, textDecoration: "none" }}>Back to Menu</a>
      </div>
    </div>
  );
}

function OrderCard({ order, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);
  const meta = STATUS_META[order.status] || STATUS_META.pending;
  const typeMap = { dine_in: "Dine In", takeaway: "Takeaway", delivery: "Delivery" };
  return (
    <div className="card" style={{ padding: "18px 20px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: C.text }}>#{String(order.id).slice(-6).toUpperCase()}</div>
            <span className="badge" style={{ background: meta.bg, color: meta.color }}>{meta.label}</span>
            <span className="badge" style={{ background: C.primaryLight, color: C.primaryDark }}>{typeMap[order.order_type] || order.order_type}</span>
          </div>
          <div style={{ fontSize: 13, color: C.text, fontWeight: 600, marginBottom: 2 }}>{order.customer_name}</div>
          <div style={{ fontSize: 12, color: C.muted }}>{order.customer_phone}</div>
          {order.table_number && <div style={{ fontSize: 12, color: C.muted }}>Table: {order.table_number}</div>}
          {order.customer_address && <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Address: {order.customer_address}</div>}
          {order.notes && <div style={{ fontSize: 12, color: C.muted, fontStyle: "italic", marginTop: 2 }}>Notes: {order.notes}</div>}
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: C.primary, marginBottom: 2 }}>${parseFloat(order.total).toFixed(2)}</div>
          <div style={{ fontSize: 11, color: C.light }}>{new Date(order.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</div>
          <button className="btn" onClick={() => setExpanded(v => !v)} style={{ fontSize: 11, color: C.primary, background: C.primaryLight, padding: "4px 10px", borderRadius: 8, marginTop: 6 }}>{expanded ? "Hide" : "Items"}</button>
        </div>
      </div>
      {expanded && order.order_items?.length > 0 && (
        <div style={{ marginTop: 14, borderTop: `1px solid ${C.borderLight}`, paddingTop: 14 }}>
          {order.order_items.map((i, idx) => <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0" }}><span>{i.quantity}x {i.item_name}</span><span style={{ color: C.muted }}>${parseFloat(i.subtotal).toFixed(2)}</span></div>)}
        </div>
      )}
      {meta.next.length > 0 && (
        <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
          {meta.next.map(s => { const sm = STATUS_META[s]; return <button key={s} className="btn" onClick={() => onStatusChange(order.id, s)} style={{ padding: "7px 16px", borderRadius: 10, fontSize: 12, background: sm.bg, color: sm.color, border: "none", fontWeight: 600 }}>Mark {sm.label}</button>; })}
        </div>
      )}
    </div>
  );
}

function OrdersPanel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("active");
  const { show } = useToast();
  const load = useCallback(async () => {
    try { const data = await db.getOrders(); setOrders(data); }
    catch { show("Could not load orders", "error"); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (!supabase) return;
    const ch = supabase.channel("admin-orders").on("postgres_changes", { event: "*", schema: "public", table: "orders" }, load).subscribe();
    return () => supabase.removeChannel(ch);
  }, [load]);
  const handleStatus = async (id, status) => {
    await db.updateOrderStatus(id, status);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    show(`Order marked as ${STATUS_META[status]?.label}`);
  };
  const ACTIVE = ["pending", "confirmed", "preparing", "ready"];
  const filtered = filter === "active" ? orders.filter(o => ACTIVE.includes(o.status)) : filter === "completed" ? orders.filter(o => ["completed","cancelled"].includes(o.status)) : orders;
  const counts = { active: orders.filter(o => ACTIVE.includes(o.status)).length, completed: orders.filter(o => ["completed","cancelled"].includes(o.status)).length, all: orders.length };
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12, marginBottom: 24 }}>
        {[{label:"Active Orders",value:counts.active,color:C.primary},{label:"Completed Today",value:counts.completed,color:C.green},{label:"Total Orders",value:counts.all,color:C.muted}].map(s => <div key={s.label} className="card" style={{ padding: "16px 20px" }}><div style={{ fontWeight: 800, fontSize: 26, color: s.color }}>{s.value}</div><div style={{ fontSize: 12, color: C.muted }}>{s.label}</div></div>)}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
        {[["active","Active"],["completed","Completed"],["all","All"]].map(([v,l]) => <button key={v} className="btn" onClick={() => setFilter(v)} style={{ padding: "8px 18px", borderRadius: 40, fontSize: 13, background: filter === v ? C.primary : "#fff", color: filter === v ? "#fff" : C.muted, border: `1.5px solid ${filter === v ? C.primary : C.border}` }}>{l} ({counts[v]??0})</button>)}
        <button className="btn btn-ghost" onClick={load} style={{ marginLeft: "auto", padding: "8px 16px", fontSize: 13 }}>Refresh</button>
      </div>
      {loading ? <div style={{ display: "flex", justifyContent: "center", padding: 80 }}><Spinner size={36} color={C.primary} /></div>
        : DEMO ? <div className="card" style={{ padding: "64px 20px", textAlign: "center", color: C.muted }}><div style={{ fontSize: 40, marginBottom: 12 }}>📋</div><div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>No orders in demo mode</div><div style={{ fontSize: 13 }}>Connect Supabase to see live orders</div></div>
        : filtered.length === 0 ? <div className="card" style={{ padding: "64px 20px", textAlign: "center", color: C.muted }}><div style={{ fontSize: 15, fontWeight: 600 }}>No orders to show</div></div>
        : <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{filtered.map(o => <OrderCard key={o.id} order={o} onStatusChange={handleStatus} />)}</div>}
    </div>
  );
}

function MenuManagement() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", category_id: "", emoji: "", available: true, featured: false });
  const [saving, setSaving] = useState(false);
  const { show } = useToast();
  const load = useCallback(async () => {
    const [cats, its] = await Promise.all([db.getCategories(), db.getMenuItems()]);
    setCategories(cats); setItems(its); setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);
  const openNew = () => { setEditItem(null); setForm({ name: "", description: "", price: "", category_id: categories[0]?.id || "", emoji: "", available: true, featured: false }); setShowForm(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ ...item, price: String(item.price) }); setShowForm(true); };
  const handleSave = async () => {
    if (!form.name.trim() || !form.price) { show("Name and price are required", "error"); return; }
    setSaving(true);
    try {
      const payload = { ...form, price: parseFloat(form.price), name: form.name.trim(), description: form.description.trim() };
      if (editItem) { await db.updateMenuItem(editItem.id, payload); setItems(prev => prev.map(i => i.id === editItem.id ? { ...i, ...payload } : i)); show("Item updated!"); }
      else { await db.createMenuItem(payload); setItems(prev => [...prev, { ...payload, id: Date.now().toString() }]); show("Item added!"); }
      setShowForm(false);
    } catch (e) { show("Failed to save: " + e.message, "error"); }
    finally { setSaving(false); }
  };
  const handleDelete = async (id) => {
    if (!confirm("Delete this item?")) return;
    try { await db.deleteMenuItem(id); setItems(prev => prev.filter(i => i.id !== id)); show("Deleted"); }
    catch { show("Failed to delete", "error"); }
  };
  const toggleAvail = async (item) => {
    await db.updateMenuItem(item.id, { available: !item.available });
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, available: !i.available } : i));
  };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 14, color: C.muted }}>{items.length} items</div>
        <button className="btn btn-primary" onClick={openNew} style={{ padding: "10px 20px" }}>+ Add Item</button>
      </div>
      {loading ? <div style={{ display: "flex", justifyContent: "center", padding: 80 }}><Spinner size={36} color={C.primary} /></div>
        : <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {categories.map(cat => {
              const catItems = items.filter(i => i.category_id === cat.id);
              if (catItems.length === 0) return null;
              return (
                <div key={cat.id}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.primary, letterSpacing: 2, textTransform: "uppercase", padding: "8px 4px", marginTop: 8 }}>{cat.icon} {cat.name}</div>
                  {catItems.map(item => (
                    <div key={item.id} className="card" style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, marginBottom: 8, opacity: item.available ? 1 : 0.55 }}>
                      <div style={{ fontSize: 26, width: 40, textAlign: "center", flexShrink: 0 }}>{item.emoji || "🍽️"}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{item.name}</div>
                        <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{item.description?.slice(0,65)}{item.description?.length>65?"...":""}</div>
                        <div style={{ display: "flex", gap: 8, marginTop: 5, flexWrap: "wrap", alignItems: "center" }}>
                          <span style={{ fontWeight: 700, fontSize: 14, color: C.primary }}>${parseFloat(item.price).toFixed(2)}</span>
                          {item.featured && <span className="badge" style={{ background: C.primaryLight, color: C.primaryDark }}>Popular</span>}
                          <span className="badge" style={{ background: item.available ? "#D1FAE5" : "#FEE2E2", color: item.available ? "#065F46" : "#991B1B" }}>{item.available ? "Available" : "Hidden"}</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                        <button className="btn" onClick={() => toggleAvail(item)} style={{ padding: "6px 12px", borderRadius: 8, background: C.bgAlt, color: C.muted, fontSize: 12 }}>{item.available ? "Hide" : "Show"}</button>
                        <button className="btn" onClick={() => openEdit(item)} style={{ padding: "6px 12px", borderRadius: 8, background: C.primaryLight, color: C.primaryDark, fontSize: 12 }}>Edit</button>
                        <button className="btn" onClick={() => handleDelete(item.id)} style={{ padding: "6px 12px", borderRadius: 8, background: "#FEE2E2", color: "#991B1B", fontSize: 12 }}>X</button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>}
      {showForm && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="card fade-in" style={{ width: "100%", maxWidth: 480, padding: "28px 32px", maxHeight: "92vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 18, color: C.text }}>{editItem ? "Edit Item" : "New Menu Item"}</div>
              <CloseBtn onClick={() => setShowForm(false)} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 80px", gap: 12 }}>
                <div><label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Item Name *</label><input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Butter Croissant" /></div>
                <div><label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Emoji</label><input className="input" value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} placeholder="🍽️" style={{ textAlign: "center", fontSize: 22 }} maxLength={2} /></div>
              </div>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Description</label><textarea className="input" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What makes this item special?" style={{ resize: "none" }} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="grid-2">
                <div><label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Price ($) *</label><input className="input" type="number" step="0.50" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0.00" /></div>
                <div><label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Category</label><select className="input" value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}><option value="">None</option>{categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select></div>
              </div>
              <div style={{ display: "flex", gap: 24 }}>
                {[["available","Available"],["featured","Mark as Popular"]].map(([key,label]) => <label key={key} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: C.text }}><input type="checkbox" checked={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} style={{ width: 16, height: 16, accentColor: C.primary }} />{label}</label>)}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button className="btn btn-ghost" onClick={() => setShowForm(false)} style={{ flex: 1, padding: "13px" }}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ flex: 2, padding: "13px", fontSize: 15 }}>{saving ? <Spinner size={16} color="#fff" /> : editItem ? "Save Changes" : "Add to Menu"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminApp({ onLogout }) {
  const [tab, setTab] = useState("orders");
  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      <header style={{ background: C.text, height: 60, display: "flex", alignItems: "center", padding: "0 24px", gap: 16 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: "#FDF6F0" }}>Bouche Sucree</div>
        <span style={{ fontSize: 11, color: "rgba(253,246,240,0.45)", letterSpacing: 2, textTransform: "uppercase" }}>Staff Portal</span>
        <div style={{ flex: 1 }} />
        {DEMO && <span style={{ fontSize: 11, color: C.accent, background: "rgba(212,168,83,0.15)", padding: "4px 12px", borderRadius: 20 }}>Demo Mode</span>}
        <button className="btn" onClick={onLogout} style={{ color: "rgba(253,246,240,0.65)", background: "transparent", fontSize: 13, border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "6px 14px" }}>Sign Out</button>
      </header>
      <div style={{ background: "#fff", borderBottom: `1px solid ${C.border}`, padding: "0 24px", display: "flex" }}>
        {[["orders","Orders"],["menu","Menu"]].map(([t,l]) => <button key={t} className="btn" onClick={() => setTab(t)} style={{ padding: "15px 24px", borderRadius: 0, background: "transparent", fontSize: 14, color: tab===t?C.primary:C.muted, borderBottom: `2.5px solid ${tab===t?C.primary:"transparent"}`, fontWeight: tab===t?700:500 }}>{l}</button>)}
      </div>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 20px 60px" }}>
        {tab === "orders" && <OrdersPanel />}
        {tab === "menu" && <MenuManagement />}
      </div>
    </div>
  );
}

export default function App() {
  const isAdmin = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("admin") === "1";
  const [adminAuthed, setAdminAuthed] = useState(false);
  if (isAdmin) {
    return <ToastProvider><CartProvider>{adminAuthed ? <AdminApp onLogout={() => { setAdminAuthed(false); window.location.href = "/"; }} /> : <AdminLogin onLogin={() => setAdminAuthed(true)} />}</CartProvider></ToastProvider>;
  }
  return <ToastProvider><CartProvider><CustomerApp /></CartProvider></ToastProvider>;
}
