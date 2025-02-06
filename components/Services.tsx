import React from 'react';

const services = [
  'Empreendedorismo',
  'Cultura',
  'Liderança',
  'Onboarding'
];

const Services: React.FC = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center p-8 bg-yellow-300">
      <h2 className="text-4xl md:text-6xl font-bold mb-12">Nossos Serviços</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service, index) => (
          <div key={index} className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4">{service}</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;

