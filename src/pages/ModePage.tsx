import { useParams } from 'react-router-dom';

const ModePage = () => {
  const { mode } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Mode: {mode}</h1>
      <p className="mt-4 text-lg">This is the page for {mode} mode. You can add specific functionality here.</p>
    </div>
  );
};

export default ModePage;
