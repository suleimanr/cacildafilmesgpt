import React from 'react';

const projects = [
  'Construção de confiança',
  'Case XP Benchimol',
  'Empreendedoras da Beleza',
  'Academia de Liderança',
  'Projeto Essências'
];

const Projects: React.FC = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center p-8 bg-black text-white">
      <h2 className="text-4xl md:text-6xl font-bold mb-12">Nossos Projetos</h2>
      <div className="space-y-8">
        {projects.map((project, index) => (
          <div key={index} className="text-center">
            <h3 className="text-3xl md:text-5xl font-bold">{project}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;

