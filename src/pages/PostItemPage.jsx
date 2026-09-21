import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UploadCloud, MapPin, Tag, Box, Search, Camera,
  CheckCircle, AlertTriangle, ArrowRight, ArrowLeft,
  Calendar, Clock, ShieldCheck, X
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/* ===================================================
   CONSTANTS & MOCKS
=================================================== */
const CATEGORIES = [
  'Ví & Giấy tờ', 'Điện thoại', 'Laptop', 'Chìa khoá', 'Túi xách & Balo', 'Phụ kiện', 'Khác'
];

/* ===================================================
   COMPONENTS
=================================================== */
function StepIndicator({ currentStep, steps }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px' }}>
      {steps.map((step, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
          {/* Node */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            position: 'relative', width: '80px'
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: index < currentStep ? 'var(--accent)' : (index === currentStep ? 'var(--accent)' : 'var(--bg-canvas)'),
              border: `2px solid ${index <= currentStep ? 'var(--accent)' : 'var(--border-strong)'}`,
              color: index <= currentStep ? 'white' : 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.875rem', zIndex: 2,
              transition: 'all 300ms ease'
            }}>
              {index < currentStep ? <CheckCircle size={16} strokeWidth={2.5} /> : index + 1}
            </div>
            <div style={{
              fontSize: '0.75rem', fontWeight: 600,
              color: index <= currentStep ? 'var(--text-primary)' : 'var(--text-muted)',
              textAlign: 'center', whiteSpace: 'nowrap'
            }}>
              {step}
            </div>
          </div>
          {/* Connector */}
          {index < steps.length - 1 && (
            <div style={{
              width: '64px', height: '2px',
              background: index < currentStep ? 'var(--accent)' : 'var(--border-strong)',
              margin: '0 -20px 24px -20px', zIndex: 1,
              transition: 'all 300ms ease'
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function PostItemPage() {
  const [postType, setPostType] = useState('lost'); // 'lost' | 'found'
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    image: null,
    category: '',
    itemName: '',
    description: '',
    date: '',
    time: '',
    location: '',
  });

  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const steps = ['Hình ảnh', 'Thông tin', 'Hoàn tất'];

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setFormData({ ...formData, image: url });
      // Simulate auto-detecting category based on AI Vision
      setTimeout(() => {
        setFormData(prev => ({ ...prev, category: 'Ví & Giấy tờ' }));
      }, 1000);
    }
  };

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const handleSubmit = () => {
    // Submit logic...
    navigate('/smart-match');
  };

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, background: 'var(--bg-canvas)', padding: '60px 0 100px' }}>
        <div className="container-sm">
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 className="text-display-lg" style={{ marginBottom: '8px' }}>Đăng tin vật phẩm</h1>
            <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
              Cung cấp thông tin chi tiết để hệ thống AI Smart Match có thể giúp bạn tìm kiếm nhanh chóng nhất.
            </p>
          </div>

          {/* Type selector */}
          <div style={{ 
            display: 'flex', background: 'var(--bg-surface)', padding: '6px', 
            borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)',
            marginBottom: '40px', boxShadow: 'var(--shadow-sm)'
          }}>
            <button
              type="button"
              onClick={() => setPostType('lost')}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '12px 24px', borderRadius: 'var(--radius-lg)',
                background: postType === 'lost' ? 'var(--status-lost-bg)' : 'transparent',
                color: postType === 'lost' ? 'var(--status-lost)' : 'var(--text-secondary)',
                fontWeight: 600, fontSize: '0.9375rem', border: 'none', cursor: 'pointer',
                transition: 'all 200ms', fontFamily: 'var(--font-body)'
              }}
            >
              <Search size={18} />
              Cần tìm đồ mất
            </button>
            <button
              type="button"
              onClick={() => setPostType('found')}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '12px 24px', borderRadius: 'var(--radius-lg)',
                background: postType === 'found' ? 'var(--status-found-bg)' : 'transparent',
                color: postType === 'found' ? 'var(--status-found)' : 'var(--text-secondary)',
                fontWeight: 600, fontSize: '0.9375rem', border: 'none', cursor: 'pointer',
                transition: 'all 200ms', fontFamily: 'var(--font-body)'
              }}
            >
              <Box size={18} />
              Đã nhặt được đồ
            </button>
          </div>

          <StepIndicator currentStep={step} steps={steps} />

          {/* Form Card */}
          <div className="card animate-fadeInUp" style={{ padding: '40px', boxShadow: 'var(--shadow-lg)' }}>
            
            {/* STEP 0: IMAGE & CATEGORY */}
            {step === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div>
                  <label className="input-label" style={{ marginBottom: '12px', display: 'block', fontSize: '1rem' }}>
                    Tải lên hình ảnh vật phẩm
                  </label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '2px dashed var(--accent)', borderRadius: 'var(--radius-2xl)',
                      padding: '48px 24px', textAlign: 'center', cursor: 'pointer',
                      background: formData.image ? 'black' : 'var(--teal-50)',
                      position: 'relative', overflow: 'hidden',
                      transition: 'all 200ms'
                    }}
                  >
                    {formData.image ? (
                      <>
                        <img 
                          src={formData.image} 
                          alt="Preview" 
                          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', opacity: 0.8 }} 
                        />
                        <div style={{ position: 'absolute', top: 16, right: 16 }}>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, image: null }); }}
                            style={{ 
                              width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.5)',
                              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              border: 'none', cursor: 'pointer'
                            }}
                          >
                            <X size={16} />
                          </button>
                        </div>
                        {/* Scanning effect simulated */}
                        <div style={{
                          position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                          background: 'var(--status-found)',
                          boxShadow: '0 0 20px var(--status-found)',
                          animation: 'scanline 2s infinite linear'
                        }} />
                      </>
                    ) : (
                      <>
                        <div style={{ 
                          width: 64, height: 64, borderRadius: '50%', background: 'white',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          margin: '0 auto 16px', color: 'var(--accent)',
                          boxShadow: '0 8px 24px rgba(30,107,107,0.1)'
                        }}>
                          <Camera size={28} />
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '1.0625rem', color: 'var(--accent)', marginBottom: '8px' }}>
                          Bấm hoặc Kéo thả ảnh vào đây
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          Định dạng JPG, PNG. Tối đa 5MB.
                        </div>
                      </>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageUpload} 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label" style={{ fontSize: '1rem' }}>Danh mục AI dự đoán</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setFormData({ ...formData, category: cat })}
                        type="button"
                        className={`chip ${formData.category === cat ? 'active' : ''}`}
                        style={{ padding: '8px 16px', fontSize: '0.875rem' }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: DETAILS & LOCATION */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="input-group">
                  <label className="input-label" htmlFor="itemName">Tên / Tiêu đề ngắn gọn</label>
                  <input
                    id="itemName"
                    type="text"
                    className="input"
                    placeholder="VD: Ví da nam Pedro màu đen..."
                    value={formData.itemName}
                    onChange={e => setFormData({ ...formData, itemName: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="input-group">
                    <label className="input-label" htmlFor="date">{postType === 'lost' ? 'Ngày mất' : 'Ngày nhặt được'}</label>
                    <div className="input-icon-wrap">
                      <span className="input-icon"><Calendar size={15} /></span>
                      <input
                        id="date"
                        type="date"
                        className="input"
                        value={formData.date}
                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label" htmlFor="time">Khoảng thời gian</label>
                    <div className="input-icon-wrap">
                      <span className="input-icon"><Clock size={15} /></span>
                      <input
                        id="time"
                        type="time"
                        className="input"
                        value={formData.time}
                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="location">Địa điểm (Vị trí)</label>
                  <div className="input-icon-wrap">
                    <span className="input-icon"><MapPin size={15} /></span>
                    <input
                      id="location"
                      type="text"
                      className="input"
                      placeholder="VD: Dọc tuyến đường Lê Thanh Nghị, đoạn ngã tư..."
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                  {/* Fake map UI snippet */}
                  <div style={{ 
                    height: '160px', background: 'var(--zinc-100)', borderRadius: 'var(--radius-lg)',
                    marginTop: '8px', border: '1px solid var(--border)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)',
                    position: 'relative', overflow: 'hidden'
                  }}>
                    <img 
                      src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80" 
                      alt="Map"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }}
                    />
                    <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <MapPin size={32} color="var(--accent)" fill="var(--teal-100)" />
                      <div style={{ background: 'white', padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, marginTop: '4px', boxShadow: 'var(--shadow-sm)' }}>
                        Chọn trên bản đồ
                      </div>
                    </div>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="desc">Đặc điểm nhận dạng (Quan trọng)</label>
                  <textarea
                    id="desc"
                    className="input"
                    rows={4}
                    placeholder="Mô tả chi tiết màu sắc, kích thước, số seri, hoặc đặc điểm đặc thù chỉ bạn biết..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>
            )}

            {/* STEP 2: REVIEW */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ 
                  background: 'var(--status-done-bg)', border: '1px solid rgba(99,102,241,0.2)',
                  borderRadius: 'var(--radius-lg)', padding: '20px', display: 'flex', gap: '16px'
                }}>
                  <ShieldCheck size={24} style={{ color: 'var(--status-done)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                      Bảo mật thông tin
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Các thông tin nhạy cảm của vật phẩm sẽ được ẩn. Hệ thống AI chỉ dùng để so khớp ngầm. Người liên hệ cần chứng minh quyền sở hữu trước khi nhận đồ.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <img 
                    src={formData.image || 'https://images.unsplash.com/photo-1627123424574-724758594913?w=300&q=80'} 
                    alt="Preview"
                    style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
                      {formData.itemName || 'Ví da nam Pedro'}
                    </h3>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      <span className={`badge ${postType === 'lost' ? 'badge-lost' : 'badge-found'}`}>
                        {postType === 'lost' ? 'Cần tìm' : 'Nhặt được'}
                      </span>
                      <span className="badge badge-accent">{formData.category || 'Danh mục'}</span>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={14} /> {formData.location || 'Chưa rõ địa điểm'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} /> {formData.date} {formData.time}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
              {step > 0 ? (
                <button 
                  className="btn btn-ghost" 
                  onClick={() => setStep(step - 1)}
                >
                  <ArrowLeft size={16} /> Quay lại
                </button>
              ) : <div />}
              
              {step < steps.length - 1 ? (
                <button 
                  className="btn btn-primary" 
                  onClick={handleNext}
                  disabled={step === 0 && !formData.image}
                >
                  Tiếp tục <ArrowRight size={16} />
                </button>
              ) : (
                <Link 
                  to="/smart-match"
                  className="btn btn-primary" 
                  onClick={() => console.log('Navigating to smart match')}
                  style={{ background: 'var(--status-found)', color: 'white', textDecoration: 'none' }}
                >
                  <CheckCircle size={16} /> Đăng tin ngay
                </Link>
              )}
            </div>
            
          </div>
        </div>
      </main>

      <Footer />
      
      {/* Add a scanline animation dynamically */}
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(0); }
          50% { transform: translateY(200px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
