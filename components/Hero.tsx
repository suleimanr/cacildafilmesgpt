import React, { useEffect, useRef } from 'react';

const Hero: React.FC = () => {
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.opacity = '0';
      titleRef.current.style.transform = 'translateY(150px)';
      
      setTimeout(() => {
        if (titleRef.current) {
          titleRef.current.style.transition = 'opacity 3s, transform 3s';
          titleRef.current.style.opacity = '1';
          titleRef.current.style.transform = 'translateY(0)';
        }
      }, 100);
    }
  }, []);

  return (
    <section className="min-h-screen flex flex-col justify-center items-center p-8">
      <div ref={titleRef} className="text-center">
        <h1 className="text-6xl md:text-8xl font-bold mb-4">Punch Conteúdo</h1>
        <p className="text-xl md:text-2xl max-w-2xl">
          PRODUTORA DE EDUCAÇÃO CORPORATIVA PARA GRANDES EMPRESAS
        </p>
      </div>
    </section>
  );
};

export default Hero;

