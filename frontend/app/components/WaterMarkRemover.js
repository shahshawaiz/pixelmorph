import Layout from './Layout';
import styles from '../styles/WaterMarkRemover.module.css';

const WaterMarkRemover = () => {
  return (
    <Layout>
      <div className={`${styles.container} flex flex-col items-center justify-center min-h-screen`}>       
        <h1 className="text-5xl font-bold mb-6">Coming Soon</h1>
        <p className="text-lg text-gray-600 mb-8">The Watermark Remover feature is currently under development. Stay tuned for updates!</p>
      </div>
    </Layout>
  );
};

export default WaterMarkRemover;
