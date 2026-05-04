'use client';

import * as React from 'react';
import { motion, useMotionValue, useSpring, useAnimationFrame } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

// Interface for the props of each individual icon.
interface IconProps {
  id: number;
  domain: string; // Used to reference the local logo in /public/logos/
  className: string; // Used for custom positioning of the icon.
}

// Interface for the main hero component's props.
export interface FloatingIconsHeroProps {
  title: string | React.ReactNode;
  subtitle: string | React.ReactNode;
  ctaText: string;
  ctaHref: string;
  icons: IconProps[];
}

// A single icon component with its own motion logic
const Icon = ({
  mouseX,
  mouseY,
  iconData,
  index,
}: {
  mouseX: React.MutableRefObject<number>;
  mouseY: React.MutableRefObject<number>;
  iconData: IconProps;
  index: number;
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  // Motion values for the icon's position, with spring physics for smooth movement
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  // Use useAnimationFrame to check mouse distance and apply repulsion force
  useAnimationFrame(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const iconCenterX = rect.left + rect.width / 2;
      const iconCenterY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(mouseX.current - iconCenterX, 2) +
        Math.pow(mouseY.current - iconCenterY, 2)
      );

      // If the cursor is close enough, repel the icon
      if (distance < 150) {
        const angle = Math.atan2(
          mouseY.current - iconCenterY,
          mouseX.current - iconCenterX
        );
        // The closer the cursor, the stronger the repulsion
        const force = (1 - distance / 150) * 50;
        x.set(-Math.cos(angle) * force);
        y.set(-Math.sin(angle) * force);
      } else {
        // Return to original position when cursor is away
        x.set(0);
        y.set(0);
      }
    }
  });

  // Use a deterministic duration based on the icon's ID to ensure hydration stability and purity
  const deterministicDuration = React.useMemo(() => 5 + (iconData.id % 5), [iconData.id]);

  return (
    <motion.div
      ref={ref}
      key={iconData.id}
      style={{
        x: springX,
        y: springY,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.08,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn('absolute', iconData.className)}
    >
      {/* Inner wrapper for the continuous floating animation */}
      <motion.div
        className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 p-3 rounded-3xl shadow-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 overflow-hidden"
        animate={{
          y: [0, -8, 0, 8, 0],
          x: [0, 6, 0, -6, 0],
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: deterministicDuration,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
      >
        <div className="relative w-8 h-8 md:w-10 md:h-10">
          <Image 
            src={`/logos/${iconData.domain}.png`} 
            alt={`${iconData.domain} logo`} 
            fill
            className="object-contain"
            sizes="(max-width: 768px) 32px, 40px"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

const FloatingIconsHero = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & FloatingIconsHeroProps
>(({ className, title, subtitle, ctaText, ctaHref, icons, ...props }, ref) => {
  // Refs to track the raw mouse position
  const mouseX = React.useRef(0);
  const mouseY = React.useRef(0);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    mouseX.current = event.clientX;
    mouseY.current = event.clientY;
  };

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn(
        'relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-background',
        className
      )}
      {...props}
    >
      {/* Container for the background floating icons */}
      <div className="absolute inset-0 w-full h-full">
        {icons.map((iconData, index) => (
          <Icon
            key={iconData.id}
            mouseX={mouseX}
            mouseY={mouseY}
            iconData={iconData}
            index={index}
          />
        ))}
      </div>

      {/* Container for the foreground content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="text-5xl md:text-7xl font-bold tracking-tight text-white">
          {title}
        </div>
        <div className="mt-6 max-w-2xl mx-auto text-lg text-slate-400">
          {subtitle}
        </div>
        <div className="mt-10">
          <Button asChild size="lg" className="px-10 py-7 text-base font-semibold rounded-full bg-highlight text-slate-900 hover:bg-highlight/90 shadow-xl shadow-highlight/20 transition-all active:scale-95">
            <a href={ctaHref}>{ctaText}</a>
          </Button>
        </div>
      </div>
    </section>
  );
});

FloatingIconsHero.displayName = 'FloatingIconsHero';

export { FloatingIconsHero };
