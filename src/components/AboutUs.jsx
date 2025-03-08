import { useState } from 'react';

const AboutUs = () => {
  const [expanded, setExpanded] = useState(false);

  const articleText = `Our journey began with a simple yet profound belief: that everyone deserves the opportunity to build a brighter future through smart, informed investments. At our investment platform, we are driven by the dreams of transforming lives and communities by empowering individuals to take control of their financial destinies. Our goals are rooted in transparency, innovation, and the conviction that every investment—no matter how small—has the power to create lasting change.

We envision a platform where financial success is not reserved for a select few, but is accessible to all. By providing a user-friendly interface, comprehensive educational resources, and a supportive community, we strive to bridge the gap between traditional finance and everyday investors. Our unique referral system and diverse investment plans reward dedication while nurturing a spirit of collaboration, where each member’s progress contributes to the collective success of the community.

Beyond numbers and transactions, our dreams extend to a future where investments serve as a pathway to personal growth, community upliftment, and global transformation. We believe in a world where every decision is informed, every risk is measured, and every reward is shared. Through our platform, we aim to create a legacy of empowerment, resilience, and shared prosperity that transcends financial gain.

Join us as we innovate, inspire, and redefine the meaning of investing in tomorrow. Together, we are building more than wealth—we are sparking a movement that celebrates ambition, nurtures dreams, and transforms the way we view money and success.`;

  // Use a regex to split the text robustly
  const words = articleText.trim().split(/\s+/);
  const wordCount = words.length;
  const previewText = words.slice(0, 250).join(' ');

  return (
    <section id="about" className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">About Us</h2>
        <div className="flex flex-col md:flex-row items-center">
          {/* On desktop, show the image on the left; hide on mobile */}
          <div className="hidden md:block md:w-1/3 p-4">
            <img
              src="/about-us.jpg" // Replace with your actual image path
              alt="About Us"
              className="w-full h-auto object-cover rounded"
            />
          </div>
          <div className="w-full md:w-2/3 p-4">
            <p className="text-lg">
              {expanded || wordCount <= 250 ? articleText : `${previewText} ...`}
            </p>
            {wordCount > 250 && !expanded && (
              <button
                onClick={() => setExpanded(true)}
                className="mt-4 text-blue-500 hover:underline"
              >
                Read More
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
