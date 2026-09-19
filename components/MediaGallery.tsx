'use client';

import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Download from 'yet-another-react-lightbox/plugins/download';
import Counter from 'yet-another-react-lightbox/plugins/counter';

import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/counter.css';

type MediaProps = string | { url: string; caption?: string };

interface MediaGalleryProps {
  media: MediaProps | MediaProps[];
}

export default function MediaGallery({ media }: MediaGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const mediaArray = Array.isArray(media) ? media : [media];
  
  const items = mediaArray.filter(Boolean).map((m) => {
    if (typeof m === 'string') {
      return { src: m, alt: '' };
    }
    return { src: m.url, alt: m.caption || '' };
  });

  if (items.length === 0) return null;

  const count = items.length;
  const displayItems = items.slice(0, 3);

  const openLightbox = (index: number) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  const toBengaliNumber = (num: number) => {
    return new Intl.NumberFormat('bn-BD').format(num);
  };

  // 🔹 কাস্টম ফোর্স-ডাউনলোড ফাংশন
  // 🔹 কাস্টম ফোর্স-ডাউনলোড ফাংশন (API Proxy ব্যবহার করে)
  const handleForceDownload = (url: string) => {
    // URL টিকে এনকোড করে আমাদের Next.js API তে পাঠানো হচ্ছে
    const encodedUrl = encodeURIComponent(url);
    
    // ব্রাউজারকে আমাদের লোকাল API লিংকে রিডাইরেক্ট করা হচ্ছে
    // API রেসপন্সে attachment হেডার থাকায় এটি নতুন ট্যাব ওপেন না করে সরাসরি ডাউনলোড হবে
    const a = document.createElement('a');
    a.href = `/api/download?url=${encodedUrl}`;
    a.download = ''; 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full">
      {/* গ্যালারি গ্রিড */}
      <div 
        className="grid gap-2 overflow-hidden rounded-2xl"
        style={{ gridTemplateColumns: count > 1 ? 'repeat(2, 1fr)' : 'repeat(1, 1fr)' }}
      >
        {displayItems.map((item, index) => {
          const isFirstLarge = count > 2 && index === 0;
          const isLastOverlay = count > 3 && index === 2;

          return (
            <div
              key={index}
              className={`relative group cursor-pointer overflow-hidden  border border-black/5 dark:border-white/5 ${
                isFirstLarge ? 'row-span-2' : ''
              }`}
              onClick={() => openLightbox(index)}
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className={`w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 ${
                  isFirstLarge ? 'aspect-auto' : 'aspect-4/3'
                }`}
              />

              {isLastOverlay && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-800/60 backdrop-blur-[2px] text-white font-bold  group-hover:bg-zinc-900/70">
                  <span className="text-lg">+ {toBengaliNumber(count - 3)} টি</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* লাইটবক্স */}
      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        index={photoIndex}
        slides={items}
        plugins={[Zoom, Download, Counter]}
        zoom={{
          scrollToZoom: true,
          maxZoomPixelRatio: 3,
        }}
        counter={{ style: { top: 0, left: 0 } }}
        carousel={{ finite: items.length === 1 }}
        
        // 🔹 ডাউনলোড ইভেন্ট ওভাররাইড করা হলো
     // 🔹 ডাউনলোড ইভেন্ট ওভাররাইড করা হলো
        on={{
          download: ({ index }) => {
            // index ব্যবহার করে items অ্যারে থেকে সোর্স বের করছি
            const currentSlide = items[index];
            if (currentSlide && currentSlide.src) {
              handleForceDownload(currentSlide.src);
            }
          }
        }}
        
        render={{
          buttonPrev: items.length <= 1 ? () => null : undefined,
          buttonNext: items.length <= 1 ? () => null : undefined,
        }}
      />
    </div>
  );
}