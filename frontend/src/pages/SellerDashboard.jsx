import { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import useAuthStore from '../store/authStore';

const CATEGORIES = [
  'Electronics','Footwear','Clothing',
  'Bags','Accessories','Home','Sports','Books'
];

const EMPTY_FORM = {
  name:'', description:'', price:'',
  stock:'', category:'', image:''
};

// ── Stat Card ──────────────────────────────────
function StatCard({ icon, label, value, color='var(--accent)' }) {
  return (
    <div style={{
      background:'var(--surface)',
      border:'1px solid var(--border)',
      borderRadius:8, padding:'24px 28px',
      display:'flex', alignItems:'center', gap:20,
      transition:'border-color 0.2s',
    }}
    onMouseEnter={e=>e.currentTarget.style.borderColor=color}
    onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}
    >
      <div style={{
        width:52,height:52,borderRadius:8,
        background:`${color}18`,
        display:'flex',alignItems:'center',
        justifyContent:'center',fontSize:24,
      }}>{icon}</div>
      <div>
        <div style={{fontSize:11,letterSpacing:'0.12em',
          textTransform:'uppercase',color:'var(--text3)',marginBottom:4}}>
          {label}
        </div>
        <div style={{fontFamily:'var(--font-display)',
          fontSize:28,fontWeight:600,color}}>
          {value}
        </div>
      </div>
    </div>
  );
}

// ── Form Input ─────────────────────────────────
function FormInput({ label, name, type='text', value,
  onChange, placeholder, required, min }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{display:'flex',flexDirection:'column',gap:14, marginBottom: 12}}>
      <label style={{fontSize:11,letterSpacing:'0.12em',
        textTransform:'uppercase',color:'var(--text3)',
        display:'flex',alignItems:'center',gap:4}}>
        {label}
        {required && <span style={{color:'var(--accent)'}}>*</span>}
      </label>
      <input
        type={type} name={name} value={value}
        onChange={onChange} placeholder={placeholder} min={min}
        onFocus={()=>setFocused(true)}
        onBlur={()=>setFocused(false)}
        style={{
          background:'var(--surface2)',
          border:'1px solid #000',
          borderRadius:6, padding:'11px 14px',
          color:'var(--text)', fontSize:14,
          outline:'none', width:'100%',
          transition:'border-color 0.2s',
        }}
      />
    </div>
  );
}

// ── Stock Badge ────────────────────────────────
function Badge({ stock }) {
  const s = stock === 0
    ? { bg:'rgba(224,112,96,0.1)',  color:'#e07060', label:'Out of Stock' }
    : stock < 10
    ? { bg:'rgba(232,164,74,0.1)',  color:'#e8a44a', label:'Low Stock'   }
    : { bg:'rgba(76,175,125,0.1)', color:'#4caf7d', label:'In Stock'    };
  return (
    <span style={{
      background:s.bg, color:s.color,
      padding:'3px 10px', borderRadius:20,
      fontSize:10, fontWeight:600,
      letterSpacing:'0.08em', textTransform:'uppercase',
    }}>{s.label}</span>
  );
}

// ── Main Component ─────────────────────────────
export default function SellerDashboard() {
  const { user } = useAuthStore();
  const [products,   setProducts]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [editId,     setEditId]     = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [toast,      setToast]      = useState(null);
  const [search,     setSearch]     = useState('');
  const [view,       setView]       = useState('grid');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [imagePreview,  setImagePreview]  = useState('');
  const [submitHover, setSubmitHover] = useState(false);
  const formRef = useRef(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products/mine');
      setProducts(data);
    } catch {
      showToast('Failed to load products','error');
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const showToast = (msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'image') setImagePreview(value);
  };

  // Handle image file uploads (client-side preview + embed as data URL)
  const handleImageFileChange = e => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setImagePreview(dataUrl);
      setForm(prev => ({ ...prev, image: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const [dragActive, setDragActive] = useState(false);

  const handleDrop = e => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setImagePreview(dataUrl);
      setForm(prev => ({ ...prev, image: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = e => { e.preventDefault(); setDragActive(true); };
  const handleDragLeave = e => { e.preventDefault(); setDragActive(false); };

  const handleEdit = (p) => {
    setEditId(p._id);
    setForm({
      name:p.name, description:p.description,
      price:p.price, stock:p.stock,
      category:p.category, image:p.image||'',
    });
    setImagePreview(p.image||'');
    formRef.current?.scrollIntoView({ behavior:'smooth', block:'start' });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setImagePreview('');
  };

  const handleSubmit = async () => {
    const { name, description, price, stock, category } = form;
    if (!name||!description||!price||!stock||!category)
      return showToast('Please fill all required fields','error');
    if (Number(price) <= 0)
      return showToast('Price must be greater than 0','error');
    if (Number(stock) < 0)
      return showToast('Stock cannot be negative','error');

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      };
      if (editId) {
        await api.put(`/products/${editId}`, payload);
        showToast('Product updated ✓');
      } else {
        await api.post('/products', payload);
        showToast('Product added ✓');
      }
      setForm(EMPTY_FORM);
      setEditId(null);
      setImagePreview('');
      fetchProducts();
    } catch (err) {
      showToast(err.response?.data?.message||'Operation failed','error');
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/products/${id}`);
      showToast('Product deleted');
      fetchProducts();
    } catch {
      showToast('Failed to delete','error');
    }
    setDeletingId(null);
    setConfirmDelete(null);
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = products.reduce((s,p) => s + p.price * p.stock, 0);
  const lowStock   = products.filter(p => p.stock > 0 && p.stock < 10).length;
  const outStock   = products.filter(p => p.stock === 0).length;

  return (
    <div style={{maxWidth:1200,margin:'0 auto',padding:'48px 40px'}}>

      {/* Toast */}
      {toast && (
        <div style={{
          position:'fixed',bottom:32,right:32,zIndex:999,
          background: toast.type==='error'
            ? 'rgba(224,112,96,0.12)' : 'rgba(76,175,125,0.12)',
          border:`1px solid ${toast.type==='error'?'#e07060':'#4caf7d'}`,
          color: toast.type==='error' ? '#e07060' : '#4caf7d',
          padding:'14px 24px',borderRadius:8,
          fontSize:13,fontWeight:500,
          boxShadow:'0 8px 32px rgba(0,0,0,0.4)',
          animation:'fadeUp 0.3s ease both',
          display:'flex',alignItems:'center',gap:10,
        }}>
          <span>{toast.type==='error'?'✕':'✓'}</span>
          {toast.msg}
        </div>
      )}

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div style={{
          position:'fixed',inset:0,zIndex:200,
          background:'rgba(0,0,0,0.75)',
          display:'flex',alignItems:'center',justifyContent:'center',
          animation:'fadeIn 0.2s ease both',
        }}>
          <div style={{
            background:'var(--surface)',
            border:'1px solid var(--border)',
            borderRadius:12,padding:'36px 40px',
            maxWidth:380,width:'90%',textAlign:'center',
            animation:'fadeUp 0.3s ease both',
          }}>
            <div style={{fontSize:40,marginBottom:16}}>🗑️</div>
            <h3 style={{fontFamily:'var(--font-display)',
              fontSize:22,marginBottom:10}}>
              Delete Product?
            </h3>
            <p style={{color:'var(--text3)',fontSize:13,
              marginBottom:28,lineHeight:1.6}}>
              This cannot be undone. The product will be
              permanently removed from your store.
            </p>
            <div style={{display:'flex',gap:12}}>
              <button
                onClick={()=>setConfirmDelete(null)}
                style={{
                  flex:1,background:'transparent',
                  border:'1px solid var(--border2)',
                  color:'var(--text2)',padding:'12px',
                  borderRadius:6,cursor:'pointer',fontSize:13,
                }}>
                Cancel
              </button>
              <button
                onClick={()=>handleDelete(confirmDelete)}
                disabled={deletingId===confirmDelete}
                style={{
                  flex:1,background:'rgba(224,112,96,0.12)',
                  border:'1px solid #e07060',color:'#e07060',
                  padding:'12px',borderRadius:6,
                  cursor:'pointer',fontSize:13,fontWeight:600,
                }}>
                {deletingId===confirmDelete ? 'Deleting...':'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page header */}
      <div style={{marginBottom:48,animation:'fadeUp 0.5s ease both'}}>
        <p style={{fontSize:11,letterSpacing:'0.2em',
          textTransform:'uppercase',color:'var(--accent)',marginBottom:10}}>
          {user?.role === 'admin' ? 'Admin Seller Dashboard' : 'Seller Dashboard'}
        </p>
        <h1 style={{fontFamily:'var(--font-display)',
          fontSize:48,fontWeight:600,lineHeight:1.1}}>
          {user?.role === 'admin' ? 'Marketplace ' : 'Product '}{' '}
          <em style={{fontStyle:'italic',color:'var(--accent)'}}>
            Management
          </em>
        </h1>
      </div>

      {/* Stats */}
      <div style={{
        display:'grid',gridTemplateColumns:'repeat(4,1fr)',
        gap:16,marginBottom:48,
        animation:'fadeUp 0.5s ease 0.1s both',
      }}>
        <StatCard icon="📦" label="Total Products"
          value={products.length} color="var(--accent)"/>
        <StatCard icon="💰" label="Inventory Value"
          value={`₹${(totalValue/1000).toFixed(1)}K`} color="#4caf7d"/>
        <StatCard icon="⚠️" label="Low Stock"
          value={lowStock} color="#e8a44a"/>
        <StatCard icon="❌" label="Out of Stock"
          value={outStock} color="#e07060"/>
      </div>

      {/* Form */}
      <div ref={formRef} style={{
        background:'var(--surface)',
        border:`1px solid ${editId?'var(--accent)':'var(--border)'}`,
        borderRadius:12,padding:'36px',marginBottom:48,
        animation:'fadeUp 0.5s ease 0.15s both',
        transition:'border-color 0.3s',
      }}>
        {/* Form header */}
        <div style={{display:'flex',justifyContent:'space-between',
          alignItems:'center',marginBottom:32}}>
          <div>
            <h2 style={{fontFamily:'var(--font-display)',
              fontSize:26,fontWeight:600,marginBottom:4}}>
              {editId ? '✏️ Edit Product' : '➕ Add New Product'}
            </h2>
            <p style={{fontSize:12,color:'var(--text3)'}}>
              {editId
                ? 'Update the product details below'
                : 'Fill in the details to list a new product'}
            </p>
          </div>
          {editId && (
            <button onClick={handleCancelEdit} style={{
              background:'transparent',
              border:'1px solid var(--border2)',
              color:'var(--text3)',padding:'8px 18px',
              borderRadius:6,cursor:'pointer',fontSize:12,
            }}>✕ Cancel Edit</button>
          )}
        </div>

        <div style={{display:'grid',
          gridTemplateColumns:'1fr 1fr',gap:24}}>

          {/* Left: fields */}
          <div style={{display:'flex',flexDirection:'column',gap:20}}>
            <FormInput label="Product Name" name="name" required
              value={form.name} onChange={handleChange}
              placeholder="e.g. Wireless Headphones"/>

            {/* Description textarea */}
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              <label style={{fontSize:11,letterSpacing:'0.12em',
                textTransform:'uppercase',color:'var(--text3)',
                display:'flex',gap:4}}>
                Description
                <span style={{color:'var(--accent)'}}>*</span>
              </label>
              <textarea
                name="description" value={form.description}
                onChange={handleChange} rows={4}
                placeholder="Describe the product in detail..."
                style={{
                  background:'var(--surface2)',
                  border:'1px solid #000',
                  borderRadius:6,padding:'11px 14px',
                  color:'var(--text)',fontSize:14,
                  outline:'none',resize:'vertical',lineHeight:1.6,
                  fontFamily:'var(--font-body)',
                  transition:'border-color 0.2s',
                }}
                onFocus={e=>e.target.style.borderColor='#000'}
                onBlur={e=>e.target.style.borderColor='#000'}
              />
            </div>

            <div style={{display:'grid',
              gridTemplateColumns:'1fr 1fr',gap:16}}>
              <FormInput label="Price (₹)" name="price"
                type="number" min="0" required
                value={form.price} onChange={handleChange}
                placeholder="e.g. 2999"/>
              <FormInput label="Stock Qty" name="stock"
                type="number" min="0" required
                value={form.stock} onChange={handleChange}
                placeholder="e.g. 50"/>
            </div>

            {/* Category */}
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              <label style={{fontSize:11,letterSpacing:'0.12em',
                textTransform:'uppercase',color:'var(--text3)',
                display:'flex',gap:4}}>
                Category
                <span style={{color:'var(--accent)'}}>*</span>
              </label>
              <select name="category" value={form.category}
                onChange={handleChange}
                style={{
                  background:'var(--surface2)',
                  border:'1px solid #000',
                  borderRadius:6,padding:'11px 14px',
                  color:form.category?'var(--text)':'var(--text3)',
                  fontSize:14,outline:'none',cursor:'pointer',
                }}
                onFocus={e=>e.target.style.borderColor='#000'}
                onBlur={e=>e.target.style.borderColor='#000'}
              >
                <option value="" disabled
                  style={{background:'var(--surface2)'}}>
                  Select a category
                </option>
                {CATEGORIES.map(c=>(
                  <option key={c} value={c}
                    style={{background:'var(--surface2)'}}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right: image */}
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <FormInput label="Image URL" name="image"
              value={form.image} onChange={handleChange}
              placeholder="https://example.com/image.jpg"/>

            {/* Preview (click or drop image) */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragOver}
              onDragLeave={handleDragLeave}
              style={{
                flex:1,minHeight:200,
                background: dragActive ? 'rgba(0,0,0,0.03)' : 'var(--surface2)',
                border:'1px dashed #000',
                borderRadius:8,
                display:'flex',alignItems:'center',
                justifyContent:'center',
                overflow:'hidden',position:'relative',
              }}
            >
              <input type="file" accept="image/*" onChange={handleImageFileChange}
                style={{position:'absolute',inset:0,opacity:0,cursor:'pointer',width:'100%',height:'100%'}}/>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview"
                  onError={()=>setImagePreview('')}
                  style={{width:'100%',height:'100%',
                    objectFit:'cover',position:'absolute',inset:0}}
                />
              ) : (
                <div style={{textAlign:'center',color:'var(--text3)'}}>
                  <div style={{fontSize:40,marginBottom:10,opacity:0.3}}>🖼️</div>
                  <p style={{fontSize:13,fontWeight:600}}>Click or drop an image here</p>
                  <p style={{fontSize:11,marginTop:6,opacity:0.6}}>Or paste an image URL in the field above</p>
                </div>
              )}
              {imagePreview && (
                <button onClick={()=>{ setImagePreview(''); setForm(prev=>({ ...prev, image: '' })); }}
                  style={{position:'absolute',bottom:12,right:12,background:'transparent',border:'1px solid var(--border2)',color:'var(--text3)',padding:'8px 10px',borderRadius:6,cursor:'pointer'}}>
                  Remove
                </button>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              onMouseEnter={() => setSubmitHover(true)}
              onMouseLeave={() => setSubmitHover(false)}
              onFocus={() => setSubmitHover(true)}
              onBlur={() => setSubmitHover(false)}
              aria-pressed={submitting}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: editId ? 'linear-gradient(90deg, rgba(201,169,110,0.14), rgba(201,169,110,0.08))' : 'linear-gradient(90deg,#7c3aed,#a78bfa)',
                color: editId ? 'var(--accent)' : '#fff',
                border: editId ? '1px solid var(--accent)' : 'none',
                padding: '12px 18px', fontSize:13, fontWeight:700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                borderRadius:999, /* pill */
                cursor: submitting ? 'wait' : 'pointer',
                opacity: submitting ? 0.75 : 1,
                boxShadow: submitHover ? '0 8px 24px rgba(124,58,237,0.18)' : '0 4px 12px rgba(15,23,42,0.04)',
                transform: submitHover ? 'translateY(-3px)' : 'translateY(0)',
                transition: 'transform 180ms ease, box-shadow 180ms ease, opacity 150ms ease',
                width: '100%', justifyContent: 'center',
              }}
            >
              <span style={{fontSize:16,lineHeight:1}}>{editId ? '✏️' : '＋'}</span>
              <span>{submitting ? (editId ? 'Updating...' : 'Adding...') : (editId ? 'Update Product' : 'Add Product')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product list header */}
      <div style={{
        display:'flex',justifyContent:'space-between',
        alignItems:'center',marginBottom:24,
        animation:'fadeUp 0.5s ease 0.2s both',
      }}>
        <div>
          <h2 style={{fontFamily:'var(--font-display)',
            fontSize:28,fontWeight:600}}>
            Your Products
          </h2>
          <p style={{fontSize:12,color:'var(--text3)',marginTop:4}}>
            {loading
              ? 'Loading...'
              : `${filtered.length} of ${products.length} products`}
          </p>
        </div>

        <div style={{display:'flex',alignItems:'center',gap:12}}>
          {/* Search */}
          <div style={{
            display:'flex',alignItems:'center',gap:10,
            background:'var(--surface)',
            border:'1px solid #000',
            borderRadius:6,padding:'9px 14px',
          }}>
            <span style={{fontSize:13,color:'var(--text3)'}}>🔍</span>
            <input
              placeholder="Search products..."
              value={search}
              onChange={e=>setSearch(e.target.value)}
              style={{
                background:'none',border:'none',outline:'none',
                color:'var(--text)',fontSize:13,width:180,
              }}
            />
            {search && (
              <button onClick={()=>setSearch('')} style={{
                background:'none',border:'none',
                color:'var(--text3)',cursor:'pointer',fontSize:14,
              }}>✕</button>
            )}
          </div>

          {/* Grid/Table toggle */}
          <div style={{
            display:'flex',background:'var(--surface)',
            border:'1px solid var(--border)',
            borderRadius:6,overflow:'hidden',
          }}>
            {[['grid','⊞'],['table','≡']].map(([v,icon])=>(
              <button key={v} onClick={()=>setView(v)} style={{
                background:view===v?'var(--accent)':'transparent',
                color:view===v?'#0a0a0a':'var(--text3)',
                border:'none',padding:'9px 14px',
                cursor:'pointer',fontSize:16,
                transition:'all 0.2s',
              }}>{icon}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Skeleton */}
      {loading && (
        <div style={{display:'grid',
          gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',
          gap:16}}>
          {[...Array(6)].map((_,i)=>(
            <div key={i} style={{
              height:300,background:'var(--surface)',
              border:'1px solid var(--border)',
              borderRadius:8,animation:'pulse 1.5s ease infinite',
            }}/>
          ))}
        </div>
      )}

      {/* Grid view */}
      {!loading && view==='grid' && (
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',
          gap:16,animation:'fadeIn 0.4s ease both',
        }}>
          {filtered.map((p,i)=>(
            <div key={p._id} style={{
              background:'var(--surface)',
              border:'1px solid var(--border)',
              borderRadius:8,overflow:'hidden',
              transition:'all 0.22s',
              animation:`fadeUp 0.4s ease ${i*0.04}s both`,
            }}
            onMouseEnter={e=>{
              e.currentTarget.style.borderColor='var(--border2)';
              e.currentTarget.style.transform='translateY(-2px)';
            }}
            onMouseLeave={e=>{
              e.currentTarget.style.borderColor='var(--border)';
              e.currentTarget.style.transform='translateY(0)';
            }}>
              {/* Image */}
              <div style={{
                height:160,background:'var(--surface2)',
                display:'flex',alignItems:'center',
                justifyContent:'center',
                position:'relative',overflow:'hidden',
              }}>
                {p.image
                  ? <img src={p.image} alt={p.name}
                      style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                  : <span style={{fontSize:40,opacity:0.2}}>📦</span>
                }
                <div style={{position:'absolute',top:10,left:10}}>
                  <Badge stock={p.stock}/>
                </div>
              </div>
              {/* Info */}
              <div style={{padding:'16px'}}>
                <p style={{fontSize:10,color:'var(--text3)',
                  letterSpacing:'0.12em',textTransform:'uppercase',
                  marginBottom:4}}>
                  {p.category}
                </p>
                <h3 style={{fontFamily:'var(--font-display)',
                  fontSize:16,marginBottom:8,lineHeight:1.3}}>
                  {p.name}
                </h3>
                <div style={{display:'flex',justifyContent:'space-between',
                  alignItems:'center',marginBottom:16}}>
                  <span style={{fontFamily:'var(--font-display)',
                    fontSize:20,fontWeight:600,color:'var(--accent)'}}>
                    ₹{p.price.toLocaleString('en-IN')}
                  </span>
                  <span style={{fontSize:12,color:'var(--text3)'}}>
                    {p.stock} units
                  </span>
                </div>
                {/* Buttons */}
                <div style={{display:'flex',gap:8}}>
                  <button onClick={()=>handleEdit(p)} style={{
                    flex:1,
                    background:'rgba(201,169,110,0.08)',
                    border:'1px solid rgba(201,169,110,0.2)',
                    color:'var(--accent)',padding:'9px',
                    borderRadius:6,cursor:'pointer',
                    fontSize:12,fontWeight:500,transition:'all 0.2s',
                  }}
                  onMouseEnter={e=>{
                    e.target.style.background='rgba(201,169,110,0.15)';
                    e.target.style.borderColor='var(--accent)';
                  }}
                  onMouseLeave={e=>{
                    e.target.style.background='rgba(201,169,110,0.08)';
                    e.target.style.borderColor='rgba(201,169,110,0.2)';
                  }}>✏️ Edit</button>
                  <button onClick={()=>setConfirmDelete(p._id)} style={{
                    flex:1,
                    background:'rgba(224,112,96,0.08)',
                    border:'1px solid rgba(224,112,96,0.2)',
                    color:'#e07060',padding:'9px',
                    borderRadius:6,cursor:'pointer',
                    fontSize:12,fontWeight:500,transition:'all 0.2s',
                  }}
                  onMouseEnter={e=>{
                    e.target.style.background='rgba(224,112,96,0.15)';
                    e.target.style.borderColor='#e07060';
                  }}
                  onMouseLeave={e=>{
                    e.target.style.background='rgba(224,112,96,0.08)';
                    e.target.style.borderColor='rgba(224,112,96,0.2)';
                  }}>🗑️ Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table view */}
      {!loading && view==='table' && (
        <div style={{
          background:'var(--surface)',
          border:'1px solid var(--border)',
          borderRadius:8,overflow:'hidden',
          animation:'fadeIn 0.4s ease both',
        }}>
          {/* Header */}
          <div style={{
            display:'grid',
            gridTemplateColumns:'60px 1fr 120px 100px 80px 120px 160px',
            padding:'14px 20px',
            background:'var(--surface2)',
            borderBottom:'1px solid var(--border)',
            fontSize:10,letterSpacing:'0.12em',
            textTransform:'uppercase',color:'var(--text3)',
            fontWeight:600,
          }}>
            <span>Img</span><span>Product</span>
            <span>Category</span>
            <span style={{textAlign:'right'}}>Price</span>
            <span style={{textAlign:'center'}}>Stock</span>
            <span style={{textAlign:'center'}}>Status</span>
            <span style={{textAlign:'right'}}>Actions</span>
          </div>
          {/* Rows */}
          {filtered.map((p,i)=>(
            <div key={p._id} style={{
              display:'grid',
              gridTemplateColumns:'60px 1fr 120px 100px 80px 120px 160px',
              padding:'16px 20px',alignItems:'center',
              borderBottom:'1px solid var(--border)',
              transition:'background 0.2s',
              animation:`fadeUp 0.3s ease ${i*0.03}s both`,
            }}
            onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}
            >
              <div style={{
                width:44,height:44,borderRadius:4,
                background:'var(--surface2)',
                border:'1px solid var(--border)',
                overflow:'hidden',
                display:'flex',alignItems:'center',justifyContent:'center',
              }}>
                {p.image
                  ? <img src={p.image} alt={p.name}
                      style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                  : <span style={{fontSize:18,opacity:0.2}}>📦</span>
                }
              </div>
              <div style={{paddingRight:16}}>
                <div style={{fontFamily:'var(--font-display)',
                  fontSize:15,marginBottom:2}}>{p.name}</div>
                <div style={{fontSize:11,color:'var(--text3)',
                  overflow:'hidden',textOverflow:'ellipsis',
                  whiteSpace:'nowrap',maxWidth:220}}>
                  {p.description}
                </div>
              </div>
              <span style={{fontSize:12,color:'var(--text2)'}}>
                {p.category}
              </span>
              <span style={{textAlign:'right',
                fontFamily:'var(--font-display)',
                fontSize:16,fontWeight:600,color:'var(--accent)'}}>
                ₹{p.price.toLocaleString('en-IN')}
              </span>
              <span style={{textAlign:'center',fontSize:13,
                color: p.stock===0?'#e07060'
                  : p.stock<10?'#e8a44a':'var(--text2)'}}>
                {p.stock}
              </span>
              <div style={{textAlign:'center'}}>
                <Badge stock={p.stock}/>
              </div>
              <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
                <button onClick={()=>handleEdit(p)} style={{
                  background:'rgba(201,169,110,0.08)',
                  border:'1px solid rgba(201,169,110,0.2)',
                  color:'var(--accent)',padding:'7px 14px',
                  borderRadius:4,cursor:'pointer',fontSize:12,
                  transition:'all 0.2s',
                }}
                onMouseEnter={e=>{
                  e.target.style.background='rgba(201,169,110,0.16)';
                  e.target.style.borderColor='var(--accent)';
                }}
                onMouseLeave={e=>{
                  e.target.style.background='rgba(201,169,110,0.08)';
                  e.target.style.borderColor='rgba(201,169,110,0.2)';
                }}>Edit</button>
                <button onClick={()=>setConfirmDelete(p._id)} style={{
                  background:'rgba(224,112,96,0.08)',
                  border:'1px solid rgba(224,112,96,0.2)',
                  color:'#e07060',padding:'7px 14px',
                  borderRadius:4,cursor:'pointer',fontSize:12,
                  transition:'all 0.2s',
                }}
                onMouseEnter={e=>{
                  e.target.style.background='rgba(224,112,96,0.16)';
                  e.target.style.borderColor='#e07060';
                }}
                onMouseLeave={e=>{
                  e.target.style.background='rgba(224,112,96,0.08)';
                  e.target.style.borderColor='rgba(224,112,96,0.2)';
                }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length===0 && (
        <div style={{
          textAlign:'center',padding:'80px 40px',
          background:'var(--surface)',
          border:'1px solid var(--border)',borderRadius:8,
        }}>
          <div style={{fontSize:56,marginBottom:16,opacity:0.2}}>📦</div>
          <h3 style={{fontFamily:'var(--font-display)',
            fontSize:26,marginBottom:8}}>
            {search ? 'No products found' : 'No products yet'}
          </h3>
          <p style={{fontSize:13,color:'var(--text3)',marginBottom:24}}>
            {search
              ? `No results for "${search}"`
              : 'Add your first product using the form above'}
          </p>
          {search && (
            <button onClick={()=>setSearch('')} style={{
              background:'var(--accent)',color:'#0a0a0a',
              border:'none',padding:'12px 28px',
              borderRadius:6,cursor:'pointer',
              fontSize:12,fontWeight:600,
              letterSpacing:'0.08em',textTransform:'uppercase',
            }}>Clear Search</button>
          )}
        </div>
      )}
    </div>
  );
}
