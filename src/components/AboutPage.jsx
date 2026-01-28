import React from 'react';

const AboutPage = () => {
  return (
    <div className="container mx-auto p-8 bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">About Us</h1>

      <p className="mb-4">
        Welcome to VirtuCart, your stylish and sophisticated shopping destination. We are committed to providing you with
        top-notch products and an exceptional shopping experience.
      </p>

      <p className="mb-4">
        At VirtuCart, we believe in the magic of online shopping to make your life more convenient and luxurious. Our
        platform offers an eclectic range of products from various categories, including cutting-edge electronics,
        trendy fashion items, and elegant home goods.
      </p>

      <p className="mb-4">
        Our mission is to deliver elegance and quality at every step. We pride ourselves on our commitment to style,
        reliability, and impeccable customer service.
      </p>

      <p className="mb-4">
        Whether you're looking for the latest gadgets, the trendiest fashion pieces, or sophisticated home essentials,
        VirtuCart has got you covered. Dive into our carefully curated selection and indulge in the luxury of secure
        online shopping.
      </p>

      <p className="mb-4">Thank you for choosing VirtuCart. Elevate your lifestyle with us.</p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Our Team</h2>
      <p className="mb-4">
        Meet the avant-garde team behind VirtuCart. Our team comprises passionate individuals who tirelessly curate the
        best products and craft a seamless shopping experience for you.
      </p>

      {/* Add any additional sections or details about your ecommerce business */}

      <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
      <p className="mb-4">
        If you have any questions, feedback, or inquiries, feel free to reach out to our customer support team. We are
        here to assist you and ensure your satisfaction.
      </p>

      <p className="mb-4">
        Email: <span className="text-blue-500">support@virtucart.com</span> <br />
        Phone: <span className="text-blue-500">1-800-123-4567</span>
      </p>
    </div>
  );
};

export default AboutPage;
