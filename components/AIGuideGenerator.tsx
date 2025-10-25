import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { generateBuyingGuide } from '../services/geminiService';

export const AIGuideGenerator: React.FC = () => {
  const { t, language } = useLocalization();
  const [topic, setTopic] = useState('');
  const [guide, setGuide] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError(t('aiGuide.error.topicRequired'));
      return;
    }
    setIsLoading(true);
    setError(null);
    setGuide('');
    try {
      const result = await generateBuyingGuide(topic, language.code);
      setGuide(result);
    } catch (err) {
      setError(t('aiGuide.error.generationFailed'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="my-12 bg-secondary p-8 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-white mb-2 text-center">
        {t('aiGuide.title')} 🤖
      </h2>
      <p className="text-light text-center mb-6 max-w-2xl mx-auto">
        {t('aiGuide.subtitle')}
      </p>

      <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={t('aiGuide.placeholder')}
          className="flex-grow w-full py-3 px-4 bg-accent text-highlight rounded-lg focus:outline-none focus:ring-4 focus:ring-brand/50 transition-all duration-300"
          disabled={isLoading}
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="bg-brand text-primary font-bold py-3 px-8 rounded-lg hover:bg-sky-400 transition-colors duration-300 disabled:bg-accent disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="mx-3">{t('aiGuide.loading')}</span>
            </div>
          ) : t('aiGuide.buttonText')}
        </button>
      </div>

      {error && <p className="text-red-400 mt-4 text-center">{error}</p>}

      {guide && (
        <div className="mt-8 bg-primary p-6 rounded-lg prose prose-invert max-w-none text-highlight prose-p:text-light prose-headings:text-white">
          <h3 className="text-2xl font-bold text-white mb-4">{t('aiGuide.guideTitle', { topic })}</h3>
          <div className="whitespace-pre-wrap leading-relaxed">
            {guide}
          </div>
        </div>
      )}
    </section>
  );
};
