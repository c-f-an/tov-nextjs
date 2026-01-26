import React from "react";

interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  backgroundImage?: string;
  children?: React.ReactNode;
  overlayColor?: string;
  overlayOpacity?: number;
}

export default function PageHeader({
  title,
  description,
  className = "",
  backgroundImage,
  children,
  overlayColor = "black",
  overlayOpacity = 40,
}: PageHeaderProps) {
  if (backgroundImage) {
    return (
      <div
        className={`relative text-center mb-12 py-4 px-4 rounded-2xl overflow-hidden ${className}`}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0"
          style={{ backgroundColor: overlayColor, opacity: overlayOpacity / 100 }}
        />
        <div className="relative z-10 mb-16">
          {children && (
            <div className="absolute top-0 left-0 mb-4">
              {children}
            </div>
          )}
          <div className="pt-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {title}
            </h1>
            {description && <p className="text-base md:text-xl text-white/90">{description}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`text-center mb-12 ${className}`}>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        {title}
      </h1>
      {description && <p className="text-[#324CBB]">{description}</p>}
    </div>
  );
}
