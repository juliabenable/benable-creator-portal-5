import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Info, Image, X, Plus, Check } from 'lucide-react';
import { useCreator } from '@/context/CreatorContext';
import { useDesignMode } from '@/context/DesignModeContext';
import { toast } from 'sonner';
import { useViewport } from './Layout';

const TOTAL_STEPS = 4;
const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Australia', 'France', 'Germany', 'Brazil', 'Mexico', 'India', 'Japan'];

const CONTENT_NICHES = ['Beauty', 'Fashion', 'Lifestyle', 'Fitness', 'Food', 'Travel', 'Parenting', 'DIY / Crafts', 'Wellness', 'Home Decor'];
const PRODUCT_CATEGORIES = ['Skincare', 'Haircare', 'Clothing', 'Home', 'Makeup', 'Supplements', 'Accessories', 'Food & Drink'];

// Row 1 and Row 2 of brand logos matching Figma layout (5 per row, overflowing edges)
const BRAND_ROW_1 = [
  { name: 'Free People', img: 'free-people.svg' },
  { name: 'Etsy', img: 'etsy.svg' },
  { name: 'Nike', img: 'nike.svg' },
  { name: 'Benefit', img: 'revolve.png' },
  { name: 'Supergoop', img: 'supergoop.png' },
];
const BRAND_ROW_2 = [
  { name: 'Sephora', img: 'sephora.png' },
  { name: 'Target', img: 'target.svg' },
  { name: 'SKIMS', img: 'skims.svg' },
  { name: 'Coach', img: 'coach.png' },
  { name: 'ASOS', img: 'asos.png' },
];

export default function ApplyPage() {
  const { creatorStatus, submitApplication } = useCreator();
  const navigate = useNavigate();
  const viewport = useViewport();

  const [step, setStep] = useState(0);
  const [name, setName] = useState('Heather Lacefield');
  const [email, setEmail] = useState('Matias.Silva@email.com');
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => { window.scrollTo(0, 0); }, [step]);

  if (creatorStatus !== 'not_applied') {
    return <Navigate to="/" replace />;
  }

  function toggleItem(list: string[], item: string, setter: (v: string[]) => void) {
    setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  }

  function handleNext() {
    if (step === 1 && (!name.trim() || !email.trim())) {
      toast.error('Please fill in your name and email.');
      return;
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function handleSubmit() {
    submitApplication(name);
    toast.success('Application submitted!');
    navigate('/');
  }

  const progressWidth = step === 0 ? 0 : (step / (TOTAL_STEPS - 1)) * 100;
  const isDesktop = viewport === 'desktop';

  return (
    <div className={`min-h-screen bg-white ${isDesktop ? '' : ''}`}>
      {/* Progress bar header — shown on steps 1-3 */}
      {step > 0 && (
        <div className="sticky top-[60px] lg:top-[72px] z-30 bg-white">
          <div className="h-1 bg-[#ECECEC] rounded-full">
            <div
              className="h-full bg-[#7A5CFA] rounded-r-lg transition-all duration-500 ease-out"
              style={{ width: `${progressWidth}%` }}
            />
          </div>
        </div>
      )}

      {/* Step content */}
      <div key={step} className="animate-fade-in-up" style={{ animationDuration: '400ms' }}>
        {step === 0 && <WelcomeStep onGetStarted={handleNext} isDesktop={isDesktop} />}
        {step === 1 && (
          <PersonalInfoStep
            name={name} setName={setName}
            email={email} setEmail={setEmail}
            selectedNiches={selectedNiches}
            toggleNiche={(n) => toggleItem(selectedNiches, n, setSelectedNiches)}
            selectedCategories={selectedCategories}
            toggleCategory={(c) => toggleItem(selectedCategories, c, setSelectedCategories)}
            isDesktop={isDesktop}
          />
        )}
        {step === 2 && <ShippingStep isDesktop={isDesktop} />}
        {step === 3 && <SocialStatsStep isDesktop={isDesktop} />}
      </div>

      {/* Bottom CTA — steps 1-3 */}
      {step > 0 && (
        <>
          <div className="h-24" />
          <div className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-white via-white to-transparent pt-4 pb-6 px-4">
            <div className={`mx-auto ${isDesktop ? 'max-w-[343px]' : 'max-w-[343px]'}`}>
              {step < TOTAL_STEPS - 1 ? (
                <Button
                  className="w-full h-[41px] rounded-[12px] text-[15px] font-semibold bg-[#7A5CFA] hover:bg-[#6B4DE6] text-white"
                  onClick={handleNext}
                >
                  Next
                </Button>
              ) : (
                <Button
                  className="w-full h-[41px] rounded-[12px] text-[15px] font-semibold bg-[#7A5CFA] hover:bg-[#6B4DE6] text-white"
                  onClick={handleSubmit}
                >
                  Submit Application
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Benefit icons (purple SVG icons matching Figma) ─── */
/* ─── Figma mode icons (stroked outlines) ─── */
function FigmaBenefitIconCrown() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.5 14.5L2 6.5L6.5 9.5L10 5L13.5 9.5L18 6.5L16.5 14.5H3.5Z" stroke="#8B6FFA" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      <path d="M3.5 14.5H16.5V16.5H3.5V14.5Z" stroke="#8B6FFA" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function FigmaBenefitIconHeart() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 17L8.55 15.7C4.4 11.9 1.5 9.3 1.5 6.15C1.5 3.55 3.52 1.5 6.1 1.5C7.54 1.5 8.93 2.17 10 3.24C11.07 2.17 12.46 1.5 13.9 1.5C16.48 1.5 18.5 3.55 18.5 6.15C18.5 9.3 15.6 11.9 11.45 15.7L10 17Z" stroke="#8B6FFA" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function FigmaBenefitIconTag() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 3.5V9.5L10.5 18L17 11.5L8.5 3H2.5" stroke="#8B6FFA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="5.5" cy="6.5" r="1.5" stroke="#8B6FFA" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

/* ─── Refined mode icons (filled) ─── */
function BenefitIconCrown() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.91424 6.72057L3.98629 15.833H16.0222L17.0942 6.72057L13.7527 8.94829L10.0043 3.70046L6.25579 8.94829L2.91424 6.72057ZM2.33814 4.33342L5.83754 6.66636L9.32609 1.78238C9.59359 1.40787 10.1141 1.32113 10.4886 1.58863C10.5634 1.64208 10.6288 1.70755 10.6823 1.78238L14.1709 6.66636L17.6703 4.33342C18.0533 4.07813 18.5706 4.18161 18.8259 4.56455C18.9357 4.72923 18.9833 4.92761 18.9602 5.12416L17.5908 16.7637C17.5414 17.1834 17.1858 17.4997 16.7632 17.4997H3.24525C2.82269 17.4997 2.467 17.1834 2.41763 16.7637L1.04827 5.12416C0.994493 4.66708 1.32144 4.25295 1.77853 4.19917C1.97509 4.17605 2.17347 4.22364 2.33814 4.33342ZM10.0043 12.4997C9.08375 12.4997 8.33759 11.7535 8.33759 10.833C8.33759 9.91254 9.08375 9.16637 10.0043 9.16637C10.9247 9.16637 11.6709 9.91254 11.6709 10.833C11.6709 11.7535 10.9247 12.4997 10.0043 12.4997Z" fill="#7A5CFA"/>
    </svg>
  );
}

function BenefitIconHeart() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.63436 3.72396C4.65431 1.704 7.87272 1.61292 10.0007 3.45071C12.1274 1.61292 15.3458 1.704 17.3657 3.72396C19.3821 5.7403 19.4764 8.95083 17.6488 11.0789L11.1786 17.5715C10.5572 18.1927 9.5675 18.221 8.91275 17.6562L8.82158 17.5715L2.35126 11.0789C0.52365 8.95083 0.618017 5.7403 2.63436 3.72396ZM3.81286 4.90247C2.39024 6.32509 2.3496 8.60633 3.69093 10.0781L3.81286 10.2057L10.0001 16.3929L14.4189 11.9729L11.4732 9.02725L10.5893 9.91117C9.613 10.8874 8.03008 10.8874 7.05377 9.91117C6.07747 8.93483 6.07747 7.35192 7.05377 6.37561L8.80475 4.62352C7.37752 3.48094 5.30905 3.53327 3.94058 4.78052L3.81286 4.90247ZM10.8839 7.25949C11.2093 6.93405 11.737 6.93405 12.0624 7.25949L15.5974 10.7944L16.1872 10.2057C17.6517 8.74133 17.6517 6.36693 16.1872 4.90247C14.7646 3.47984 12.4833 3.4392 11.0117 4.78052L10.8839 4.90247L8.23228 7.55412C7.93009 7.85631 7.90851 8.33285 8.16753 8.65992L8.23228 8.73267C8.5345 9.03483 9.011 9.05642 9.33808 8.79742L9.41083 8.73267L10.8839 7.25949Z" fill="#7A5CFA"/>
    </svg>
  );
}

function BenefitIconTag() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.087 1.75024L17.3366 2.92875L18.5151 11.1784L10.8547 18.8386C10.5293 19.1641 10.0017 19.1641 9.67625 18.8386L1.4267 10.5891C1.10126 10.2636 1.10126 9.73604 1.4267 9.41054L9.087 1.75024ZM9.67625 3.51801L3.19446 9.99979L10.2655 17.0709L16.7473 10.5891L15.8635 4.40189L9.67625 3.51801ZM11.4441 8.82129C10.7932 8.17044 10.7932 7.11516 11.4441 6.46429C12.0949 5.81342 13.1502 5.81342 13.8011 6.46429C14.4519 7.11516 14.4519 8.17044 13.8011 8.82129C13.1502 9.4722 12.0949 9.4722 11.4441 8.82129Z" fill="#7A5CFA"/>
    </svg>
  );
}

/* ─── Brand logo card for the grid ─── */
function BrandCard({ brand, delay }: { brand: { name: string; img: string }; delay: number }) {
  return (
    <div
      className="flex-shrink-0 w-[98px] h-[76px] bg-white rounded-[16px] flex items-center justify-center animate-fade-in-up"
      style={{
        border: '0.5px solid rgba(77, 174, 255, 0.15)',
        boxShadow: '0px 4px 14px rgba(0, 0, 0, 0.04)',
        animationDelay: `${delay}ms`,
        animationFillMode: 'backwards',
      }}
    >
      <img
        src={`${import.meta.env.BASE_URL}brands/${brand.img}`}
        alt={brand.name}
        className="max-w-[70%] max-h-[52%] object-contain"
      />
    </div>
  );
}

/* ─── Step 0: Welcome with brand logos background ─── */
function WelcomeStep({ onGetStarted }: { onGetStarted: () => void; isDesktop: boolean }) {
  const { isRefined } = useDesignMode();

  return (
    <div className="relative min-h-[calc(100vh-60px)] overflow-hidden flex flex-col">
      {/* Progress bar — figma mode only */}
      {!isRefined && (
        <div className="sticky top-[60px] lg:top-[72px] z-30">
          <div className="h-[3px] bg-[#ececec]">
            <div className="h-full bg-[#7a5cfa] rounded-r-lg" style={{ width: '9%' }} />
          </div>
        </div>
      )}

      {/* Rainbow gradient background */}
      <div className={isRefined ? 'gradient-rainbow-refined absolute inset-0' : 'gradient-rainbow absolute inset-0'} />

      {/* Brand logo grid — organized rows overflowing screen edges */}
      <div className="relative z-[1] pt-2 overflow-hidden">
        {/* Row 1 */}
        <div className="flex gap-[10px] mb-[10px]" style={{ marginLeft: '-32px' }}>
          {BRAND_ROW_1.map((brand, i) => (
            <BrandCard key={brand.name} brand={brand} delay={i * 60} />
          ))}
        </div>
        {/* Row 2 */}
        <div className="flex gap-[10px]" style={{ marginLeft: '4px' }}>
          {BRAND_ROW_2.map((brand, i) => (
            <BrandCard key={brand.name} brand={brand} delay={(i + 5) * 60} />
          ))}
        </div>
      </div>

      {/* Profile photo + invitation card */}
      <div className="relative z-10 flex flex-col items-center px-4">
        {/* Avatar — overlapping between grid and card */}
        <div className="flex flex-col items-center mb-[-54px] z-20">
          <div className="w-[82px] h-[82px] rounded-full overflow-hidden shadow-lg ring-[3.5px] ring-white bg-gradient-to-br from-[#c3b1f5] to-[#9b82e0]">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face"
              alt="Kenzie Foster"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-2 px-3.5 py-[4px] bg-white border border-[#E8A54B] rounded-full flex items-center gap-1.5 shadow-sm">
            <span className="text-[13px] font-medium text-[#1C1C1C]">Kenzie Foster</span>
            <div className="w-[17px] h-[17px] rounded-full bg-[#4DAFFF] flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
        </div>

        {/* Semi-transparent invitation card (glassmorphism like Figma) */}
        <div
          className="w-full max-w-[343px] rounded-[24px] pt-[48px] pb-5 px-6 text-center"
          style={{
            background: 'rgba(255, 255, 255, 0.82)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow: '0px 8px 60px rgba(0, 0, 0, 0.10)',
            border: '1px solid rgba(255, 255, 255, 0.85)',
          }}
        >
          {/* Title */}
          <h2
            className="text-[28px] font-extrabold tracking-[-0.5px] text-[#1C1C1C] leading-[1.1] mb-2 mx-auto text-center"
            style={isRefined ? {
              fontFamily: "'Barlow Condensed', sans-serif",
              width: '260px',
              lineHeight: 'normal',
            } : {
              fontFamily: "'Barlow Condensed', sans-serif",
            }}
          >
            YOU'VE BEEN INVITED
          </h2>
          <p
            className={`text-[15px] leading-[1.45] mb-4 ${isRefined ? 'text-[#1C1C1C] font-normal' : 'text-[#444444]'}`}
            style={isRefined ? { fontFamily: "'Inter', sans-serif", width: '273px', fontSize: '16px', lineHeight: 'normal', margin: '0 auto 16px', textAlign: 'center' } : undefined}
          >
            Join a select group of creators with priority access to brand campaigns as part of Benable's first program
          </p>

          {/* Benefits with purple icons */}
          <div className="space-y-4 text-left mb-5">
            {[
              {
                icon: isRefined ? <BenefitIconCrown /> : <FigmaBenefitIconCrown />,
                text: 'Priority access to paid brand campaigns.',
              },
              {
                icon: isRefined ? <BenefitIconHeart /> : <FigmaBenefitIconHeart />,
                text: 'Work with top beauty, lifestyle & wellness brands.',
              },
              {
                icon: isRefined ? <BenefitIconTag /> : <FigmaBenefitIconTag />,
                text: 'Free products or gift cards + compensation for every campaign.',
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="shrink-0 w-5 h-5 mt-0.5">{item.icon}</span>
                <p
                  className={`flex-1 text-[14px] font-medium leading-[1.5] ${isRefined ? 'text-[#545454] leading-normal' : 'text-[#444444]'}`}
                  style={isRefined ? { fontFamily: "'Inter', sans-serif" } : undefined}
                >{item.text}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Button
            className="w-full h-[50px] rounded-[14px] text-[16px] font-semibold bg-[#7A5CFA] hover:bg-[#6B4DE6] text-white transition-transform active:scale-[0.98]"
            onClick={onGetStarted}
          >
            Get Started!
          </Button>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-3 shrink-0" />
    </div>
  );
}

/* ─── MUI-style floating label input ─── */
function FloatingInput({ label, value, onChange, type = 'text', icon, className = '' }: {
  label: string; value?: string; onChange?: (v: string) => void;
  type?: string; icon?: React.ReactNode; className?: string;
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = !!value;
  const isFloating = focused || hasValue;

  return (
    <div className={`relative ${className}`}>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder=" "
        className={`w-full px-4 pt-[22px] pb-[8px] border rounded-[12px] text-[16px] outline-none transition-all duration-200 ${
          focused ? 'border-[#7A5CFA] border-2 bg-white' : 'border-[#C6C6C6] bg-white'
        }`}
        style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
      />
      <label
        className={`absolute left-4 transition-all duration-200 pointer-events-none ${
          isFloating
            ? 'top-[8px] text-[12px] text-[#717171]'
            : 'top-1/2 -translate-y-1/2 text-[16px] text-[#717171]'
        }`}
        style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
      >
        {label}
      </label>
      {icon && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {icon}
        </div>
      )}
    </div>
  );
}

/* ─── Step 1: Personal Info + Niches + Product Categories ─── */
function PersonalInfoStep({ name, setName, email, setEmail, selectedNiches, toggleNiche, selectedCategories, toggleCategory, isDesktop }: {
  name: string; setName: (v: string) => void;
  email: string; setEmail: (v: string) => void;
  selectedNiches: string[]; toggleNiche: (n: string) => void;
  selectedCategories: string[]; toggleCategory: (c: string) => void;
  isDesktop: boolean;
}) {
  return (
    <div className={`mx-auto px-4 py-6 space-y-6 ${isDesktop ? 'max-w-[343px]' : 'max-w-[375px]'}`}>
      {/* Personal details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-semibold text-[#1C1C1C]" style={{ fontFamily: "'Helvetica Neue', sans-serif" }}>
            Personal details
          </h3>
          <button className="text-[14px] font-medium text-[#7A5CFA]">Edit</button>
        </div>
        <div className="space-y-3">
          <div>
            <FloatingInput
              label="Profile Name"
              value={name}
              onChange={setName}
              icon={name ? <Check className="w-5 h-5 text-[#2BAF87]" /> : undefined}
            />
            <p className="text-[12px] text-[#717171] mt-1 ml-1">Full legal name</p>
          </div>
          <FloatingInput
            label="Email"
            value={email}
            onChange={setEmail}
            type="email"
            icon={email ? <Check className="w-5 h-5 text-[#2BAF87]" /> : undefined}
          />
        </div>
      </div>

      {/* Content niches */}
      <div className="space-y-3">
        <div>
          <h3 className="text-[16px] font-semibold text-[#1C1C1C]" style={{ fontFamily: "'Helvetica Neue', sans-serif" }}>
            Your content niches
          </h3>
          <p className="text-[14px] text-[#717171] mt-1">Select all that apply</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {CONTENT_NICHES.map((niche) => (
            <button
              key={niche}
              className={`tag-chip ${selectedNiches.includes(niche) ? 'selected' : ''}`}
              onClick={() => toggleNiche(niche)}
            >
              {niche}
            </button>
          ))}
        </div>
      </div>

      {/* Preferred product categories */}
      <div className="space-y-3">
        <div>
          <h3 className="text-[16px] font-semibold text-[#1C1C1C]" style={{ fontFamily: "'Helvetica Neue', sans-serif" }}>
            Preferred product categories
          </h3>
          <p className="text-[14px] text-[#717171] mt-1">What products do you love working with?</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`tag-chip ${selectedCategories.includes(cat) ? 'selected' : ''}`}
              onClick={() => toggleCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Step 2: Shipping Address ─── */
function ShippingStep({ isDesktop }: { isDesktop: boolean }) {
  return (
    <div className={`mx-auto px-4 py-6 space-y-5 ${isDesktop ? 'max-w-[343px]' : 'max-w-[375px]'}`}>
      <h3 className="text-[16px] font-semibold text-[#1C1C1C]" style={{ fontFamily: "'Helvetica Neue', sans-serif" }}>
        Shipping Address
      </h3>

      <div className="space-y-4">
        <FloatingInput label="Street Address" />
        <FloatingInput label="State / Province" />
        <div className="grid grid-cols-2 gap-3">
          <FloatingInput label="Town/City" />
          <FloatingInput label="Postal Code" />
        </div>
        <div className="relative">
          <Select>
            <SelectTrigger className="w-full h-[56px] rounded-[12px] border-[#C6C6C6] px-4 text-[16px]">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Info alert */}
      <div className="alert-info-card mt-8">
        <div className="w-5 h-5 rounded-full bg-[#47B3FF] flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-3 h-3 text-white" />
        </div>
        <p className="text-[13px] text-[#545454] leading-snug">
          Used so brands can ship you products for campaigns. Only shared with brands you've accepted.
        </p>
      </div>
    </div>
  );
}

/* ─── Screenshot upload section ─── */
function ScreenshotUploadArea({ screenshots, onAdd, onRemove }: {
  screenshots: string[]; onAdd: () => void; onRemove: (i: number) => void;
}) {
  if (screenshots.length > 0) {
    return (
      <div className="space-y-3">
        {screenshots.map((fileName, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-[#F5F3FC] rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7A5CFA] to-[#47B3FF] flex items-center justify-center shrink-0">
              <Image className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{fileName}</p>
              <p className="text-[11px] text-[#717171]">Screenshot {i + 1}</p>
            </div>
            <button onClick={() => onRemove(i)} className="p-1 text-[#717171] hover:text-[#FF5567] transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          onClick={onAdd}
          className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-[#7A5CFA]/30 rounded-xl text-sm font-medium text-[#7A5CFA] hover:bg-[#F5F3FC] transition-colors"
        >
          <Plus className="w-4 h-4" /> Add another screenshot
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {[0, 1].map((i) => (
        <div key={i} className="screenshot-upload-box" onClick={onAdd}>
          <Image className="w-6 h-6 text-[#C6C6C6] mb-2" />
          <p className="text-[12px] text-[#717171]">Upload screenshot</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Help dialogs ─── */
function HelpDialog({ platform }: { platform: 'tiktok' | 'instagram' }) {
  const steps = platform === 'tiktok'
    ? [
        'Open TikTok \u2192 tap the \u2630 menu \u2192 TikTok Studio \u2192 Analytics',
        'Set date range to "Last 28 days"',
        'Screenshot overview showing Followers and Average Views',
        'Screenshot audience demographics (countries, gender, ages)',
      ]
    : [
        'Open Instagram \u2192 Profile \u2192 Professional dashboard',
        'Set date range to "Last 30 days"',
        'Screenshot overview showing Accounts Reached, Engaged, and Followers',
        'Screenshot audience demographics',
      ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-1 text-[12px] font-medium text-[#7A5CFA]">
          <Info className="w-3 h-3" /> What to include
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base">How to screenshot your {platform === 'tiktok' ? 'TikTok' : 'Instagram'} stats</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          {steps.map((text, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#F5F3FC] flex items-center justify-center shrink-0 text-xs font-bold text-[#7A5CFA]">{i + 1}</div>
              <p className="text-sm text-[#717171] pt-0.5">{text}</p>
            </div>
          ))}
        </div>
        <DialogClose asChild>
          <Button className="w-full mt-1">Got it</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Step 3: Social Stats ─── */
function SocialStatsStep({ isDesktop }: { isDesktop: boolean }) {
  const [tiktokScreenshots, setTiktokScreenshots] = useState<string[]>([]);
  const [igScreenshots, setIgScreenshots] = useState<string[]>([]);

  function simulateAdd(setter: React.Dispatch<React.SetStateAction<string[]>>) {
    const fakeNames = ['analytics_overview.png', 'stats_page.png', 'followers_detail.png', 'engagement.png'];
    setter((prev) => [...prev, fakeNames[prev.length % fakeNames.length]]);
  }

  return (
    <div className={`mx-auto px-4 py-6 space-y-8 ${isDesktop ? 'max-w-[343px]' : 'max-w-[375px]'}`}>
      {/* Instagram Section */}
      <div className="space-y-4">
        <h3 className="text-[16px] font-semibold text-[#1C1C1C]" style={{ fontFamily: "'Helvetica Neue', sans-serif" }}>Instagram</h3>

        {/* Handle input with Instagram icon */}
        <div className="flex items-center gap-3 px-4 py-3 border border-[#C6C6C6] rounded-[12px]">
          <div className="w-8 h-8 rounded-lg instagram-gradient flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">IG</span>
          </div>
          <input
            placeholder="@username"
            className="flex-1 border-none outline-none text-[16px] bg-transparent"
            style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
          />
        </div>

        {/* Stats Screenshots */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold text-[#1C1C1C]">Stats Screenshots</p>
            <HelpDialog platform="instagram" />
          </div>
          <p className="text-[13px] text-[#717171] leading-snug">
            Upload screenshots of your Instagram insights showing your <strong>followers</strong>, <strong>views</strong> over 30 days, and <strong>reach</strong> over 30 days.
          </p>
          <ScreenshotUploadArea
            screenshots={igScreenshots}
            onAdd={() => simulateAdd(setIgScreenshots)}
            onRemove={(i) => setIgScreenshots((prev) => prev.filter((_, idx) => idx !== i))}
          />
        </div>
      </div>

      {/* TikTok Section */}
      <div className="space-y-4">
        <h3 className="text-[16px] font-semibold text-[#1C1C1C]" style={{ fontFamily: "'Helvetica Neue', sans-serif" }}>Tiktok</h3>

        {/* Handle input with TikTok icon */}
        <div className="flex items-center gap-3 px-4 py-3 border border-[#C6C6C6] rounded-[12px]">
          <div className="w-8 h-8 rounded-lg tiktok-bg flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">TK</span>
          </div>
          <input
            placeholder="@username"
            className="flex-1 border-none outline-none text-[16px] bg-transparent"
            style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
          />
        </div>

        {/* Stats Screenshots */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold text-[#1C1C1C]">Stats Screenshots</p>
            <HelpDialog platform="tiktok" />
          </div>
          <p className="text-[13px] text-[#717171] leading-snug">
            Upload screenshots of your TikTok analytics showing your <strong>followers</strong> and <strong>average views</strong>.
          </p>
          <ScreenshotUploadArea
            screenshots={tiktokScreenshots}
            onAdd={() => simulateAdd(setTiktokScreenshots)}
            onRemove={(i) => setTiktokScreenshots((prev) => prev.filter((_, idx) => idx !== i))}
          />
        </div>
      </div>
    </div>
  );
}
