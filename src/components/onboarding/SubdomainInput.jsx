import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import debounce from "lodash/debounce";

const SubdomainInput = ({ onSuccess }) => {
  const [subdomain, setSubdomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);
  const { checkSubdomain } = useAuth();

  const checkAvailability = debounce(async (value) => {
    if (!value) {
      setIsAvailable(null);
      return;
    }

    setLoading(true);
    try {
      const response = await checkSubdomain(value);
      setIsAvailable(response.isAvailable);
      if (!response.isAvailable) {
        toast.error("This subdomain is already taken");
      }
    } catch (error) {
      toast.error(error.message || "Failed to check subdomain");
      setIsAvailable(null);
    } finally {
      setLoading(false);
    }
  }, 500);

  useEffect(() => {
    if (subdomain) {
      checkAvailability(subdomain);
    }
    return () => checkAvailability.cancel();
  }, [subdomain]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAvailable) {
      onSuccess(subdomain);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="subdomain"
            className="block text-sm font-medium text-gray-700"
          >
            Choose your subdomain
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              id="subdomain"
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value.toLowerCase())}
              placeholder="your-brand-name"
              className={`block w-full rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${
                isAvailable === true
                  ? "border-green-500"
                  : isAvailable === false
                  ? "border-red-500"
                  : ""
              }`}
              required
            />
            <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
              .linktree.com
            </span>
          </div>
          {loading && (
            <p className="mt-2 text-sm text-gray-500">
              Checking availability...
            </p>
          )}
          {!loading && isAvailable === true && (
            <p className="mt-2 text-sm text-green-600">✓ Available</p>
          )}
          {!loading && isAvailable === false && (
            <p className="mt-2 text-sm text-red-600">✗ Already taken</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading || !isAvailable}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default SubdomainInput;
