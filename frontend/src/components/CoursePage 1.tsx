import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface CoursePageProps {
  fileName: string;
}

const CoursePage: React.FC<CoursePageProps> = ({ fileName }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/${fileName}.md`)
      .then((res) => {
        const contentType = res.headers.get('content-type');
        if (!res.ok || (contentType && contentType.includes('text/html'))) {
          throw new Error(`A(z) "${fileName}.md" dokumentum nem található.`);
        }
        return res.text();
      })
      .then((text) => {
        setContent(text);
        setError(null);
      })
      .catch((err: Error) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [fileName]);

  if (loading) {
    return <div className="p-4 text-center">Dokumentáció betöltése...</div>;
  }

  if (error) {
    return <div className="p-4 text-danger text-center">Hiba: {error}</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default CoursePage;