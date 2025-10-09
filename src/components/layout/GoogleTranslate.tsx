import { useEffect } from "react";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

export default function GoogleTranslate() {
  useEffect(() => {
    const scriptId = "google-translate-script";
    if (document.getElementById(scriptId)) return; // avoid duplicates

    const script = document.createElement("script");
    script.id = scriptId;
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;

    // define callback for Google script
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "auto",
          includedLanguages: "en,es,fr,de,ar,bn,hi,zh,ja,ru",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: true, // shows popup automatically if needed
        },
        "google_translate_element"
      );
    };

    document.body.appendChild(script);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* You can customize this container */}
      <div
        id="google_translate_element"
        className="bg-white p-2 rounded-md shadow-md"
      />
    </div>
  );
}
