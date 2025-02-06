import React, { useEffect, useRef } from 'react';

interface ContentProps {
  content: string;
  isActive: boolean;
}

const Content: React.FC<ContentProps> = ({ content, isActive }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && contentRef.current) {
      contentRef.current.style.opacity = '0';
      contentRef.current.style.transform = 'translateY(50px)';
      
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
          contentRef.current.style.opacity = '1';
          contentRef.current.style.transform = 'translateY(0)';
        }
      }, 100);
    }
  }, [isActive]);

  return (
    <div
      ref={contentRef}
      className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
        isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
      }`}
    >
      <div className="text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-4">{content}</h2>
        <p className="text-xl md:text-2xl">
          {content === 'Punch Conteúdo'
            ? 'PRODUTORA DE EDUCAÇÃO CORPORATIVA PARA GRANDES EMPRESAS'
            : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
        </p>
      </div>
    </div>
  );
};

export default Content;

