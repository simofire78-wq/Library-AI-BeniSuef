export default function Chatbot() {
  return (
    /* الحاوية دي بتخلي الفريم ياخد المساحة المتاحة له جوه موقعك */
    <div className="w-full h-[calc(100vh-4rem)] rounded-lg overflow-hidden border border-gray-800 bg-[#0a0a0a]">
      <iframe 
        src="https://venerable-dusk-7b7f64.netlify.app/" 
        className="w-full h-full border-none"
        title="نظام الشات والتحليلات"
        allow="clipboard-write; microphone"
      />
    </div>
  );
}