import { useEffect, useState } from "react";

interface Child {
  kind: string;
  data: { title: string; selftext_html?: string; url: string; score: string };
}

interface ResultsAttributes {
  kind: string;
  data: {
    after: string;
    dist: number;
    modhash: string;
    geo_filter: string;
    children: Child[];
    before: boolean;
  };
}

function App() {
  const [results, setResults] = useState<Child[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchingDetails = async () => {
      setLoading(true);
      try {
        const fetchURL = await fetch("https://www.reddit.com/r/reactjs.json");
        if (fetchURL.ok) {
          const payloadResult: ResultsAttributes = await fetchURL.json();
          setResults(payloadResult.data.children);
        } else {
          setErrorMessage("Failed to fetch data");
        }
      } catch (error) {
        setErrorMessage("Something went wrong.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchingDetails();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (errorMessage) return <p>{errorMessage}</p>;

  const decodeHTML = (html: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-12">
      <div className="max-w-xl space-y-4 mx-auto">
        <small className="opacity-40 uppercase">Reddit Feed</small>
        <h2 className="text-3xl font-bold tracking-tight pt-2">
          What’s Buzzing in{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
            ReactJS?
          </span>
        </h2>
        <p className="text-muted-foreground text-base">
          Stay in the loop with the latest discussions, insights, questions, and
          tips from the ReactJS community on Reddit. Whether you're a newbie or
          an expert, there's always something new to learn.
        </p>
      </div>

      <div className="space-y-12 mt-16">
        {results.map((item) => (
          <div
            key={item.data.title}
            className="p-4 rounded space-y-4 border bg-black/5"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <h3 className="font-semibold sm:text-lg">
                {item.data.title ?? "No Title"}
              </h3>
              <p className="text-sm opacity-70">
                Score: {item.data.score ?? "Unknown"}
              </p>
            </div>
            <div className="border p-5 overflow-scroll bg-white">
              {item.data.selftext_html ? (
                <div
                  className="prose max-w-none mt-2 text-sm sm:text-base"
                  dangerouslySetInnerHTML={{
                    __html: decodeHTML(item.data.selftext_html),
                  }}
                />
              ) : (
                <p className="text-gray-500">No content available.</p>
              )}
            </div>

            <p className="text-sm sm:text-base">
              Wanna read more?{" "}
              <a
                href={item.data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 font-medium underline text-blue-600"
              >
                Click here
              </a>
            </p>
          </div>
        ))}
      </div>
      <footer className="w-full bg-gray-900 text-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm opacity-70">
            Powered by Reddit • ReactJS Community Feed
          </p>
          <p className="text-sm mt-2 md:mt-0">
            Built with ❤️ using React & Tailwind CSS
          </p>
        </div>
      </footer>
      <div className="text-center mt-8 sm:mt-16">
        <small>
          Build by{" "}
          <a
            href="https://kalyanyama.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-medium "
          >
            @kalyanyama
          </a>
        </small>
      </div>
    </div>
  );
}

export default App;
