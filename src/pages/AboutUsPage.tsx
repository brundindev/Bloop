import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '../layouts/MainLayout';
import ScrollExpandMedia from '../components/blocks/scroll-expansion-hero';

interface TeamMemberInfo {
  name: string;
  role: string;
  bio: string;
  avatar: string;
}

interface MediaAbout {
  overview: string;
  conclusion: string;
}

interface MediaContent {
  src: string;
  poster?: string;
  background: string;
  title: string;
  date: string;
  scrollToExpand: string;
  about: MediaAbout;
}

interface MediaContentCollection {
  [key: string]: MediaContent;
}

const teamMembers: TeamMemberInfo[] = [
  {
    name: 'Alejandro González',
    role: 'Fundador y CEO',
    bio: 'Experto en redes sociales y marketing digital con más de 10 años de experiencia. Alejandro fundó Bloop con la visión de crear un espacio social más auténtico y humano.',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop'
  },
  {
    name: 'Mónica Rodríguez',
    role: 'Directora de Diseño',
    bio: 'Con un ojo extraordinario para el diseño de experiencias, Mónica ha transformado la forma en que los usuarios interactúan con nuestra plataforma, centrándose en la simplicidad y belleza.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop'
  },
  {
    name: 'Carlos Mendoza',
    role: 'Director de Tecnología',
    bio: 'Ingeniero de software con experiencia en startups exitosas, Carlos lidera nuestros equipos de desarrollo para crear una plataforma robusta, segura y escalable.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
  }
];

const aboutUsContent: MediaContentCollection = {
  video: {
    src: 'https://player.vimeo.com/video/517079862?autoplay=1&loop=1&background=1',
    poster: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1280&auto=format&fit=crop',
    background: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1280&auto=format&fit=crop',
    title: 'Conectando Personas Auténticas',
    date: 'Est. 2023',
    scrollToExpand: 'Desliza para descubrir nuestra historia',
    about: {
      overview:
        'Bloop nació de una idea simple: crear un espacio donde las personas puedan conectarse de forma auténtica y significativa. En un mundo digital saturado de contenido superficial, queríamos construir una comunidad basada en conversaciones genuinas y conexiones reales.',
      conclusion:
        'Nuestra misión es transformar la forma en que las personas interactúan en línea, fomentando relaciones significativas y creando un impacto positivo en la vida de nuestros usuarios. Creemos en el poder de la autenticidad y la comunidad para construir un futuro digital más humano.',
    },
  },
  image: {
    src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1280&auto=format&fit=crop',
    background: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?q=80&w=1280&auto=format&fit=crop',
    title: 'Nuestro Equipo',
    date: 'Talento y Pasión',
    scrollToExpand: 'Desliza para conocer al equipo',
    about: {
      overview:
        'Detrás de Bloop hay un equipo diverso y apasionado de profesionales dedicados a crear la mejor experiencia posible para nuestros usuarios. Combinando experiencia en tecnología, diseño y comunicación, trabajamos juntos para redefinir las redes sociales.',
      conclusion:
        'Lo que nos une es nuestra pasión compartida por crear conexiones humanas significativas en el mundo digital. Cada miembro de nuestro equipo aporta una perspectiva única y valiosa, permitiéndonos innovar constantemente y mejorar la plataforma.',
    },
  },
};

const MediaContent = ({ mediaType }: { mediaType: 'video' | 'image' }) => {
  const currentMedia = aboutUsContent[mediaType];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-black dark:text-white">
        Nuestra Historia
      </h2>
      <p className="text-lg mb-8 text-black dark:text-white">
        {currentMedia.about.overview}
      </p>

      <p className="text-lg mb-8 text-black dark:text-white">
        {currentMedia.about.conclusion}
      </p>

      {mediaType === 'image' && (
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6 text-black dark:text-white">
            Nuestro Equipo
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md"
              >
                <div className="flex flex-col items-center">
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover mb-4"
                  />
                  <h4 className="text-xl font-bold text-center text-gray-900 dark:text-white">
                    {member.name}
                  </h4>
                  <p className="text-primary-600 dark:text-primary-400 mb-3 text-center">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const AboutUsPage = () => {
  const [mediaType, setMediaType] = useState<'video' | 'image'>('video');
  const currentMedia = aboutUsContent[mediaType];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [mediaType]);

  return (
    <MainLayout>
      <div className="min-h-screen">
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <button
            onClick={() => setMediaType('video')}
            className={`px-4 py-2 rounded-lg ${
              mediaType === 'video'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600'
            }`}
          >
            Historia
          </button>

          <button
            onClick={() => setMediaType('image')}
            className={`px-4 py-2 rounded-lg ${
              mediaType === 'image'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600'
            }`}
          >
            Equipo
          </button>
        </div>

        <ScrollExpandMedia
          mediaType={mediaType}
          mediaSrc={currentMedia.src}
          posterSrc={mediaType === 'video' ? currentMedia.poster : undefined}
          bgImageSrc={currentMedia.background}
          title={currentMedia.title}
          date={currentMedia.date}
          scrollToExpand={currentMedia.scrollToExpand}
          textBlend
        >
          <MediaContent mediaType={mediaType} />
        </ScrollExpandMedia>
      </div>
    </MainLayout>
  );
};

export default AboutUsPage; 