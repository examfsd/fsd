import React from 'react';

// Placeholder Component for Meme Card since logic wasn't provided
const MemeCard = ({ title }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
    <div className="h-48 bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
      <span className="text-4xl group-hover:scale-110 transition-transform">🖼️</span>
    </div>
    <div className="p-4">
      <h3 className="font-bold text-lg dark:text-white">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">@User123</p>
    </div>
  </div>
);

const Home = () => {
  return (
    <div className="space-y-12">
      
      {/* --- HERO SECTION --- */}
      <section className="text-center space-y-6 py-10">
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
          Grok's Funniest Moments
        </h1>
        
        {/* YouTube Embed */}
        <div className="mx-auto w-full max-w-3xl aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-700">
          <iframe 
            className="w-full h-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=placeholder" 
            title="Grok's Moments"
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>

        {/* Audio Clip */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">Now Playing: Why Memes Rule AI</p>
          <audio controls className="w-full max-w-md">
            {/* Replace with your local file path in public/assets */}
            <source src="/assets/meme-narration.mp3" type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      </section>

      {/* --- MEME FEED --- */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold dark:text-white">Trending Memes</h2>
          <button className="text-blue-600 hover:underline text-sm">View All</button>
        </div>
        
        {/* Responsive Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <MemeCard title="When the code compiles first try" />
          <MemeCard title="CSS Centering struggle" />
          <MemeCard title="AI taking over my job like..." />
          <MemeCard title="Dark mode bugs be like" />
          <MemeCard title="Git push --force" />
          <MemeCard title="Friday Deployments" />
        </div>
      </section>
      
    </div>
  );
};

export default Home;