export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="text-center space-y-6 animate-fadeIn">
        <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-600 animate-gradient">
          Welcome to Linktree Clone
        </h1>
        <p className="text-xl mb-8 text-gray-600 animate-slideUp">
          Create your digital presence in minutes
        </p>
        <a
          href="/onboarding/phone"
          className="inline-block bg-black text-white px-8 py-4 rounded-full 
            hover:shadow-[0_0_15px_rgba(0,0,0,0.3)] 
            hover:scale-105 
            transition-all 
            duration-300 
            ease-out
            animate-pulse-slow
            relative
            after:content-['']
            after:absolute
            after:inset-0
            after:rounded-full
            after:border-2
            after:border-black
            after:animate-ripple"
        >
          Get Started
        </a>
      </div>
    </main>
  );
}
