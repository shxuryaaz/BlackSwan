import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Logo = ({ size = "md", className }: LogoProps) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className={cn("bg-white rounded-full flex items-center justify-center border border-gray-200", sizeClasses[size])}>
        <svg 
          viewBox="0 0 100 50" 
          className="w-full h-full p-1"
          fill="currentColor"
        >
          {/* Black Swan Body */}
          <path 
            d="M20 25 Q15 20 12 15 Q10 10 15 8 Q20 6 25 8 Q30 10 35 12 Q40 15 45 18 Q50 20 55 22 Q60 25 55 30 Q50 35 45 35 Q40 35 35 33 Q30 30 25 28 Q20 25 20 25 Z" 
            fill="black"
          />
          {/* Swan Neck */}
          <path 
            d="M55 22 Q65 15 70 10 Q75 5 80 8 Q82 10 80 15 Q78 20 75 22 Q72 23 70 22 Q68 21 65 20 Q62 19 55 22 Z" 
            fill="black"
          />
          {/* Swan Head */}
          <circle cx="80" cy="12" r="6" fill="black"/>
          {/* Red Beak */}
          <path d="M85 12 L90 10 L88 14 Z" fill="#E50000"/>
          {/* Eye */}
          <circle cx="82" cy="10" r="1" fill="white"/>
          {/* Wing Details */}
          <path d="M25 15 L35 12 L30 18 Z" fill="black" opacity="0.7"/>
          <path d="M30 18 L40 15 L35 22 Z" fill="black" opacity="0.5"/>
          <path d="M35 22 L45 18 L40 25 Z" fill="black" opacity="0.3"/>
        </svg>
      </div>
              <span className="font-bold text-primary">BlackSwan</span>
    </div>
  );
};

export default Logo; 