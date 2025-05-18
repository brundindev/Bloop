import { useEffect } from 'react';
import { useRouter } from 'next/router';

const IndexPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirigir a la página de bienvenida
    router.replace('/welcome');
  }, [router]);

  return null;
};

export default IndexPage; 