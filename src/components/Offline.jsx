const Offline = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-200 dark:bg-gray-800 dark:text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 animate-fade-in dark:text-white">
          You are Offline
          <br /> Check your Internet connection!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Please reconnect to the internet and try again.
        </p>
      </div>
    </div>
  );
};

export default Offline;
